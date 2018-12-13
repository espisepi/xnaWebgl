//Module that we need in the Texture constructor
let TextureUtils = (() => {
    var publicFunction = {};
    publicFunction.handleLoadedTexture = function (graphicsDevice, image, options) {
        var gl = graphicsDevice.gl;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, image.textureGL);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, options.max_filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, options.min_filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, options.wrap_s);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, options.wrap_t);
        if (options.min_filter === gl.NEAREST_MIPMAP_NEAREST
            || options.min_filter === gl.LINEAR_MIPMAP_NEAREST
            || options.min_filter === gl.NEAREST_MIPMAP_LINEAR
            || options.min_filter === gl.LINEAR_MIPMAP_LINEAR) { gl.generateMipmap(gl.TEXTURE_2D); }
        gl.bindTexture(gl.TEXTURE_2D, null);
        return image;
    }

    return publicFunction;

})();