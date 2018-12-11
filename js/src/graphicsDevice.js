/**
 * @param {Canvas} canvas canvas to build the webGL
*/
function GraphicsDevice(canvas) {
    this.gl = canvas.getContext("experimental-webgl");;
    this.viewport = new Viewport(0, 0, canvas.width, canvas.height);
    if (!this.gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}