// PathSlider constructor ask for 3 parameters:
// - path: SVG path (or String selector) to slide elements through it
// - items: DOM elements (or String selector) to slide
// - options: Object with options

// Possible `options`:
// - startLength (float or 'center'): Length of the path to start position the elements
// - activeSeparation (float): Separation between active item and adjacent items
// - paddingSeparation (float): Padding separation at the beginning and end of the path
// - duration, delay, easing, elasticity: Refer to anime.js library options
// - stagger (milliseconds): Delay among animations of each item
// - begin (function): Callback function to call immediately before each item animation starts
// - end (function): Callback function to call immediately after each item animation ends
// - beginAll (function): Callback function to call immediately before all the animations starts
// - endAll (function): Callback function to call immediately after all the animations ends
// - clickSelection (boolean): If true (default), add listeners for `click` events in every item to allow selecting them

// Callback functions `begin` and `end` receive an object with some useful info:
// - index: Index of item
// - node: The DOM node
// - selected: True if item has been selected
// - unselected: True if item has been unselected

function PathSlider(path, items, options) {
    this.path = is.str(path) ? document.querySelector(path) : path;
    this.pathLength = this.path.getTotalLength();
    this.items = is.str(items) ? document.querySelectorAll(items) : items;
    this.itemsLength = this.items.length;
    this.init(options);
}

PathSlider.prototype = {
    defaults: {
        paddingSeparation: 0,
        duration: 1000,
        delay: 0,
        stagger: 0,
        easing: 'easeInOutCubic',
        elasticity: undefined,
        rotate: false,
        begin: undefined,
        end: undefined,
        beginAll: undefined,
        endAll: undefined,
        clickSelection: true
    },

    init: function (options) {
        this.initialOptions = options;
        extend(this, this.defaults, options);
        this.initPathOptions();
        this.initItems();
        if (this.clickSelection) {
            this.initEvents();
        }
    },

    initPathOptions: function () {
        this.activeSeparation = is.und(this.initialOptions.activeSeparation) ? (this.pathLength - (2 * this.paddingSeparation)) / this.itemsLength : this.initialOptions.activeSeparation;
        if (is.und(this.initialOptions.startLength)) {
            this.startLength = this.paddingSeparation + this.activeSeparation / 2;
        } else {
            this.startLength = this.initialOptions.startLength === 'center' ? this.pathLength / 2 : this.initialOptions.startLength + this.paddingSeparation;
        }
    },

    initItems: function () {
        var items = [];
        for (var i = 0; i < this.itemsLength; i++) {
            items.push({
                node: this.items[i],
                positionIndex: i
            });
        }
        this.items = items;
        this.currentIndex = 0;
        this.updatePositions();
        this.updateClass();
        this.animations = [];
    },

    initEvents: function () {
        var that = this;
        for (var i = 0; i < this.itemsLength; i++) {
            (function(i) {
                that.items[i].node.addEventListener('click', function () {
                    that.selectItem(i);
                });
            })(i);
        }
    },

    updatePositions: function () {
        this.calcPositions();
        var item;
        for (var i = 0; i < this.itemsLength; i++) {
            item = this.items[i];
            item.position = this.positions[item.positionIndex];
            this.setPosition(item.node, item.position);
        }
    },

    calcPositions: function () {
        this.positions = [];
        this.pathLength = this.path.getTotalLength();
        this.initPathOptions();
        var restLength = this.pathLength - (2 * this.activeSeparation) - (2 * this.paddingSeparation);
        var sepLength = restLength / (this.itemsLength - 2);
        var currentPosition = this.startLength;
        for (var i = 0; i < this.itemsLength; i++) {
            this.positions.push(currentPosition);
            currentPosition += i === 0 ? this.activeSeparation : sepLength;
            if (currentPosition >= this.pathLength - this.paddingSeparation) {
                currentPosition += 2 * this.paddingSeparation;
                currentPosition -= this.pathLength;
            }
        }
    },

    setPosition: function (node, position) {
        var p = this.point(position);
        var p0 = this.point(position - 1);
        var p1 = this.point(position + 1);
        var transforms = ['translate(' + p.x + 'px, ' + p.y + 'px)'];
        if (this.rotate) {
            var angle = Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180 / Math.PI + 180;
            transforms.push('rotate(' + angle + 'deg)');
        }
        setStyle(node, 'transform', transforms.join(' '));
    },

    point: function (position) {
        return this.path.getPointAtLength(this.getRealPosition(position));
    },

    selectItem: function (index) {
        var item = this.items[index];
        var positionIndex = item.positionIndex;
        var clock = true;
        if (positionIndex !== 0) {
            for (var j = 0; j < this.animations.length; j++) {
                this.animations[j].anime.pause();
            }
            this.animations = [];
            this.updateClass(index);
            if (positionIndex > this.itemsLength / 2) {
                clock = false;
            }

            var that = this;
            for (var i = 0; i < this.itemsLength; i++) {
                (function(i) {
                    var current = that.items[i];
                    var newPositionIndex = i - index < 0 ? that.itemsLength - (index - i) : i - index;
                    var newPosition = that.positions[newPositionIndex];
                    var stagger = that.stagger;
                    var staggerIndex = current.positionIndex;

                    if (clock) {
                        if (current.position < newPosition) {
                            newPosition -= that.pathLength;
                            staggerIndex += that.itemsLength;
                        }
                        stagger *= staggerIndex - positionIndex;
                    } else {
                        if (current.position >= newPosition) {
                            newPosition += that.pathLength;
                            if (current.positionIndex > positionIndex) {
                                staggerIndex -= that.itemsLength;
                            }
                        }
                        stagger *= positionIndex - staggerIndex;
                    }

                    if (i === 0) call(that.beginAll);
                    var params = {
                        index: i,
                        node: current.node,
                        selected: newPositionIndex === 0,
                        unselected: current.positionIndex === 0
                    };
                    call(that.begin, params);

                    var target = {
                        position: current.position
                    };
                    current.positionIndex = newPositionIndex;
                    current.position = that.getRealPosition(newPosition);

                    that.animations.push({
                        index: i,
                        anime: anime({
                            targets: target,
                            position: newPosition,
                            duration: that.duration,
                            easing: that.easing,
                            elasticity: that.elasticity,
                            delay: that.delay + stagger,
                            update: function () {
                                that.setPosition(current.node, target.position);
                            },
                            complete: function () {
                                call(that.end, params);
                                that.animations = that.animations.filter(function (a) { return a.index !== i; });
                                if (that.animations.length === 0) {
                                    call(that.endAll);
                                }
                            }
                        })
                    });
                })(i);
            }
        }
    },

    selectPrevItem: function () {
        this.selectItem(this.getPrevItem(this.currentIndex));
    },

    selectNextItem: function () {
        this.selectItem(this.getNextItem(this.currentIndex));
    },

    getPrevItem: function (index) {
        return index > 0 ? index - 1 : this.itemsLength - 1;
    },

    getNextItem: function (index) {
        return index + 1 < this.itemsLength ? index + 1 : 0;
    },

    getRealPosition: function (position) {
        var realPosition = parseFloat(position);
        if (realPosition < 0) {
            while (realPosition < 0) realPosition += this.pathLength;
        } else if (realPosition >= this.pathLength) {
            while (realPosition >= this.pathLength) realPosition -= this.pathLength;
        }
        return realPosition;
    },

    updateClass: function (index) {
        if (!is.und(index)) {
            this.items[this.currentIndex].node.classList.remove('path-slider__current-item');
            this.currentIndex = index;
        }
        this.items[this.currentIndex].node.classList.add('path-slider__current-item');
    }
};


// Utils

var is = {
    arr: function arr(a) { return Array.isArray(a); },
    str: function str(a) { return typeof a === 'string'; },
    fnc: function fnc(a) { return typeof a === 'function'; },
    und: function und(a) { return typeof a === 'undefined'; }
};

function setStyle(node, property, value) {
    node.style[property] = value;
    node.style['-webkit-' + property] = value;
}

function call(fn, params) {
    if (is.fnc(fn)) fn(params);
}

function extendSingle(target, source) {
    for (var key in source) {
        target[key] = is.arr(source[key]) ? source[key].slice(0) : source[key];
    }
    return target;
}

function extend(target, source) {
    if (!target) target = {};
    for (var i = 1; i < arguments.length; i++) {
        extendSingle(target, arguments[i]);
    }
    return target;
}
