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

    this.player = this.game.add.sprite(10, 10, 'mushroom');
    this.game.physics.arcade.enable(this.player);
    this.game.camera.follow(this.player);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.backgroundLayer.resizeWorld();
  }

  update() {
    this.game.physics.arcade.collide(this.player, this.blockingLayer);

    this.player.body.velocity.y = 0;
    this.player.body.velocity.x = 0;
 
    const moveSpeed = 160;
    if(this.cursors.up.isDown) {
      this.player.body.velocity.y -= moveSpeed;
    } else if(this.cursors.down.isDown) {
      this.player.body.velocity.y += moveSpeed;
    }
    if(this.cursors.left.isDown) {
      this.player.body.velocity.x -= moveSpeed;
    }
    else if(this.cursors.right.isDown) {
      this.player.body.velocity.x += moveSpeed;
    }
  }

  render() {
  }
}
