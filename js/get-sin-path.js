// Function to get a path (string) similar to sin function. Can accept following options that you can use for customization:
// - width: Width to draw the path
// - height: Height to draw the path
// - addWidth: Additional width to overflow actual width
// - controlSep: Bigger values of this parameter will add more curvature, and vice versa
// - curves: Number of curves (iterations) to draw

function getSinPath(options) {
    var _options = options || {};
    var _width = _options.width || window.innerWidth;
    var _height = _options.height || window.innerHeight;
    var _addWidth = _options.addWidth || 100;
    var _controlSep = _options.controlSep || 50;
    var _curves = _options.curves || 2;

    var x = - _addWidth;
    var y = _height / 2;
    var amplitudeX = (_width + _addWidth * 2) / _curves;     // X distance among curve points
    var amplitudeY = _height / 3;                            // Y distance between points and control points

    var path = [];
    path.push('M', x, y);
    var alternateY = true;
    var controlY;
    for (var i = 0; i < _curves; i++) {
        controlY = alternateY ? y - amplitudeY : y + amplitudeY;
        if (i === 0) {
            path.push('C', x + (amplitudeX / 2 - _controlSep), controlY);
        } else {
            path.push('S');
        }
        path.push(x + (amplitudeX / 2 + _controlSep), controlY);
        path.push(x + amplitudeX, y);
        x += amplitudeX;
        alternateY = !alternateY;
    }

    return path.join(' ');
}
