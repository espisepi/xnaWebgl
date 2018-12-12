/**
 * @param {String} src texture source
 * @param {GraphicsDevice} graphicsDevice To get the gl
 * @param {gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT} [options.wrap_s = gl.CLAMP_TO_EDGE] Wrapping function for texture coordinate s
 * @param {gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT} [options.wrap_t = gl.CLAMP_TO_EDGE] Wrapping function for texture coordinate t
 * @param {gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_LINEAR.} [options.min_filter = gl.LINEAR] Texture minification filter
 * @param {gl.LINEAR, gl.NEAREST} [options.max_filter = gl.LINEAR] Texture magnification filter
*/
function Texture(src, graphicsDevice, options) {
    this.image = new Image();
    //Lo hacemos de esta forma para poder pasar al metodo handleLoadedTexture la variable textureGL
    this.image.textureGL = graphicsDevice.gl.createTexture();
    this.options = this.configurateOptions(options, graphicsDevice.gl);
    this.image.onload = function () {
        //Modifica el this.image.textureGL
        TextureUtils.handleLoadedTexture(graphicsDevice, this);
    }
    this.image.src = src;
}

Texture.prototype.configurateOptions = function (options, gl) {
    
    if (false) {
        //creamos un contador para comprobar si todas las options introducidas se han mapeado correctamente
        var cont = 4;

        if (options.wrap_s === undefined) {
            options.wrap_s = gl.CLAMP_TO_EDGE;
            cont--;
        }
        if (options.wrap_t === void 0) {
            options.wrap_t = gl.CLAMP_TO_EDGE;
            cont--;
        }
        if (options.min_filter === void 0) {
            options.min_filter = gl.LINEAR;
            cont--;
        }
        if (options.max_filter === void 0) {
            options.max_filter = gl.LINEAR;
            cont--;
        }

    }

    return options;
}