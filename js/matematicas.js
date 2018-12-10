var Matematicas;
(function (Matematicas) {
    var Vector3 = (function (x,y,z) {
            if (x === void 0) { x = 0.0; }
            if (y === void 0) { y = 0.0; }
            if (z === void 0) { z = 0.0; }
            this._x = x;
            this._y = y;
            this._z = z;
    })();
    Matematicas.Vector3 = Vector3;
})(Matematicas || (Matematicas = {}));;