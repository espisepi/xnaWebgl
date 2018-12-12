document.addEventListener('DOMContentLoaded', function () {
  function webGLStart() {
    canvas = document.getElementById('mainCanvas');
    graphicsDevice = new GraphicsDevice(canvas);
    program = null;
    mvpMatrix = new MVPMatrix();
    camera = new Camera();
    program = createProgram();
    cubeModel = new GameObject(program, [0, 0, -10], 'data/cube.json', program.textures[0]);

    //Codigo temporal para la camara y animaciones
    currentlyPressedKeys = {};
    pitchRate = 0;
    yawRate = 0;
    speed = 0;
    lastTime = 0;
    joggingAngle = 0;
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    //Fin de codigo temporal

    var gl = graphicsDevice.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
  }

  webGLStart();


  function initTextures() {
    var textures = Array(2);
    var textureCube = new Texture('img/cubeImg.gif', graphicsDevice);
    var textureTeapot = new Texture('img/arroway.de_metal+structure+06_d100_flat.jpg', graphicsDevice);
    textures[0] = textureCube;
    textures[1] = textureTeapot;

    return textures;
  }

  function createProgram() {
    var program = new Program(graphicsDevice, "shader-fs", "shader-vs");

    program.textures = initTextures(graphicsDevice);

    return program;
  }

  function drawScene(graphicsDevice) {
    var gl = graphicsDevice.gl;
    gl.viewport(0, 0, graphicsDevice.viewport.width, graphicsDevice.viewport.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, graphicsDevice.viewport.width / graphicsDevice.viewport.height, 0.1, 100.0,
      mvpMatrix.pMatrix);

    //Configurar la camara
    //WEBGL Tomara la siguiente posicion como si fuese (0,0,0)
    mat4.identity(mvpMatrix.mvMatrix);
    mat4.rotate(mvpMatrix.mvMatrix, MathUtils.degToRad(-camera.pitch), [1, 0, 0]);
    mat4.rotate(mvpMatrix.mvMatrix, MathUtils.degToRad(-camera.yaw), [0, 1, 0]);
    mat4.translate(mvpMatrix.mvMatrix, [-camera.position[0], -camera.position[1], -camera.position[2]]);

    mvpMatrix.mvPushMatrix();
    cubeModel.draw(mvpMatrix);
    mvpMatrix.mvPopMatrix();
  }

  function tick() {
    requestAnimFrame(tick);
    handleKeys();
    drawScene(graphicsDevice);
    animate();

    var gl = graphicsDevice.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  }


  //Codigo para mover la camara


  function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;
  }

  function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
  }

  function handleKeys() {
    if (currentlyPressedKeys[33]) {
      // Page Up
      pitchRate = 0.1;
    } else if (currentlyPressedKeys[34]) {
      // Page Down
      pitchRate = -0.1;
    } else {
      pitchRate = 0;
    }

    if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
      // Left cursor key or A
      yawRate = 0.1;
    } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
      // Right cursor key or D
      yawRate = -0.1;
    } else {
      yawRate = 0;
    }

    if (currentlyPressedKeys[81]) {
      camera.position[1] += 0.5;
    } else if (currentlyPressedKeys[69]) {
      camera.position[1] += -0.5;
    }

    if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
      // Up cursor key or W
      speed = 0.01;
    } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
      // Down cursor key
      speed = -0.01;
    } else {
      speed = 0;
    }

  }

  //Codigo para animar la escena
  // Used to make us "jog" up and down as we move forward.


  function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
      var elapsed = timeNow - lastTime;

      if (speed != 0) {
        camera.position[0] -= Math.sin(MathUtils.degToRad(camera.yaw)) * speed * elapsed;
        camera.position[2] -= Math.cos(MathUtils.degToRad(camera.yaw)) * speed * elapsed;

        //joggingAngle += elapsed * 0.6; // 0.6 "fiddle factor" - makes it feel more realistic :-)
        //yPos = Math.sin(degToRad(joggingAngle)) / 20 + 0.4
      }

      camera.yaw += yawRate * elapsed;
      camera.pitch += pitchRate * elapsed;

    }
    lastTime = timeNow;
  }

}, false);