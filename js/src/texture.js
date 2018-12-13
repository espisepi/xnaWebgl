/**
 * @param {String} src texture source
 * @param {GraphicsDevice} graphicsDevice To get the gl
 * @param {gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT} [options.wrap_s = gl.CLAMP_TO_EDGE] Wrapping function for texture coordinate s
 * @param {gl.REPEAT, gl.CLAMP_TO_EDGE, gl.MIRRORED_REPEAT} [options.wrap_t = gl.CLAMP_TO_EDGE] Wrapping function for texture coordinate t
 * @param {gl.LINEAR, gl.NEAREST, gl.NEAREST_MIPMAP_NEAREST, gl.LINEAR_MIPMAP_NEAREST, gl.NEAREST_MIPMAP_LINEAR, gl.LINEAR_MIPMAP_LINEAR} [options.min_filter = gl.LINEAR] Texture minification filter
 * @param {gl.LINEAR, gl.NEAREST} [options.max_filter = gl.LINEAR] Texture magnification filter
*/
function Texture(src, graphicsDevice, options = {}) {
    this.image = new Image();
    //Lo hacemos de esta forma para poder pasar al metodo handleLoadedTexture la variable textureGL
    this.image.textureGL = graphicsDevice.gl.createTexture();
    this.image.options = this.configurateOptions(options, graphicsDevice.gl);
    this.image.onload = function () {
        //Modifica el this.image.textureGL
        TextureUtils.handleLoadedTexture(graphicsDevice, this, this.options);
    }
    this.image.src = src;
}

Texture.prototype.configurateOptions = function (options, gl) {
    const wrap_s = options.wrap_s || gl.CLAMP_TO_EDGE;
    const wrap_t = options.wrap_t || gl.CLAMP_TO_EDGE;
    const min_filter = options.min_filter || gl.LINEAR;
    const max_filter = options.max_filter || gl.LINEAR;

    options.wrap_s = wrap_s;
    options.wrap_t = wrap_t;
    options.min_filter = min_filter;
    options.max_filter = max_filter;

    return options;
}