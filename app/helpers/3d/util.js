export default {
  controller: null,
  createPlanes: function (scene, objects) {
    var pos = [
      // YOURS
      {
        add: true,
        x: 0,
        z: 60,
        c: 0x7FF72E
      },
      {
        add: true,
        x: -30,
        z: 60,
        c: 0x00FBE4
      },
      {
        add: true,
        x: 30,
        z: 60,
        c: 0xFF2F1A
      },

      // OTHERS
      {
        x: 0,
        z: -60,
        c: 0x468966
      },
      {
        x: -30,
        z: -60,
        c: 0x8E2800
      },
      {
        x: 30,
        z: -60,
        c: 0xD25025
      }
    ];

    pos.forEach(position => {
      var geometry = new THREE.BoxGeometry(30, 0.1, 120);
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: position.c}));
      object.material.ambient = object.material.color;
      object.position.x = position.x;
      object.position.y = 2;
      object.position.z = position.z;
      object.castShadow = true;
      object.receiveShadow = true;
      scene.add(object);

      if (position.add) {
        objects.push(object);
      }

    });

    return objects

  },

  getAvatar: function (app, navbar, game) {
    var image = new Image();
    image.crossOrigin = "Anonymous";

    image.addEventListener('load', function () {
      console.log('loaded img');
      var texture = new THREE.Texture(image);
      texture.needsUpdate = true;
      var geometry = new THREE.BoxGeometry(30, 30, 0.1);
      var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: texture}));
      mesh.rotation.y = Math.PI;
      mesh.position.x = 0;
      mesh.position.y = 15;
      mesh.position.z = -80;
      window.SCENE.add(mesh);
    }, false);


    window.GAME = game;
    // var username = navbar.get('username');
    // if (username === game.get('id')) {
    //   username = game.get('opponent');
    // }

    this.controller.gh('users/' + this.controller.get('opponent')).then((user) => {
      image.src = user.avatar_url;
    });
  },

  createCardSpots: function (scene) {
    window.POSITIONS = {
      boardCreatorL1:
      {
        x: -25,
        z: 20,
      },
      boardCreatorL2: {
        x: -25,
        z: 35,
      },
      boardCreatorC1:
      {
        x: 0,
        z: 20,
      },
      boardCreatorC2: {
        x: 0,
        z: 35,
      },
      boardCreatorR1: {
        x: 25,
        z: 20,
      },
      boardCreatorR2: {
        x: 25,
        z: 35,
      },

      boardOpponentL1:
      {
        x: 25,
        z: -5,
      },
      boardOpponentL2: {
        x: 25,
        z: -20,
      },
      boardOpponentC1:
      {
        x: 0,
        z: -5,
      },
      boardOpponentC2: {
        x: 0,
        z: -20,
      },
      boardOpponentR1: {
        x: -25,
        z: -5,
      },
      boardOpponentR2: {
        x: -25,
        z: -20,
      }


    };

    var objects = [];
/*
    Object.keys(window.POSITIONS).forEach(position => {
      var item = window.POSITIONS[position];
      var geometry = new THREE.BoxGeometry(5, 5, 5);
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xD25025}));
      object.position.x = item.x;
      object.position.y = 10;
      object.position.z = item.z;
      scene.add(object);
      //objects.push(object);

    });*/

    return objects;

  },
  /**
   *       util.addCard('L1', 'Opponent', 'neoziro/grunt-shipit');
           util.addCard('L1', 'Creator', 'Pencroff/WebStorm-Live-Template');
   */
  addCard: function (position, owner, data) {
    var scene = window.SCENE;
    if (scene) {
      Ember.Logger.info('Adding Card', data);
      var destination = window.POSITIONS['board' + owner + position];
      destination.data = data;

      var geometry = new THREE.BoxGeometry(5, 10, 0.1);
      var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: 0xFFFFFF}));
      object.position.x = destination.x;
      object.position.y = 10;
      object.position.z = destination.z;
      object.name = 'board' + owner + position;
      scene.add(object);


    }
  },
  attackCard: function (source, destination) {
    var scene = window.SCENE;

    var origSource = window.POSITIONS['board' + source];

    var sourceObject = scene.getObjectByName('board' + source);
    var destinationObject = scene.getObjectByName('board' + destination);

    var cameraOrigPos = window.CAMERA.position;

    var tween = new TWEEN.Tween(sourceObject.position)
      .to({x: destinationObject.position.x, z: destinationObject.position.z }, 500)
      .easing(TWEEN.Easing.Quadratic.Out);

    var tweenBack = new TWEEN.Tween(sourceObject.position)
      .to({x: origSource.x, z: origSource.z }, 1000);

    tween.chain(tweenBack);
    tween.start();
  },
  destroyCard: function (position, owner) {
    var scene = window.SCENE;
    Ember.Logger.info('Removing Card', 'board' + owner + position);
    var sourceObject = scene.getObjectByName('board' + owner + position);

    new TWEEN.Tween(sourceObject.position)
      .to({x: 200, y: 200, rotation: 0}, 3000)
      .easing(TWEEN.Easing.Elastic.InOut)
      .onComplete(function (params) {
        scene.remove(sourceObject);
      }).start();
  }
}

