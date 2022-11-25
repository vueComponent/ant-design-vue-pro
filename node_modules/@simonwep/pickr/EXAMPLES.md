### Requested features - immediately brought to life by a bit of code

#### Saving the current color and closing the popup on `Enter` ([#187](https://github.com/Simonwep/pickr/issues/187))

```js
pickr.on('init', instance => {

    // Grab actual input-element
    const {result} = instance.getRoot().interaction;

    // Listen to any key-events
    result.addEventListener('keydown', e => {

        // Detect whever the user pressed "Enter" on their keyboard
        if (e.key === 'Enter') {
            instance.applyColor(); // Save the currently selected color
            instance.hide(); // Hide modal
        }
    }, {capture: true});
});
```

#### Extending pickr to add / remove a list of swatches ([#241](https://github.com/Simonwep/pickr/issues/241))
[@GreenFootballs](https://github.com/GreenFootballs) showed in [#241](https://github.com/Simonwep/pickr/issues/241) a way to extend pickr so that you can add or remove a whole list of swatches:

> Note: Extending prototypes is generally considered bad practice, but in this case its reasonable as [there won't be any new features](https://github.com/Simonwep/pickr#status-of-this-project).

```js
Pickr.prototype.getSwatches = function() {
    return this._swatchColors.reduce((arr, swatch) => {
        arr.push(swatch.color.toRGBA().toString(0));
        return arr;
    }, [] );
}

Pickr.prototype.setSwatches = function(swatches) {
    if (!swatches.length) return;
    for (let i = this._swatchColors.length - 1; i > -1; i--) {
        this.removeSwatch(i);
    }
    swatches.forEach(swatch => this.addSwatch(swatch));
}
```

---


> Feel free to submit a [PR](https://github.com/Simonwep/pickr/compare) or open
> an [issue](https://github.com/Simonwep/pickr/issues/new?assignees=Simonwep&labels=&template=feature_request.md&title=) if
> you got any ideas for more examples!
