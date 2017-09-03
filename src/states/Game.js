/* globals __DEV__ */
import Phaser from 'phaser';
import Mushroom from '../sprites/Mushroom';

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('gren_tileset', 'gameTiles');

    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.blockingLayer = this.map.createLayer('blockingLayer');

    this.map.setCollisionBetween(1, 100000, true, 'blockingLayer');

    this.skeleton = this.game.add.sprite(100, 100, 'skeleton');
    this.game.physics.arcade.enable(this.skeleton);
    this.skeleton.body.immovable = true;

    const playerStarts = this.findObjectsByType('playerStart', this.map, 'objectLayer');
    this.player = this.game.add.sprite(playerStarts[0].x, playerStarts[0].y, 'charSprites', 15);
    this.player.animations.add('walk', [
      15, 16, 17, 18, 20, 21, 22, 23
    ]);
    this.player.anchor.setTo(0.5, 0.5);
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.backgroundLayer.resizeWorld();

    this.game.input.keyboard.addKey(Phaser.KeyCode.Z).onDown.add(this.onZDown.bind(this));

    this.createItems();
    // const rupee = this.game.add.sprite(50, 50, 'rupee');
    // rupee.animations.add('idle');
    // rupee.animations.play('idle', 10, true);

    this.dialogState = 'none';
  }

  createItems() {
    this.items = this.game.add.group();
    this.items.enableBody = true;
    const rupees = this.findObjectsByType('rupee', this.map, 'objectLayer');
    rupees.forEach(element => {
      const newRupee = this.items.create(element.x, element.y, 'rupee');
      newRupee.body.setSize(8, 6, 16, 23);
      newRupee.animations.add('idle');
      newRupee.animations.play('idle', 10, true);
    });
  }

  findObjectsByType(type, map, layer) {
    const result = [];
    map.objects[layer].forEach(element => {
      if (element.type === type) {
        // Phaser uses top left, Tiled bottom left so we have to adjust
        const newElement = Object.assign({}, element, {
          y: element.y - map.tileHeight
        });
        result.push(newElement);
      }
    });
    return result;
  }

  onZDown() {
    this.dialogState = 'shown';
    const dialogGroup = this.game.add.group();

    const graphics = new Phaser.Graphics(this.game, 0, 0);
    graphics.beginFill('#000');
    graphics.drawRect(0, 0, 500, 75);
    graphics.endFill();
    dialogGroup.add(graphics);

    const content = `\
But I still hear them walking in the trees; not speaking. \
Waiting here, away from the terrifying weaponry, out of the halls \
of vapor and light, beyond holland and into the hills, I have come to`;
    const text = new Phaser.Text(this.game, 10, 10, content, {
      fill: '#fff',
      font: 'Inconsolata',
      fontSize: 14,
      wordWrap: true,
      wordWrapWidth: 480
    });
    dialogGroup.add(text);

    dialogGroup.alignIn(this.game.camera.view, Phaser.CENTER);
  }

  collect(player, collectable) {
    collectable.destroy();
    this.sound.play('coin_sound', 0.5);
  }

  update() {
    this.game.physics.arcade.collide(this.player, this.skeleton);
    this.game.physics.arcade.collide(this.player, this.blockingLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect.bind(this), null, this);

    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    const moveSpeed = 160;
    let xVel = 0, yVel = 0;
    if(this.cursors.up.isDown) {
      yVel = -moveSpeed;
    } else if(this.cursors.down.isDown) {
      yVel = moveSpeed;
    }
    if(this.cursors.left.isDown) {
      xVel = -moveSpeed;
    }
    else if(this.cursors.right.isDown) {
      xVel = moveSpeed;
    }
    this.player.body.velocity.x += xVel;
    this.player.body.velocity.y += yVel;
    if (xVel != 0 || yVel != 0) {
      this.player.animations.play('walk', 10, true);
      this.player.rotation = Math.atan2(yVel, xVel) - Math.PI / 2.0;
    } else {
      this.player.animations.frame = 15;
      this.player.animations.stop('walk');
    }
  }

  render() {
  }
}
