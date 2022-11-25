<h3 align="center">
    <img src="https://user-images.githubusercontent.com/30767528/81419142-155b4100-914e-11ea-913b-cb9f0cccd4e2.png" width="500" alt="Logo">
</h3>

<h3 align="center">
    Ultra Tiny, Opinionated Positioning Engine
</h3>

<p align="center">
  <img alt="gzip size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/nanopop/lib/nanopop.min.mjs?compression=gzip&style=flat-square">
  <img alt="brotli size" src="https://img.badgesize.io/https://cdn.jsdelivr.net/npm/nanopop/lib/nanopop.min.mjs?compression=brotli&style=flat-square">
  <a href="https://github.com/Simonwep/nanopop/actions"><img
     alt="Build Status"
     src="https://img.shields.io/github/workflow/status/Simonwep/nanopop/CI?style=flat-square"/></a>
  <a href="https://www.npmjs.com/package/nanopop"><img
     alt="Download count"
     src="https://img.shields.io/npm/dm/nanopop.svg?style=popout-square"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg?style=popout-square">
  <a href="https://www.jsdelivr.com/package/npm/nanopop"><img
     alt="JSDelivr download count"
     src="https://data.jsdelivr.com/v1/package/npm/nanopop/badge"></a>
  <img alt="Current version"
       src="https://img.shields.io/github/tag/Simonwep/nanopop.svg?color=3498DB&label=version&style=flat-square">
  <a href="https://github.com/sponsors/Simonwep"><img
     alt="Support me"
     src="https://img.shields.io/badge/github-support-3498DB.svg?style=popout-square"></a>
</p>

<br>

NanoPop is an ultra-tiny positioning engine. Hold up, isn't there [PopperJS](https://github.com/popperjs/popper-core)?
Yeah - and PopperJS is great! But there are tons of features that, in most cases, you just might not need. This library is less than a third of PopperJS.

#### When should I use Nanopop and not PopperJS?
1. Situations where you want **full control** over positioning, including handling events such as scrolling, and manual resizing.
2. **Performance-critical** cases with lots of elements [...] nanopop will only makes changes if you say so.
3. Poppers with **minimal footprint** such as drop-downs and tooltips which don't require that much configurability.
4. You might have some special needs about how your popper behaves. NanoPop exposes a function for the sole purpose of positioning something, use it in your own library!

This library was originally part of [pickr](https://github.com/Simonwep/pickr) - now ported to TS with tests and a few updates / bug-fixes.

> Heads up! This is the readme for v2 - if you're looking for the first version head over [here](https://github.com/Simonwep/nanopop/tree/539de9558a113ca6548a0d7d316ae8c65d7817d5) (v1 is not maintained anymore).

## Getting Started

Install via npm:
```shell
$ npm install nanopop
```

Install via yarn:
```shell
$ yarn add nanopop
```

Include directly via jsdelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/nanopop@2.0.0/lib/nanopop.min.js"></script>
```

Using [JavaScript Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules):

````js
import {
    reposition,   // Core, stateless function to reposition an element
    createPopper, // Stateful function which keeps track of your configuration
    defaults,     // A subset of nanopops options used as default values
    version       // Current version
} from 'https://cdn.jsdelivr.net/npm/nanopop/lib/nanopop.min.mjs'
````

> 🌟 NanoPop is fully tree-shakable! E.g. if you only use `reposition` you'll probably end up with less than 500B code!

## Usage

```js
reposition(
    /* reference: */ document.querySelector('.btn'),
    /* popper: */ document.querySelector('.dropdown'),
    /* We're using the default options */
);
```

> ⚠ The popper-element must have set `position` to `fixed`.

> ℹ Because the default-`container` is `document.documentElement` you might have to increase the `height` of the `html` element to make room for your popper (e.g. `html {height: 100vh;}`)

#### All options
```ts
import {reposition, createPopper} from 'nanopop';

// Using a object and reposition directly
const nanopop = reposition(reference, popper, {

    // The DOMRect of the container, it used the html-element as default.
    // You could also create your own boundary using a custon DOMRect (https://developer.mozilla.org/en-US/docs/Web/API/DOMRect)!
    container: document.documentElement.getBoundingClientRect(),

    // Margin between the popper element and the reference
    margin: 8,

    // Minimum space between the popper and the container
    padding: 0,

    // Preferred position, any combination of [top|right|bottom|left]-[start|middle|end] is valid.
    // 'middle' is used as default-variant if you leave it out.
    position: 'bottom-middle',

    // In case the variant-part (start, middle or end) cannot be applied you can specify what (and if)
    // should be tried next.
    variantFlipOrder: {
        start: 'sme', // In case of -start try 'start' first, if that fails 'middle' and 'end' if both doesn't work.
        middle: 'mse',
        end: 'ems'
    },

    // The same as variantFlipOrder, but if all variants fail you might want to try other positions.
    positionFlipOrder: {
        top: 'tbrl', // Try 'top' first, 'bottom' second, 'right' third and 'left' as latest position.
        right: 'rltb',
        bottom: 'btrl',
        left: 'lrbt'
    }
});

/**
 * Using the createPopper function to create a stateful wrapper
 *
 * Correct ways of calling it are:
 * createPopper(reference: HTMLElement, popper: HTMLElement, options?: NanoPopOptions)
 * createPopper(options?: NanoPopOptions)
 * ⚠ If you omit options entierly you'll have to set both the reference and the popper later when calling .update!
 */
const popper = createPopper({...});
popper.update(); // You can pass an object to update which will get merged with the existing config.
```

Calling `popper.update(...)` or `reposition(...)` both returns a position-pair (For example `te` for **T**op-**E**nd) or `null` based on if it was possible to find a position for the popper without clipping it._

> Tip: The returned position-pair is perfect for tool-tips to give them a little arrow!

## Caveats
1. The popper-element must have `position` set to `fixed`.
2. If nanopop cannot find a position without clipping your popper it'll revert its `top` and `left` values - you can use css / js to handle this case.
