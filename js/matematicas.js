
//MathUtils
let MathUtils = (() => {
    var publicFunction = {};

    publicFunction.degToRad = function (degrees) {
        return degrees * Math.PI / 180;
    }

    return publicFunction;
})();