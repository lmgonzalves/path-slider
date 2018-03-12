# Path Slider

Sliding elements along SVG paths!

### Basic Usage Links

[**DEMO**](http://lmgonzalves.github.io/path-slider/)

[**TUTORIAL**](https://scotch.io/tutorials/animating-elements-along-svg-paths-introducing-pathslider)

[**CODEPEN**](https://codepen.io/lmgonzalves/full/dmbmpQ/)

### Advanced Usage Links

**DEMO** (coming soon!)

**TUTORIAL** (coming soon!)

**CODEPEN** (coming soon!)

## Documentation

### `PathSlider` constructor ask for 3 parameters:

- `path`: SVG path (or String selector) to slide elements through it
- `items`: DOM elements (or String selector) to slide
- `options`: Object with options to override defaults

For example:

```js
var options = {startLength: 0};
var mySlider = new PathSlider('.path', '.item', options);
```

### Possible `options`:

- `startLength` (float or 'center'): Length of the path to start positioning the elements
- `activeSeparation` (float): Separation among the active item and adjacent items
- `paddingSeparation` (float): Padding separation at the beginning and the end of the path
- `duration`, `delay`, `easing`, `elasticity`: Refer to [anime.js](http://animejs.com/) library options
- `stagger` (ms): Delay among animations of each item
- `begin` (function): Callback function to call immediately before each item animation starts
- `end` (function): Callback function to call immediately after each item animation ends
- `beginAll` (function): Callback function to call immediately before all the animations starts
- `endAll` (function): Callback function to call immediately after all the animations ends
- `blockUntilEnd` (boolean): If `true` (false by default), you need to wait current animation ends to select a new item
- `clickSelection` (boolean): If `true` (default), add listeners for `click` events in every item to allow selecting them

### Callback functions `begin` and `end` receive an object with some useful info:

- `index`: Index of item
- `node`: The DOM node
- `selected`: True if item has been selected
- `unselected`: True if item has been unselected

### Selecting items:

By default, the library add listeners for `click` events in every item to allow selecting them (`clickSelection` option). You can also select items using the following functions:

- `selectPrevItem()`: Select the prev item
- `selectNextItem()`: Select the next item
- `selectItem(index)`: Select any item using the corresponding `index`

For example:

```js
mySlider.selectPrevItem(); // Or any of the following
// mySlider.selectNextItem();
// mySlider.selectItem(0);
```
