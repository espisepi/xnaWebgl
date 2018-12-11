/**
 * @param {String} src texture source
 * @param {GraphicsDevice} graphicsDevice To get the gl
*/
function Texture(src, graphicsDevice) {
    this.image = new Image();
    //Lo hacemos de esta forma para poder pasar al metodo handleLoadedTexture la variable textureGL
    this.image.textureGL = graphicsDevice.gl.createTexture();
    this.image.onload = function () {
        //Modifica el this.image.textureGL
        TextureUtils.handleLoadedTexture(graphicsDevice, this);
    }
    this.image.src = src;
}