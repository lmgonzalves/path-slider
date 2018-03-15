(function () {

    // Creating SVG and path elements and insert to DOM

    var svgNS = 'http://www.w3.org/2000/svg';
    var svgEl = document.createElementNS(svgNS, 'svg');

    var pathEl = document.createElementNS(svgNS, 'path');
    // The `getSinPath` function return the `path` in String format
    pathEl.setAttribute('d', getSinPath());
    pathEl.setAttribute('class', 'path-slider__path');

    svgEl.appendChild(pathEl);
    document.body.appendChild(svgEl);


    // Changing `background-image`
    // Firstly, saving the computed `background` of each item, as these are defined in CSS
    // When item is selected, the `background` is set accordingly

    var items = document.querySelectorAll('.path-slider__item');
    var images = [];
    for (var j = 0; j < items.length; j++) {
        images.push(getComputedStyle(items[j].querySelector('.item__circle')).getPropertyValue('background-image'));
    }

    var imgAnimation;
    var lastIndex;
    var setImage = function (index) {
        if (imgAnimation) {
            imgAnimation.pause();
            sliderContainer.style['background-image'] = images[lastIndex];
            sliderContainerBackground.style['opacity'] = 0;
        }
        lastIndex = index;
        sliderContainerBackground.style['background-image'] = images[index];
        imgAnimation = anime({
            targets: sliderContainerBackground,
            opacity: 1,
            easing: 'linear'
        });
    };


    // Adding the extra element needed to fade the images smoothly
    // Also set the image for the initial current item (the first one)

    var sliderContainer = document.querySelector('.path-slider');
    var sliderContainerBackground = document.createElement('div');
    sliderContainerBackground.setAttribute('class', 'path-slider__background');
    setImage(0);
    sliderContainer.appendChild(sliderContainerBackground);


    // Initializing the slider

    var options = {
        startLength: 'center',
        paddingSeparation: 100,
        easing: 'easeOutCubic',
        begin: function (params) {
            // Item get selected, then set the `background` accordingly
            if (params.selected) {
                setImage(params.index);
            }
        }
    };

    var slider = new PathSlider(pathEl, '.path-slider__item', options);


    // Regenerate the SVG `path` and update items position on `resize` event (responsive behavior)

    window.addEventListener('resize', function() {
        pathEl.setAttribute('d', getSinPath());
        slider.updatePositions();
    });

})();
