function MVPMatrix() {
    this.pMatrix = mat4.create();
    this.mvMatrix = mat4.create();
    this.mvMatrixStack = [];
}

MVPMatrix.prototype.mvPushMatrix = function () {
    var copy = mat4.create();
    mat4.set(this.mvMatrix, copy);
    this.mvMatrixStack.push(copy);
}

MVPMatrix.prototype.mvPopMatrix = function () {
    if (this.mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    this.mvMatrix = this.mvMatrixStack.pop();
}

MVPMatrix.prototype.setMatrixUniforms = function (program) {
    var gl = program.graphicsDevice.gl;
    gl.uniformMatrix4fv(program.pMatrixUniform, false, this.pMatrix);
    gl.uniformMatrix4fv(program.mvMatrixUniform, false, this.mvMatrix);

    /*Creamos a matriz de modelo-vista para los vectores normales, dicha matriz
    tiene que ser 3x3, por ello hacemos los siguientes cambios*/
    var normalMatrix = mat3.create();
    mat4.toInverseMat3(this.mvMatrix, normalMatrix);
    mat3.transpose(normalMatrix);
    gl.uniformMatrix3fv(program.nMatrixUniform, false, normalMatrix);
}