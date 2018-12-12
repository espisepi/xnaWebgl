let GameObjectUtils = (() => {
    var publicFunction = {};
    publicFunction.loadBufferJson = function (gameObject) {
        var gl = gameObject.program.graphicsDevice.gl;
        var nameFile = gameObject.srcJson;
        var request = new XMLHttpRequest();
        request.open("GET", nameFile);
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                gameObject.vertexes = _handleLoadedJson(gl, JSON.parse(request.responseText));
            }
        }
        request.send();
    }
    _handleLoadedJson = function (gl, jsonData) {

        var vertexNormalBuffer = null,
            vertexTextureCoordBuffer = null,
            vertexPositionBuffer = null,
            vertexIndexBuffer = null;

        if (jsonData.vertexNormals != null) {
            vertexNormalBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsonData.vertexNormals), gl.STATIC_DRAW);
            vertexNormalBuffer.itemSize = 3;
            vertexNormalBuffer.numItems = jsonData.vertexNormals.length / 3
        }

        if (jsonData.vertexTextureCoords != null) {
            vertexTextureCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexTextureCoordBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsonData.vertexTextureCoords), gl.STATIC_DRAW);
            vertexTextureCoordBuffer.itemSize = 2;
            vertexTextureCoordBuffer.numItems = jsonData.vertexTextureCoords.length / 2;
        }

        if (jsonData.vertexPositions != null) {
            vertexPositionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(jsonData.vertexPositions), gl.STATIC_DRAW);
            vertexPositionBuffer.itemSize = 3;
            vertexPositionBuffer.numItems = jsonData.vertexPositions.length / 3;
        }

        if (jsonData.indices != null) {
            vertexIndexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(jsonData.indices), gl.STATIC_DRAW);
            vertexIndexBuffer.itemSize = 1;
            vertexIndexBuffer.numItems = jsonData.indices.length;
        }

        //document.getElementById("loadingtext").style.display = "none";

        return {
            vertexNormalBuffer: vertexNormalBuffer,
            vertexTextureCoordBuffer: vertexTextureCoordBuffer,
            vertexPositionBuffer: vertexPositionBuffer,
            vertexIndexBuffer: vertexIndexBuffer
        }
    }

    return publicFunction;

})();
