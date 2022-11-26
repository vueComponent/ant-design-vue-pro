import * as _ from './utils/utils';
import {version} from '../../package';
import {parseToHSVA} from './utils/color';
import {HSVaColor} from './utils/hsvacolor';
import Moveable from './libs/moveable';
import Selectable from './libs/selectable';
import buildPickr from './template';
import {createPopper} from 'nanopop';

class Pickr {

    // Expose pickr utils
    static utils = _;

    // Assign version and export
    static version = version;

    // Default strings
    static I18N_DEFAULTS = {

        // Strings visible in the UI
        'ui:dialog': 'color picker dialog',
        'btn:toggle': 'toggle color picker dialog',
        'btn:swatch': 'color swatch',
        'btn:last-color': 'use previous color',
        'btn:save': 'Save',
        'btn:cancel': 'Cancel',
        'btn:clear': 'Clear',

        // Strings used for aria-labels
        'aria:btn:save': 'save and close',
        'aria:btn:cancel': 'cancel and close',
        'aria:btn:clear': 'clear and close',
        'aria:input': 'color input field',
        'aria:palette': 'color selection area',
        'aria:hue': 'hue selection slider',
        'aria:opacity': 'selection slider'
    };

    // Default options
    static DEFAULT_OPTIONS = {
        appClass: null,
        theme: 'classic',
        useAsButton: false,
        padding: 8,
        disabled: false,
        comparison: true,
        closeOnScroll: false,
        outputPrecision: 0,
        lockOpacity: false,
        autoReposition: true,
        container: 'body',

        components: {
            interaction: {}
        },

        i18n: {},
        swatches: null,
        inline: false,
        sliders: null,

        default: '#42445a',
        defaultRepresentation: null,
        position: 'bottom-middle',
        adjustableNumbers: true,
        showAlways: false,

        closeWithKey: 'Escape'
    };

    // Will be used to prevent specific actions during initilization
    _initializingActive = true;

    // If the current color value should be recalculated
    _recalc = true;

    // Positioning engine and DOM-Tree
    _nanopop = null;
    _root = null;

    // Current and last color for comparison
    _color = HSVaColor();
    _lastColor = HSVaColor();
    _swatchColors = [];

    // Evenlistener name: [callbacks]
    _eventListener = {
        init: [],
        save: [],
        hide: [],
        show: [],
        clear: [],
        change: [],
        changestop: [],
        cancel: [],
        swatchselect: []
    };

    constructor(opt) {

        // Assign default values
        this.options = opt = Object.assign({...Pickr.DEFAULT_OPTIONS}, opt);

        const {swatches, components, theme, sliders, lockOpacity, padding} = opt;

        if (['nano', 'monolith'].includes(theme) && !sliders) {
            opt.sliders = 'h';
        }

        // Check interaction section
        if (!components.interaction) {
            components.interaction = {};
        }

        // Overwrite palette if preview, opacity or hue are true
        const {preview, opacity, hue, palette} = components;
        components.opacity = (!lockOpacity && opacity);
        components.palette = palette || preview || opacity || hue;

        // Initialize picker
        this._preBuild();
        this._buildComponents();
        this._bindEvents();
        this._finalBuild();

        // Append pre-defined swatch colors
        if (swatches && swatches.length) {
            swatches.forEach(color => this.addSwatch(color));
        }

        // Initialize positioning engine
        const {button, app} = this._root;
        this._nanopop = createPopper(button, app, {
            margin: padding
        });

        // Initialize accessibility
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', this._t('btn:toggle'));

        // Initilization is finish, pickr is visible and ready for usage
        const that = this;
        requestAnimationFrame((function cb() {

            // TODO: Performance issue due to high call-rate?
            if (!app.offsetWidth) {
                return requestAnimationFrame(cb);
            }

            // Apply default color
            that.setColor(opt.default);
            that._rePositioningPicker();

            // Initialize color representation
            if (opt.defaultRepresentation) {
                that._representation = opt.defaultRepresentation;
                that.setColorRepresentation(that._representation);
            }

            // Show pickr if locked
            if (opt.showAlways) {
                that.show();
            }

            // Initialization is done - pickr is usable, fire init event
            that._initializingActive = false;
            that._emit('init');
        }));
    }

    // Create instance via method
    static create = options => new Pickr(options);

    // Does only the absolutly basic thing to initialize the components
    _preBuild() {
        const {options} = this;

        // Resolve elements
        for (const type of ['el', 'container']) {
            options[type] = _.resolveElement(options[type]);
        }

        // Create element and append it to body to
        // Prevent initialization errors
        this._root = buildPickr(this);

        // Check if a custom button is used
        if (options.useAsButton) {
            this._root.button = options.el; // Replace button with customized button
        }

        options.container.appendChild(this._root.root);
    }

    _finalBuild() {
        const opt = this.options;
        const root = this._root;

        // Remove from body
        opt.container.removeChild(root.root);

        if (opt.inline) {
            const parent = opt.el.parentElement;

            if (opt.el.nextSibling) {
                parent.insertBefore(root.app, opt.el.nextSibling);
            } else {
                parent.appendChild(root.app);
            }
        } else {
            opt.container.appendChild(root.app);
        }

        // Don't replace the the element if a custom button is used
        if (!opt.useAsButton) {

            // Replace element with actual color-picker
            opt.el.parentNode.replaceChild(root.root, opt.el);
        } else if (opt.inline) {
            opt.el.remove();
        }

        // Check if it should be immediatly disabled
        if (opt.disabled) {
            this.disable();
        }

        // Check if color comparison is disabled, if yes - remove transitions so everything keeps smoothly
        if (!opt.comparison) {
            root.button.style.transition = 'none';

            if (!opt.useAsButton) {
                root.preview.lastColor.style.transition = 'none';
            }
        }

        this.hide();
    }

    _buildComponents() {

        // Instance reference
        const inst = this;
        const cs = this.options.components;
        const sliders = (inst.options.sliders || 'v').repeat(2);
        const [so, sh] = sliders.match(/^[vh]+$/g) ? sliders : [];

        // Re-assign if null
        const getColor = () =>
            this._color || (this._color = this._lastColor.clone());

        const components = {

            palette: Moveable({
                element: inst._root.palette.picker,
                wrapper: inst._root.palette.palette,

                onstop: () => inst._emit('changestop', inst),
                onchange(x, y) {
                    if (!cs.palette) {
                        return;
                    }

                    const color = getColor();
                    const {_root, options} = inst;
                    const {lastColor, currentColor} = _root.preview;

                    // Update the input field only if the user is currently not typing
                    if (inst._recalc) {

                        // Calculate saturation based on the position
                        color.s = x * 100;

                        // Calculate the value
                        color.v = 100 - y * 100;

                        // Prevent falling under zero
                        color.v < 0 ? color.v = 0 : 0;
                        inst._updateOutput();
                    }

                    // Set picker and gradient color
                    const cssRGBaString = color.toRGBA().toString(0);
                    this.element.style.background = cssRGBaString;
                    this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${color.a}), transparent),
                        linear-gradient(to left, hsla(${color.h}, 100%, 50%, ${color.a}), rgba(255, 255, 255, ${color.a}))
                    `;

                    // Check if color is locked
                    if (!options.comparison) {
                        _root.button.style.color = cssRGBaString;

                        // If the user changes the color, remove the cleared icon
                        _root.button.classList.remove('clear');
                    } else if (!options.useAsButton && !inst._lastColor) {

                        // Apply color to both the last and current color since the current state is cleared
                        lastColor.style.color = cssRGBaString;
                    }

                    // Check if there's a swatch which color matches the current one
                    const hexa = color.toHEXA().toString();
                    for (const {el, color} of inst._swatchColors) {
                        el.classList[hexa === color.toHEXA().toString() ? 'add' : 'remove']('pcr-active');
                    }

                    // Change current color
                    currentColor.style.color = cssRGBaString;
                }
            }),

            hue: Moveable({
                lock: sh === 'v' ? 'h' : 'v',
                element: inst._root.hue.picker,
                wrapper: inst._root.hue.slider,

                onstop: () => inst._emit('changestop', inst),
                onchange(v) {
                    if (!cs.hue || !cs.palette) {
                        return;
                    }

                    const color = getColor();

                    // Calculate hue
                    if (inst._recalc) {
                        color.h = v * 360;
                    }

                    // Update color
                    this.element.style.backgroundColor = `hsl(${color.h}, 100%, 50%)`;
                    components.palette.trigger();
                }
            }),

            opacity: Moveable({
                lock: so === 'v' ? 'h' : 'v',
                element: inst._root.opacity.picker,
                wrapper: inst._root.opacity.slider,

                onstop: () => inst._emit('changestop', inst),
                onchange(v) {
                    if (!cs.opacity || !cs.palette) {
                        return;
                    }

                    const color = getColor();

                    // Calculate opacity
                    if (inst._recalc) {
                        color.a = Math.round(v * 1e2) / 100;
                    }

                    // Update color
                    this.element.style.background = `rgba(0, 0, 0, ${color.a})`;
                    components.palette.trigger();
                }
            }),

            selectable: Selectable({
                elements: inst._root.interaction.options,
                className: 'active',

                onchange(e) {
                    inst._representation = e.target.getAttribute('data-type').toUpperCase();
                    inst._recalc && inst._updateOutput();
                }
            })
        };

        this._components = components;
    }

    _bindEvents() {
        const {_root, options} = this;

        const eventBindings = [

            // Clear color
            _.on(_root.interaction.clear, 'click', () => this._clearColor()),

            // Select last color on click
            _.on([
                _root.interaction.cancel,
                _root.preview.lastColor
            ], 'click', () => {
                this._emit('cancel', this);
                this.setHSVA(...(this._lastColor || this._color).toHSVA(), true);
            }),

            // Save color
            _.on(_root.interaction.save, 'click', () => {
                !this.applyColor() && !options.showAlways && this.hide();
            }),

            // User input
            _.on(_root.interaction.result, ['keyup', 'input'], e => {

                // Fire listener if initialization is finish and changed color was valid
                if (this.setColor(e.target.value, true) && !this._initializingActive) {
                    this._emit('change', this._color);
                }

                e.stopImmediatePropagation();
            }),

            // Detect user input and disable auto-recalculation
            _.on(_root.interaction.result, ['focus', 'blur'], e => {
                this._recalc = e.type === 'blur';
                this._recalc && this._updateOutput();
            }),

            // Cancel input detection on color change
            _.on([
                _root.palette.palette,
                _root.palette.picker,
                _root.hue.slider,
                _root.hue.picker,
                _root.opacity.slider,
                _root.opacity.picker
            ], ['mousedown', 'touchstart'], () => this._recalc = true, {passive: true})
        ];

        // Provide hiding / showing abilities only if showAlways is false
        if (!options.showAlways) {
            const ck = options.closeWithKey;

            eventBindings.push(

                // Save and hide / show picker
                _.on(_root.button, 'click', () => this.isOpen() ? this.hide() : this.show()),

                // Close with escape key
                _.on(document, 'keyup', e => this.isOpen() && (e.key === ck || e.code === ck) && this.hide()),

                // Cancel selecting if the user taps behind the color picker
                _.on(document, ['touchstart', 'mousedown'], e => {
                    if (this.isOpen() && !_.eventPath(e).some(el => el === _root.app || el === _root.button)) {
                        this.hide();
                    }
                }, {capture: true})
            );
        }

        // Make input adjustable if enabled
        if (options.adjustableNumbers) {
            const ranges = {
                rgba: [255, 255, 255, 1],
                hsva: [360, 100, 100, 1],
                hsla: [360, 100, 100, 1],
                cmyk: [100, 100, 100, 100]
            };

            _.adjustableInputNumbers(_root.interaction.result, (o, step, index) => {
                const range = ranges[this.getColorRepresentation().toLowerCase()];

                if (range) {
                    const max = range[index];

                    // Calculate next reasonable number
                    const nv = o + (max >= 100 ? step * 1000 : step);

                    // Apply range of zero up to max, fix floating-point issues
                    return nv <= 0 ? 0 : Number((nv < max ? nv : max).toPrecision(3));
                }

                return o;
            });
        }

        if (options.autoReposition && !options.inline) {
            let timeout = null;
            const that = this;

            // Re-calc position on window resize, scroll and wheel
            eventBindings.push(
                _.on(window, ['scroll', 'resize'], () => {
                    if (that.isOpen()) {

                        if (options.closeOnScroll) {
                            that.hide();
                        }

                        if (timeout === null) {
                            timeout = setTimeout(() => timeout = null, 100);

                            // Update position on every frame
                            requestAnimationFrame(function rs() {
                                that._rePositioningPicker();
                                (timeout !== null) && requestAnimationFrame(rs);
                            });
                        } else {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => timeout = null, 100);
                        }
                    }
                }, {capture: true})
            );
        }

        // Save bindings
        this._eventBindings = eventBindings;
    }

    _rePositioningPicker() {
        const {options} = this;

        // No repositioning needed if inline
        if (!options.inline) {
            const success = this._nanopop.update({
                container: document.body.getBoundingClientRect(),
                position: options.position
            });

            if (!success) {
                const el = this._root.app;
                const eb = el.getBoundingClientRect();
                el.style.top = `${(window.innerHeight - eb.height) / 2}px`;
                el.style.left = `${(window.innerWidth - eb.width) / 2}px`;
            }
        }
    }

    _updateOutput() {
        const {_root, _color, options} = this;

        // Check if component is present
        if (_root.interaction.type()) {

            // Construct function name and call if present
            const method = `to${_root.interaction.type().getAttribute('data-type')}`;
            _root.interaction.result.value = typeof _color[method] === 'function' ?
                _color[method]().toString(options.outputPrecision) : '';
        }

        // Fire listener if initialization is finish
        if (!this._initializingActive && this._recalc) {
            this._emit('change', _color);
        }
    }

    _clearColor(silent = false) {
        const {_root, options} = this;

        // Change only the button color if it isn't customized
        if (!options.useAsButton) {
            _root.button.style.color = 'rgba(0, 0, 0, 0.15)';
        }

        _root.button.classList.add('clear');

        if (!options.showAlways) {
            this.hide();
        }

        this._lastColor = null;
        if (!this._initializingActive && !silent) {

            // Fire listener
            this._emit('save', null);
            this._emit('clear', this);
        }
    }

    _parseLocalColor(str) {
        const {values, type, a} = parseToHSVA(str);
        const {lockOpacity} = this.options;
        const alphaMakesAChange = a !== undefined && a !== 1;

        // If no opacity is applied, add undefined at the very end which gets
        // Set to 1 in setHSVA
        if (values && values.length === 3) {
            values[3] = undefined;
        }

        return {
            values: (!values || (lockOpacity && alphaMakesAChange)) ? null : values,
            type
        };
    }

    _t(key) {
        return this.options.i18n[key] || Pickr.I18N_DEFAULTS[key];
    }

    _emit(event, ...args) {
        this._eventListener[event].forEach(cb => cb(...args, this));
    }

    on(event, cb) {
        this._eventListener[event].push(cb);
        return this;
    }

    off(event, cb) {
        const callBacks = (this._eventListener[event] || []);
        const index = callBacks.indexOf(cb);

        if (~index) {
            callBacks.splice(index, 1);
        }

        return this;
    }

    /**
     * Appends a color to the swatch palette
     * @param color
     * @returns {boolean}
     */
    addSwatch(color) {
        const {values} = this._parseLocalColor(color);

        if (values) {
            const {_swatchColors, _root} = this;
            const color = HSVaColor(...values);

            // Create new swatch HTMLElement
            const el = _.createElementFromString(
                `<button type="button" style="color: ${color.toRGBA().toString(0)}" aria-label="${this._t('btn:swatch')}"/>`
            );

            // Append element and save swatch data
            _root.swatches.appendChild(el);
            _swatchColors.push({el, color});

            // Bind event
            this._eventBindings.push(
                _.on(el, 'click', () => {
                    this.setHSVA(...color.toHSVA(), true);
                    this._emit('swatchselect', color);
                    this._emit('change', color);
                })
            );

            return true;
        }

        return false;
    }

    /**
     * Removes a swatch color by it's index
     * @param index
     * @returns {boolean}
     */
    removeSwatch(index) {
        const swatchColor = this._swatchColors[index];

        // Check swatch data
        if (swatchColor) {
            const {el} = swatchColor;

            // Remove HTML child and swatch data
            this._root.swatches.removeChild(el);
            this._swatchColors.splice(index, 1);
            return true;
        }

        return false;
    }

    applyColor(silent = false) {
        const {preview, button} = this._root;

        // Change preview and current color
        const cssRGBaString = this._color.toRGBA().toString(0);
        preview.lastColor.style.color = cssRGBaString;

        // Change only the button color if it isn't customized
        if (!this.options.useAsButton) {
            button.style.color = cssRGBaString;
        }

        // User changed the color so remove the clear clas
        button.classList.remove('clear');

        // Save last color
        this._lastColor = this._color.clone();

        // Fire listener
        if (!this._initializingActive && !silent) {
            this._emit('save', this._color);
        }

        return this;
    }

    /**
     * Destroy's all functionalitys
     */
    destroy() {
        this._eventBindings.forEach(args => _.off(...args));

        Object.keys(this._components)
            .forEach(key => this._components[key].destroy());
    }

    /**
     * Destroy's all functionalitys and removes
     * the pickr element.
     */
    destroyAndRemove() {
        this.destroy();
        const {root, app} = this._root;

        // Remove element
        if (root.parentElement) {
            root.parentElement.removeChild(root);
        }

        // Remove .pcr-app
        app.parentElement.removeChild(app);

        // There are references to various DOM elements stored in the pickr instance
        // This cleans all of them to avoid detached DOMs
        Object.keys(this)
            .forEach(key => this[key] = null);
    }

    /**
     * Hides the color-picker ui.
     */
    hide() {
        this._root.app.classList.remove('visible');
        this._emit('hide', this);
        return this;
    }

    /**
     * Shows the color-picker ui.
     */
    show() {

        if (!this.options.disabled) {
            this._root.app.classList.add('visible');
            this._rePositioningPicker();
            this._emit('show', this);
        }

        return this;
    }

    /**
     * @return {boolean} If the color picker is currently open
     */
    isOpen() {
        return this._root.app.classList.contains('visible');
    }

    /**
     * Set a specific color.
     * @param h Hue
     * @param s Saturation
     * @param v Value
     * @param a Alpha channel (0 - 1)
     * @param silent If the button should not change the color
     * @return boolean if the color has been accepted
     */
    setHSVA(h = 360, s = 0, v = 0, a = 1, silent = false) {

        // Deactivate color calculation
        const recalc = this._recalc; // Save state
        this._recalc = false;

        // Validate input
        if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || a < 0 || a > 1) {
            return false;
        }

        // Override current color and re-active color calculation
        this._color = HSVaColor(h, s, v, a);

        // Update slider and palette
        const {hue, opacity, palette} = this._components;
        hue.update((h / 360));
        opacity.update(a);
        palette.update(s / 100, 1 - (v / 100));

        // Check if call is silent
        if (!silent) {
            this.applyColor();
        }

        // Update output if recalculation is enabled
        if (recalc) {
            this._updateOutput();
        }

        // Restore old state
        this._recalc = recalc;
        return true;
    }

    /**
     * Tries to parse a string which represents a color.
     * Examples: #fff
     *           rgb 10 10 200
     *           hsva 10 20 5 0.5
     * @param string
     * @param silent
     */
    setColor(string, silent = false) {

        // Check if null
        if (string === null) {
            this._clearColor(silent);
            return true;
        }

        const {values, type} = this._parseLocalColor(string);

        // Check if color is ok
        if (values) {

            // Change selected color format
            const utype = type.toUpperCase();
            const {options} = this._root.interaction;
            const target = options.find(el => el.getAttribute('data-type') === utype);

            // Auto select only if not hidden
            if (target && !target.hidden) {
                for (const el of options) {
                    el.classList[el === target ? 'add' : 'remove']('active');
                }
            }

            // Update color (fires 'save' event if silent is 'false')
            if (!this.setHSVA(...values, silent)) {
                return false;
            }

            // Update representation (fires 'change' event)
            return this.setColorRepresentation(utype);
        }

        return false;
    }

    /**
     * Changes the color _representation.
     * Allowed values are HEX, RGB, HSV, HSL and CMYK
     * @param type
     * @returns {boolean} if the selected type was valid.
     */
    setColorRepresentation(type) {

        // Force uppercase to allow a case-sensitiv comparison
        type = type.toUpperCase();

        // Find button with given type and trigger click event
        return !!this._root.interaction.options
            .find(v => v.getAttribute('data-type').startsWith(type) && !v.click());
    }

    /**
     * Returns the current color representaion. See setColorRepresentation
     * @returns {*}
     */
    getColorRepresentation() {
        return this._representation;
    }

    /**
     * @returns HSVaColor Current HSVaColor object.
     */
    getColor() {
        return this._color;
    }

    /**
     * Returns the currently selected color.
     * @returns {{a, toHSVA, toHEXA, s, v, h, clone, toCMYK, toHSLA, toRGBA}}
     */
    getSelectedColor() {
        return this._lastColor;
    }

    /**
     * @returns The root HTMLElement with all his components.
     */
    getRoot() {
        return this._root;
    }

    /**
     * Disable pickr
     */
    disable() {
        this.hide();
        this.options.disabled = true;
        this._root.button.classList.add('disabled');
        return this;
    }

    /**
     * Enable pickr
     */
    enable() {
        this.options.disabled = false;
        this._root.button.classList.remove('disabled');
        return this;
    }
}

export default Pickr;
