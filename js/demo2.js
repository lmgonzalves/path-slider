(function () {

    // Get items, and set initial styles for current item

    var items = document.querySelectorAll('.path-slider__item');
    items[0].querySelector('.item__circle-translate').style['transform'] = 'translateY(105px)';
    items[0].querySelector('.item__circle').style['transform'] = 'scale(2)';


    // Add `click` event listeners manually, to select items only if no animation in progress
    
    var animating = false;

    for (var i = 0; i < items.length; i++) {
        (function(i) {
            items[i].addEventListener('click', function () {
                if (!animating) {
                    animating = true;
                    slider.selectItem(i);
                }
            });
        })(i);
    }


    // Init slider

    var path = document.querySelector('.path-slider__path');

    var options = {
        startLength: path.getTotalLength() / 2 - 100,
        delay: 100,
        duration: 1000,
        clickSelection: false,
        begin: function (params) {
            if (params.selected || params.unselected) {
                anime({
                    targets: params.node.querySelector('.item__circle'),
                    scale: params.selected ? [1, 2] : [2, 1],
                    duration: 500,
                    delay: params.selected ? 900 : 0,
                    easing: 'easeOutCubic'
                });

                anime({
                    targets: params.node.querySelector('.item__circle-translate'),
                    translateY: params.selected ? [0, '105px'] : ['105px', 0],
                    duration: 1000,
                    delay: params.selected ? 900 : 0,
                    elasticity: 600
                });

                var morph = anime({
                    targets: '.path-slider__path-drawn',
                    d: 'M 65 5 a 60 60 0 0 0 -60 60 a 60 60 0 0 0 60 60 C 105 125 125 125 165 125 S 225 125 265 125 a 60 60 0 0 0 60 -60 a 60 60 0 0 0 -60 -60 Z',
                    duration: 1000,
                    elasticity: 600
                });

                setTimeout(function () {
                    morph.pause();
                    anime({
                        targets: '.path-slider__path-drawn',
                        d: 'M 65 5 a 60 60 0 0 0 -60 60 a 60 60 0 0 0 30 50 C 100 150 100 240 165 240 S 230 150 295 115 a 60 60 0 0 0 30 -50 a 60 60 0 0 0 -60 -60 Z',
                        duration: 1000,
                        elasticity: 600,
                        complete: function () {
                            animating = false;
                        }
                    });
                }, 900);
            }
        }
    };

    var slider = new PathSlider(path, items, options);
})();
