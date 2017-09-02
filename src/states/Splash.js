import Phaser from 'phaser';
import {centerGameObjects} from '../utils';

export default class extends Phaser.State {
  init() {}

  preload() {
    this.loaderBg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBg');
    this.loaderBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loaderBar');
    centerGameObjects([this.loaderBg, this.loaderBar]);

    this.load.setPreloadSprite(this.loaderBar);

    this.load.image('mushroom', 'assets/images/mushroom2.png');
    this.load.tilemap('level1', 'assets/gren_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/tileset_atlas.png');
  }

  create() {
    this.state.start('Game');
  }
}
