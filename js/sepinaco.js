
//GraphicsDevice
function GraphicsDevice(canvas) {
    this.gl = canvas.getContext("experimental-webgl");;
    this.viewPort = new ViewPort(0, 0, canvas.width, canvas.height);
    if (!this.gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}

//Viewport
function ViewPort(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

//BasicProgram
function BasicProgram(graphicsDevice, shaderfsId, shadervsId) {
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
    //Falta gl.useProgram porque lo vamos a poner en el drawScene

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

BasicProgram.prototype.getShader = function (gl, id) {
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


//Texture
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
let TextureUtils = (() => {
    var publicFunction = {};
    publicFunction.handleLoadedTexture = function (graphicsDevice, image) {
        var gl = graphicsDevice.gl;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.bindTexture(gl.TEXTURE_2D, image.textureGL);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return image;
    }

    return publicFunction;

})();

//GameObject
/**
 * @param basicProgram the program wich we will associate our gameObject
 * @param position Array with the initial position [x,y,z]
 * @param srcJson Json's src to build the vertexes
*/
function GameObject(basicProgram, position, srcJson,texture) {
    this.basicProgram = basicProgram;
    this.position = position;
    this.srcJson = srcJson;
    this.vertexes = null;
    //cargamos los buffers y se lo añadimos al atributo this.vertexes del gameObject pasado por parametro
    GameObjectUtils.loadBufferJson(this);
    //Texturas del gameObject
    if (texture === void 0) { this.texture = null; }
    else {this.texture=texture}

}

//GameObject Utils
let GameObjectUtils = (() => {
    var publicFunction = {};
    publicFunction.loadBufferJson = function (gameObject) {
        var gl = gameObject.basicProgram.graphicsDevice.gl;
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

//Mirar modelMatrix en mi codigo lessonn
//y ver como podemos poner todo ese codigo dentro de basicProgram o en otro sitio segun vea donde se encuentra en zia.js en caso de duda
//y asi con tods los atributs que tiene basicProgram