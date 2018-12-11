document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.getElementById('mainCanvas');

  var graphicsDevice = new GraphicsDevice(canvas);

  var program = null;

  var mvpMatrix = new MVPMatrix();

  function initTextures(graphicsDevice) {
    var textures = Array(2);
    var textureCube = new Texture('img/cubeImg.gif', graphicsDevice);
    var textureTeapot = new Texture('img/arroway.de_metal+structure+06_d100_flat.jpg', graphicsDevice);
    textures[0] = textureCube;
    textures[1] = textureTeapot;

    return textures;
  }

  function createProgram() {
    program = new BasicProgram(graphicsDevice, "shader-fs", "shader-vs");

    program.textures = initTextures(graphicsDevice);

  }

  createProgram();

  var cubeModel = new GameObject(program, [0, 0, -10], 'data/cube.json', program.textures[0]);

  function drawScene() {
    var gl = graphicsDevice.gl;
    gl.viewport(0, 0, graphicsDevice.viewport.width, graphicsDevice.viewport.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, graphicsDevice.viewport.width / graphicsDevice.viewport.height, 0.1, 100.0,
      mvpMatrix.pMatrix);

    //Configurar la camara
    //WEBGL Tomara la siguiente posicion como si fuese (0,0,0)
    mat4.identity(mvpMatrix.mvMatrix);
    mat4.translate(mvpMatrix.mvMatrix, [0, 0, 0]);

    cubeModel.draw(mvpMatrix);
  }

  function tick() {
    requestAnimFrame(tick);
    //handleKeys();
    drawScene();
    //animate();

    var gl = graphicsDevice.gl;
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  }

  tick();


  //   var program = new Zia.BasicProgram(graphicsDevice, {
  //     lightingEnabled: true
  //   });
  //   program.enableDefaultLighting();

  //   var texture = Zia.Texture2D.createFromImagePath(graphicsDevice,
  //     '../assets/textures/UV_Grid_Sm.jpg');

  //   var cubeModel = Zia.GeometricPrimitive.convertToModel(
  //     graphicsDevice, Zia.GeometricPrimitive.createCube());

  //   var projectionMatrix = Zia.Matrix4.createPerspectiveFieldOfView(
  //     Zia.MathUtil.PI_OVER_FOUR,
  //     graphicsDevice.viewport.aspectRatio, 0.1, 100,
  //     new Zia.Matrix4());

  //   var viewMatrix = Zia.Matrix4.createLookAt(
  //     new Zia.Vector3(1, 1, -1),
  //     new Zia.Vector3(0, 0, 0),
  //     new Zia.Vector3(0, 1, 0),
  //     new Zia.Matrix4());

  //   var modelMatrix = Zia.Matrix4.createIdentity(new Zia.Matrix4());

  //   var lastCubeUpdateTime, rotationAngle = 0;

  //   var stats = new Stats();
  //   stats.domElement.style.position = 'absolute';
  //   stats.domElement.style.top = '0px';
  //   canvas.parentElement.appendChild(stats.domElement);

  //   function drawScene() {
  //     stats.begin();

  //     if (graphicsDevice.resize()) {
  //       Zia.Matrix4.createPerspectiveFieldOfView(
  //         Zia.MathUtil.PI_OVER_FOUR,
  //         graphicsDevice.viewport.aspectRatio,
  //         0.1, 100,
  //         projectionMatrix);
  //     }

  //     graphicsDevice.clear(
  //       Zia.ClearOptions.ColorBuffer | Zia.ClearOptions.DepthBuffer,
  //       new Zia.Color4(0.4, 0.4, 0.4, 1), 1);

  //     Zia.Matrix4.createRotationY(
  //       degToRad(rotationAngle),
  //       modelMatrix);
  //     cubeModel.draw(modelMatrix, viewMatrix, projectionMatrix);

  //     var currentTime = (new Date).getTime();
  //     if (lastCubeUpdateTime) {
  //       var delta = currentTime - lastCubeUpdateTime;
  //       rotationAngle += (10 * delta) / 1000.0;
  //     }

  //     lastCubeUpdateTime = currentTime;

  //     stats.end();

  //     requestAnimationFrame(drawScene);
  //   }

  //   function vector3ToColorArray(v) {
  //     return v.toArray().map(function(x) {
  //       return x * 255.0;
  //     });
  //   }

  //   function colorArrayToVector3(c) {
  //     return new Zia.Vector3(
  //       c[0] / 255.0,
  //       c[1] / 255.0,
  //       c[2] / 255.0);
  //   }

  //   var controls = {
  //     textureEnabled: true,
  //     lightingEnabled: true,
  //     perPixelLightingEnabled: true,

  //     diffuseColor: vector3ToColorArray(program.diffuseColor),
  //     specularColor: vector3ToColorArray(program.specularColor),
  //     specularPower: program.specularPower,
  //     emissiveColor: vector3ToColorArray(program.emissiveColor),
  //     ambientLightColor: vector3ToColorArray(program.ambientLightColor),

  //     toggleFullScreen: function() {
  //       Zia.HtmlUtil.toggleFullScreen(canvas.parentElement);
  //     }
  //   };


  //   var gui = new dat.GUI({ autoPlace: false });
  //   canvas.parentElement.appendChild(gui.domElement);

  //   var f1 = gui.addFolder('Basic parameters');
  //   f1.add(controls, 'textureEnabled').
  //     name('Texture').
  //     onChange(createProgram);
  //   f1.add(controls, 'lightingEnabled').
  //     name('Lighting').
  //     onChange(createProgram);
  //   f1.add(controls, 'perPixelLightingEnabled').
  //     name('Per-pixel lighting').
  //     onChange(createProgram);

  //   var f2 = gui.addFolder('Colors');
  //   f2.addColor(controls, 'diffuseColor').
  //     name('Diffuse color').
  //     onChange(createProgram);
  //   f2.addColor(controls, 'specularColor').
  //     name('Specular color').
  //     onChange(createProgram);
  //   f2.add(controls, 'specularPower', 1, 64).
  //     name('Specular power').
  //     onChange(createProgram);
  //   f2.addColor(controls, 'emissiveColor').
  //     name('Emissive color').
  //     onChange(createProgram);

  //   var f3 = gui.addFolder('Lighting');
  //   f3.addColor(controls, 'ambientLightColor').
  //     name('Ambient light color').
  //     onChange(createProgram);

  //   var f4 = gui.addFolder('Misc');
  //   f4.add(controls, 'toggleFullScreen').name('Fullscreen');
  //   f4.open();

  //   requestAnimationFrame(drawScene);

}, false);

// function degToRad(degree){
//   return degree * (Math.PI/180);
//  }