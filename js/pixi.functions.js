require.config({
  baseUrl: "js",
  debug: false,
  alias: {
    core: ["weblib/ssnamespace", "weblib/command/CommandPackage"],
  },
  include: ["weblib/ssnamespace", "weblib/external/createjs.min.js"],
});

require.include("weblib/liveparticles/pixi/PixiParticlePackage");
require.include("weblib/math/geom/Rectangle");

require.include("classes/elements/ElementsPackage");

getWinSize();
var sinkingship = [];

var k = 3, //springyness
  damping = 0.05, //multiplier to slow
  velocity = 0,
  targetPosition = 0,
  angle = 0,
  lastMousePosY,
  lastMousePosX,
  interacting = false,
  count = 0;

$(document).ready(function () {
  $.getJSON("json/stages.json", function (data) {
    sinkingship.scenes = data.scenes;
  })
    .success(function () {
      console.log("STAGES GRABBED");
    })
    .error(function (jqXHR, textStatus, errorThrown) {
      console.log("getJSON error: ", textStatus);
      console.log("getJSON errorThrown: ", errorThrown);
      console.log("arguments: ", arguments);
      console.log("getJSON incoming Text " + jqXHR.responseText);
    })
    .complete(function () {
      console.log("STAGES JSON GET COMPLETE");
      console.log(sinkingship.scenes);
      buildScenes();
    });
});

$(window).resize(function () {
  // resize the canvas and the renderer
  var canvas = document.querySelector("canvas");
  canvas.width = ss.SiteManager.windowWidth();
  canvas.height = $(window).height();

  renderer.resize(ss.SiteManager.windowWidth(), $(window).height());

  // loop through all the objects
});

$(window).on("mousewheel", function (event) {
  //This detects the mouse wheel movement/change
  console.dir(event.originalEvent.deltaY);
  var deltaY = event.originalEvent.deltaY * -1;

  targetPosition += deltaY * 0.35;
});

//Setup custom container attributes
var setPosPercent = function (xpercent, ypercent) {
  //get parents details(height and width)
  var parentW = this.parent._width || this.parent.originalWidth,
    parentH = this.parent._height || this.parent.originalHeight;

  //set position based on center of object and its parent
  this.position.x = Math.round((parentW / 100) * xpercent - this.width / 2);
  this.position.y = Math.round((parentH / 100) * ypercent - this.height / 2);
};

var setSizePercent = function (wpercent, hpercent) {
  //set initial height and width and get parents details(height and width)
  var parentW = this.parent._width || this.parent.originalWidth,
    parentH = this.parent._height || this.parent.originalHeight;

  //detect if porportions are set based on ratio with height or width
  if (hpercent == "auto") {
    this.width = (parentW / 100) * wpercent;
    this.height = this.width * (this.originalWidth / this.originalHeight);
  } else if (wpercent == "auto") {
    this.height = (parentH / 100) * hpercent;
    this.width = this.height * (this.originalHeight / this.originalWidth);
  } else {
    this.width = (parentW / 100) * wpercent;
    this.height = (parentH / 100) * hpercent;
  }
};

//declare the new constructor functions
function PercentContainer(name) {
  PIXI.DisplayObjectContainer.call(this);
  this.name = name;
}
function PercentRope(texture) {
  PIXI.Rope.call(this, texture);
}

//create the constructors
PercentContainer.constructor = PercentContainer;
//set the base attributes to copy from
PercentContainer.prototype = Object.create(
  PIXI.DisplayObjectContainer.prototype
);
//set the custom attributes
PercentContainer.prototype.setSizePercent = setSizePercent;
PercentContainer.prototype.setPositionPercent = setPosPercent;

PercentRope.constructor = PercentRope;
//set the base attributes to copy from
PercentRope.prototype = Object.create(PIXI.Rope.prototype);
//set the custom attributes
PercentRope.prototype.setSizePercent = setSizePercent;
PercentRope.prototype.setPositionPercent = setPosPercent;

function setAllDisplayObjectProperties(dispObj, w, h, x, y) {
  return;

  console.log(
    "~~~~~~~~~~~~~~~~~ SET THIS ALL PROPERTIES FUNC ~~~~~~~~~~~~~~~~~"
  );
  console.log("dispObj: ", dispObj);

  dispObj.originalWidth = dispObj.originalWidth || dispObj.width || w;
  dispObj.originalHeight = dispObj.originalHeight || dispObj.height || h;

  console.log("w: ", w);
  console.log("h: ", h);

  console.log("dispObj.width: ", dispObj.width);
  console.log("dispObj.height: ", dispObj.height);

  console.log("dispObj.originalWidth: ", dispObj.originalWidth);
  console.log("dispObj.originalHeight: ", dispObj.originalHeight);

  //dispObj.originalPositionX = parseInt(dispObj.originalPositionX || dispObj.position.x || x);
  //dispObj.originalPositionY = parseInt(dispObj.originalPositionY || dispObj.position.y || y);
  //dispObj.position.y = dispObj.originalPositionY;
  //dispObj.position.x = dispObj.originalPositionX;

  //this times new width gives new height
  //dispObj.aspectRatioWidth = dispObj.originalHeight / dispObj.originalWidth;
  //this times new height gives new width
  //dispObj.aspectRatioHeight = dispObj.originalWidth / dispObj.originalHeight;
}

// for drew's code
ss.setAllDisplayObjectProperties = setAllDisplayObjectProperties;

function interactKeyDown(evt) {
  console.log("key pressed");
  // 38 = up, 40 = down
  if (evt.keyCode == 38) {
    targetPosition += 100;
  } else if (evt.keyCode == 40) {
    targetPosition += -100;
  } else if (evt.keyCode == 36) {
    targetPosition = 0;
  } else if (evt.keyCode == 35) {
    targetPosition = winSize.y * 7 * -1;
  } else if (evt.keyCode == 34) {
    targetPosition += winSize.y * -1;
  } else if (evt.keyCode == 33) {
    targetPosition += winSize.y;
  }
}
function interactStart(evt) {
  interacting = true;
  lastMousePosY = evt.pageY;
  lastMousePosX = evt.pageX;
}

function interactEnd(evt) {
  interacting = false;
}

function interactMove(evt) {
  if (interacting) {
    var mouseDelta = evt.pageY - lastMousePosY;
    targetPosition += mouseDelta;
    lastMousePosY = evt.pageY;
    lastMousePosX = evt.pageX;
  }
}

var renderer;

function buildScenes() {
  var prevTime;
  var curTime = new Date().getTime();
  // create an new instance of a pixi stage
  var stage = new PIXI.Stage(0x45cac9);
  //stage.setInteractive(true);

  // create a renderer instance
  renderer = PIXI.autoDetectRenderer(winSize.x, winSize.y);

  // add the renderer view element to the DOM
  document.body.appendChild(renderer.view);

  window.addEventListener("keydown", interactKeyDown, true);

  window.addEventListener("mousedown", interactStart);
  window.addEventListener("touchstart", interactStart);
  window.addEventListener("mousemove", interactMove);
  window.addEventListener("touchmove", interactMove);
  window.addEventListener("mouseup", interactEnd);
  window.addEventListener("mouseout", interactEnd);
  window.addEventListener("touchend", interactEnd);
  window.addEventListener("touchleave", interactEnd);
  window.addEventListener("touchcancel", interactEnd);
  renderer.render(stage);

  /*						*
   *  GLOBAL BACKGROUND	*
   *						*/

  sinkingship.background = [];
  sinkingship.background.__name = "mainBg";

  sinkingship.background.obj = new PercentContainer(
    sinkingship.background.__name
  );
  sinkingship.background.obj.width = winSize.x;

  sinkingship.background.obj.texture = new PIXI.Texture.fromImage(
    "img/scenes/global/full-bg.png"
  );
  sinkingship.background.obj.texture.requiresUpdate = true;

  sinkingship.background.obj.sprite = new PIXI.TilingSprite(
    sinkingship.background.obj.texture
  );

  stage.addChild(sinkingship.background.obj.sprite);
  sinkingship.background.obj.sprite.width = winSize.x;
  sinkingship.background.obj.sprite.height =
    winSize.y * sinkingship.scenes.length;

  setAllDisplayObjectProperties(
    sinkingship.background.obj.sprite,
    winSize.x,
    winSize.y * sinkingship.scenes.length,
    0,
    0
  );

  /*					*
   *  CREATE SCENES	*
   *					*/
  //find all the stages from json site array
  for (s = 0; s < sinkingship.scenes.length; s++) {
    //clean up the scene name to lowercase and - for spaces
    var scene = sinkingship.scenes[s];
    var sceneName = scene.details.name.toLowerCase().replace(/ /g, "-");

    scene.__name = sceneName;

    scene.obj = new PercentContainer(sceneName);

    stage.addChild(scene.obj);
    setAllDisplayObjectProperties(
      scene.obj,
      winSize.x,
      winSize.y,
      0,
      s * winSize.y
    );

    /*					*
     *  CREATE LAYERS	*
     *					*/
    //find all the layers within the scene from json site array
    for (l = 0; l < scene.layers.length; l++) {
      //clean up the layer name to lowercase and - for spaces
      var layer = scene.layers[l];
      var layerName = layer.details.name.toLowerCase().replace(/ /g, "-");

      layer.__name = layerName;

      layer.obj = new PercentContainer(layerName);
      scene.obj.addChild(layer.obj);

      setAllDisplayObjectProperties(layer.obj, winSize.x, winSize.y, 0, 0);

      /*						  *
       *  CREATE LAYER EFFECTS  *
       *					 	  */
      if (layer.effects) {
        for (e = 0; e < layer.effects.length; e++) {
          var effect = layer.effects[e],
            effectName = effect.type.toLowerCase().replace(/ /g, "-");

          if (effect.type == "dirt") {
            var bubbleTexture = PIXI.Texture.fromImage(
              "img/scenes/global/particle1.png"
            );
            var factory = new ss.PixiSpriteParticleFactory(bubbleTexture);
            var spawnTimer = new ss.UniformSpawnTimer(1);
            //function(rect, minSpeed, maxSpeed, minRotate, maxRotate){
            var emitorSize = Math.random() * (2 * Math.PI);
            var spawnShape = new ss.BoxSpawnShape(
              new ss.Rectangle(
                new Vector2(0, 0),
                new Vector2(winSize.x, winSize.y)
              ),
              0,
              0,
              emitorSize,
              emitorSize
            );
            var emitter = new ss.PixiParticleEmitter();
            emitter.setupFromObjects(
              20,
              10,
              30,
              factory,
              spawnTimer,
              spawnShape,
              [
                new ss.InterpolatePropertyUpdater(
                  "alpha",
                  0.25,
                  0,
                  Interpolation.linear
                ),
                new ss.InterpolatePropertyUpdater(
                  "scale",
                  0.5,
                  2.5,
                  Interpolation.linear,
                  "x"
                ),
                new ss.InterpolatePropertyUpdater(
                  "scale",
                  0.5,
                  2.5,
                  Interpolation.linear,
                  "y"
                ),
              ],
              layer.obj
            );
            emitter.x = 0;
            emitter.y = 0;

            layer.obj.addChild(emitter);
            emitter.startEmit();
          }
        }
      }

      /*					*
       *  CREATE OBJECTS	*
       *					*/
      //find all the objects within the layer from json site array
      if (layer.objects) {
        for (o = 0; o < layer.objects.length; o++) {
          //clean up the layer name to lowercase and - for spaces
          var currentObj = layer.objects[o];
          var objectName = currentObj.details.name
            .toLowerCase()
            .replace(/ /g, "-");

          currentObj.__name = objectName;

          if (currentObj.details.type == "img") {
            //if type of object is img then add img+sprite to layer container

            currentObj.sprite = new ss.TextureSprite(currentObj); // new PercentSprite(currentObj.texture);

            currentObj.sprite.__name = objectName;

            layer.obj.addChild(currentObj.sprite);
            //setAllDisplayObjectProperties ( currentObj.sprite, currentObj.size.w, currentObj.size.h, currentObj.position.x, currentObj.position.y );

            //currentObj.sprite.setSizePercent(currentObj.size.w, currentObj.size.h);
            //currentObj.sprite.setPositionPercent(currentObj.position.x, currentObj.position.y);

            /*							*
             *  CREATE OBJECT FILTERS 	*
             *							*/

            if (currentObj.filters) {
              console.log("%c HERE! ", "background: #222; color: #bada55");
              for (f = 0; f < currentObj.filters.length; f++) {
                var filter = currentObj.filters[f],
                  filterName = filter.type.toLowerCase().replace(/ /g, "-");

                console.log("filter.type: ", filter.type);
                if (filter.type == "//displacement") {
                  var blurFilter = new PIXI.DisplacementFilter(
                    currentObj.sprite.texture
                  );
                  currentObj.sprite.filters = [blurFilter];
                }
              }
            }
          } else if (currentObj.details.type == "snake") {
            //if type of object is img then add img+sprite to layer container

            currentObj.points = [];

            for (var i = 0; i < 20; i++) {
              var segSize = length;
              currentObj.points.push(new PIXI.Point(i * length, 0));
            }

            currentObj.texture = new PIXI.Texture.fromImage(
              currentObj.details.src
            );
            currentObj.rope = new PIXI.Rope(
              currentObj.texture,
              currentObj.points
            );
            currentObj.ropeContainer = new PercentContainer();

            layer.obj.addChild(currentObj.ropeContainer);
            currentObj.ropeContainer.addChild(currentObj.rope);

            setAllDisplayObjectProperties(
              currentObj.ropeContainer,
              currentObj.size.w,
              currentObj.size.h,
              currentObj.position.x,
              currentObj.position.y
            );
            //need to make this percent rope type
            //setAllDisplayObjectProperties(currentObj.rope, 100, 100, 0, 0);
            currentObj.rope.scale.x = 1.5;

            currentObj.ropeContainer.setSizePercent(
              currentObj.size.w,
              currentObj.size.h
            );
            currentObj.ropeContainer.setPositionPercent(
              currentObj.position.x,
              currentObj.position.y
            );
          }

          /*							*
           *  CREATE OBJECT EFFECTS 	*
           *							*/

          if (currentObj.effects && false) {
            for (e = 0; e < currentObj.effects.length; e++) {
              var effect = currentObj.effects[e],
                effectName = effect.type.toLowerCase().replace(/ /g, "-");

              if (effect.type == "float") {
                effect.position = {
                  y: Math.random() * (2 * Math.PI),
                  x: Math.random() * (2 * Math.PI),
                };
                effect.speed = {
                  y: Math.random() * effect.drag,
                  x: Math.random() * effect.drag,
                };
                effect.distance = {
                  y: Math.random() * (currentObj.sprite._height * (10 / 100)),
                  x: Math.random() * (currentObj.sprite._width * (10 / 100)),
                };
              }
              if (effect.type == "fade") {
                effect.speed = Math.random() * effect.speed * 0.0001;
                effect.fade = effect.speed;
              }
              if (effect.type == "bubbles") {
                var bubbleTexture = PIXI.Texture.fromImage(
                  "img/scenes/global/bubble1.png"
                );
                var factory = new ss.PixiSpriteParticleFactory(bubbleTexture);
                var spawnTimer = new ss.UniformSpawnTimer(3);

                //(center, radius, minSpeed, maxSpeed, minAngle, maxAngle)
                var spawnShape = new ss.RadialSpawnShape(
                  new Vector2(0, 0),
                  20,
                  50,
                  100,
                  262,
                  277
                );
                var emitter = new ss.PixiParticleEmitter();
                emitter.setupFromObjects(
                  15,
                  5,
                  10,
                  factory,
                  spawnTimer,
                  spawnShape,
                  [
                    new ss.InterpolatePropertyUpdater(
                      "alpha",
                      1,
                      0,
                      Interpolation.linear
                    ),
                    new ss.InterpolatePropertyUpdater(
                      "scale",
                      0.5,
                      1.5,
                      Interpolation.linear,
                      "x"
                    ),
                    new ss.InterpolatePropertyUpdater(
                      "scale",
                      0.5,
                      1.5,
                      Interpolation.linear,
                      "y"
                    ),
                  ],
                  layer.obj
                );
                emitter.y = 50;

                currentObj.sprite.addChild(emitter);
                emitter.startEmit();
              }
            }
          }
        }
      }
    }

    function animate() {
      if (targetPosition > 0) {
        targetPosition = 0;
      }

      if (targetPosition < winSize.y * 7 * -1) {
        targetPosition = winSize.y * 7 * -1;
      }

      prevTime = curTime;
      curTime = new Date().getTime();
      deltaTime = (curTime - prevTime) / 1000;

      for (s = 0; s < sinkingship.scenes.length; s++) {
        var scene = sinkingship.scenes[s];

        //This moves the scenes based on targetPosition change
        // console.log(targetPosition);

        var direction = targetPosition + s * winSize.y - scene.obj.position.y;
        direction = direction * k;
        velocity = velocity * damping + direction;

        sinkingship.scenes[s].obj.position.y += velocity * deltaTime;

        sinkingship.background.obj.sprite.position.y =
          sinkingship.scenes[0].obj.position.y;

        for (l = 0; l < sinkingship.scenes[s].layers.length; l++) {
          var layer = scene.layers[l];

          //This moves the layers based on scene position
          layer.obj.position.y = scene.obj.position.y * layer.details.depth;

          if (layer.objects) {
            for (o = 0; o < layer.objects.length; o++) {
              var currentObj = layer.objects[o];

              if (currentObj.effects) {
                for (e = 0; e < currentObj.effects.length; e++) {
                  var effect = currentObj.effects[e];

                  if (effect.type == "float") {
                    effect.position.x =
                      effect.position.x +
                      ((effect.speed.x * deltaTime) % (2 * Math.PI));
                    effect.position.y =
                      effect.position.y +
                      ((effect.speed.y * deltaTime) % (2 * Math.PI));

                    var screenPositionX =
                      (currentObj.position.x / 100.0) * winSize.x;
                    var screenPositionY =
                      (currentObj.position.y / 100.0) * winSize.y;
                    currentObj.sprite.position.x =
                      screenPositionX +
                      Math.sin(effect.position.x) * effect.distance.x -
                      currentObj.sprite.width / 2;
                    currentObj.sprite.position.y =
                      screenPositionY +
                      Math.sin(effect.position.y) * effect.distance.y -
                      currentObj.sprite.height / 2;
                  } else if (effect.type == "snake") {
                    count += 0.005;
                    var length = 1920 / 20;

                    for (var i = 0; i < currentObj.points.length; i++) {
                      currentObj.points[i].y = Math.sin(i * 5 + count) * 5;
                      currentObj.points[i].x =
                        i * length + Math.cos(i * 10 + count) * 5;
                    }
                  } else if (effect.type == "fade") {
                    effect.fade += effect.speed;
                    //effect.speed
                    //Math.random() * (2 * Math.PI)

                    currentObj.sprite.alpha = Math.sin(effect.fade - 1);
                    //currentObj.points[i].x = i * length + Math.cos(i * 10 + count) * 5;
                  }
                }
              }
            }
          }
        }
      }

      requestAnimFrame(animate);
      renderer.render(stage);
    }

    requestAnimFrame(animate);
  }
}

function getWinSize() {
  return (winSize = {
    x: $(window).width(),
    y: $(window).height(),
  });
}
