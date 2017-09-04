/* globals __DEV__ */
import Phaser from 'phaser';
import Mushroom from '../sprites/Mushroom';
import {defaultFont} from '../config';
import strings from '../strings';

class Dialog extends Phaser.Group {
  constructor(game, content) {
    super(game);
    this.content = content;
    this.counter = 0;
    this.showArrow = true;

    this.graphics = new Phaser.Graphics(this.game, 0, 0);
    this.redrawGraphics();
    this.add(this.graphics);

    this.text = new Phaser.Text(this.game, 10, 10, content, {
      fill: '#fff',
      font: defaultFont,
      fontSize: 14,
      wordWrap: true,
      wordWrapWidth: 460
    });
    this.add(this.text);

    this.alignIn(this.game.camera.view, Phaser.BOTTOM_CENTER, 0, -40);
  }

  redrawGraphics() {
    this.graphics.clear();
    this.graphics.beginFill(0);
    this.graphics.drawRect(0, 0, 500, 75);
    this.graphics.endFill();
    if (this.showArrow) {
      this.graphics.beginFill(0xffffff);
      this.graphics.drawTriangle([
        new Phaser.Point(480, 10),
        new Phaser.Point(490, 37.5),
        new Phaser.Point(480, 65),
      ]);
    }
    this.graphics.endFill();
  }

  update() {
    const interval = 30;
    this.counter += 1;
    if (this.counter > interval) {
      this.counter = 0;
      this.showArrow = !this.showArrow;
      this.redrawGraphics();
    }
  }

  advance() {
    this.destroy();
  }
}

export default class extends Phaser.State {
  init() {}
  preload() {}

  create() {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('gren_tileset', 'gameTiles');

    this.backgroundLayer = this.map.createLayer('backgroundLayer');
    this.blockingLayer = this.map.createLayer('blockingLayer');

    this.map.setCollisionBetween(1, 100000, true, 'blockingLayer');

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
    this.createNpcs();

    this.dialog = null;
    this.objectTouched = null;
  }

  createNpcs() {
    this.npcs = this.game.add.group();
    this.npcs.enableBody = true;
    console.log(this.findObjectsByType('npc', this.map, 'objectLayer'));
    this.findObjectsByType('npc', this.map, 'objectLayer').forEach(item => {
      console.log(item);
      const npc = this.npcs.create(item.x, item.y, item.properties.sprite);
      Object.assign(npc.data, item.properties);
      this.game.physics.arcade.enable(npc);
      npc.body.immovable = true;
    });
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

  showDialog(content) {
    if (this.dialog) {
      return;
    }
    this.dialog = new Dialog(this.game, content);
    this.game.world.add(this.dialog);
    this.dialog.onDestroy.add(() => {
      this.dialog = null;
    });
  }

  onZDown() {
    if (!this.dialog) {
      if (this.objectTouched) {
        if ('string' in this.objectTouched.data) {
          this.showDialog(strings[this.objectTouched.data['string']]);
        }
      }
    } else {
      this.dialog.advance();
    }
  }

  collect(player, collectable) {
    collectable.destroy();
    this.sound.play('coin_sound', 0.5);
  }

  npcTouched(player, npc) {

  }

  update() {
    this.objectTouched = null;
    const inflationAmount = 5
    const playerInflatedBounds = this.player.getBounds().inflate(inflationAmount, inflationAmount);
    // TODO: Disambiguate multiple touched objects by distance.
    this.npcs.forEach(npc => {
      if (npc.getBounds().intersects(playerInflatedBounds)) {
        this.objectTouched = npc;
      }
    });
    this.game.physics.arcade.collide(this.player, this.npcs);
    this.game.physics.arcade.collide(this.player, this.blockingLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);

    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;

    const canMove = !this.dialog;
    const moveSpeed = 160;
    let xVel = 0, yVel = 0;

    if (canMove) {
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
    }
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
