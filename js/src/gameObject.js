/**
 * @param {basicProgram} basicProgram the program wich we will associate our gameObject
 * @param {Array(3)} position Array with the initial position [x,y,z]
 * @param {String} srcJson Json's src to build the vertexes
*/
function GameObject(basicProgram, position, srcJson, texture) {
    this.basicProgram = basicProgram;
    this.position = position;
    this.srcJson = srcJson;
    this.vertexes = null;
    //cargamos los buffers y se lo añadimos al atributo this.vertexes del gameObject pasado por parametro
    GameObjectUtils.loadBufferJson(this);
    //Texturas del gameObject
    if (texture === void 0) { this.texture = null; }
    else { this.texture = texture }

}

GameObject.prototype.draw = function (mvpMatrix) {
    //Si aun no se han cargado los vertices no se dibuja nada
    if (this.vertexes === null) {
        return null;
    }

    var gl = this.basicProgram.graphicsDevice.gl;
    mat4.translate(mvpMatrix.mvMatrix, this.position);

    gl.useProgram(this.basicProgram.shaderProgram);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture.image.textureGL);
    gl.uniform1i(this.basicProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexes.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(this.basicProgram.textureCoordAttribute, this.vertexes.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexes.vertexPositionBuffer);
    gl.vertexAttribPointer(this.basicProgram.vertexPositionAttribute, this.vertexes.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexes.vertexNormalBuffer);
    gl.vertexAttribPointer(this.basicProgram.vertexNormalAttribute, this.vertexes.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vertexes.vertexIndexBuffer);
    mvpMatrix.setMatrixUniforms(this.basicProgram);
    gl.drawElements(gl.TRIANGLES, this.vertexes.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);

}
