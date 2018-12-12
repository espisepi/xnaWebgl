/**
 * @param {GraphicsDevice} graphicsDevice to get the gl
 * @param {String} shaderfsId Id of the fragment shader in our html
 * @param {String} shadervsId Id of the vertex shader in our html
*/
function Program(graphicsDevice, shaderfsId, shadervsId) {
    var gl = graphicsDevice.gl;
    this.graphicsDevice = graphicsDevice;
    this.shaderProgram = gl.createProgram();
    this.fragmentShader = this.getShader(gl, shaderfsId);
    this.vertexShader = this.getShader(gl, shadervsId);
    gl.attachShader(this.shaderProgram, this.vertexShader);
    gl.attachShader(this.shaderProgram, this.fragmentShader);
    gl.linkProgram(this.shaderProgram);

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
        console.log(gl.getShaderInfoLog(this.shaderProgram));
    }
    //Falta gl.useProgram(this.shaderProgram) porque lo vamos a poner en la funcion draw de cada objeto

    this.vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "aVertexNormal");
    gl.enableVertexAttribArray(this.vertexNormalAttribute);

    this.textureCoordAttribute = gl.getAttribLocation(this.shaderProgram, "aTextureCoord");
    gl.enableVertexAttribArray(this.textureCoordAttribute);

    this.pMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.mvMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.nMatrixUniform = gl.getUniformLocation(this.shaderProgram, "uNMatrix");
    this.samplerUniform = gl.getUniformLocation(this.shaderProgram, "uSampler");
    this.useTexturesUniform = gl.getUniformLocation(this.shaderProgram, "uUseTextures");
    this.useLightingUniform = gl.getUniformLocation(this.shaderProgram, "uUseLighting");
    this.ambientColorUniform = gl.getUniformLocation(this.shaderProgram, "uAmbientColor");
    this.pointLightingLocationUniform = gl.getUniformLocation(this.shaderProgram, "uPointLightingLocation");
    this.pointLightingColorUniform = gl.getUniformLocation(this.shaderProgram, "uPointLightingColor");

}

Program.prototype.getShader = function (gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}
