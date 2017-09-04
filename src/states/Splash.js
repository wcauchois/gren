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
    this.load.image('skeleton', 'assets/skeleton.png');
    this.load.tilemap('level1', 'assets/gren_map.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/tileset_atlas.png');
    const frameSize = 48;
    const w = 5, h = 8;
    const frames = [];
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        frames.push({frame: {
          x: x * frameSize,
          y: y * frameSize,
          w: frameSize,
          h: frameSize,
          filename: `frame_${x + y * w}`
        }});
      }
    }
    this.load.atlas('charSprites', 'assets/char_sprites.png', null, {
      frames: frames
    });
    this.load.spritesheet('rupee', 'assets/rupee_sprite.png', 36, 36, 24 /* maxFrames */);
    this.load.audio('coin_sound', 'assets/coin_sound.mp3');
    this.load.audio('interact1', 'assets/interact1.mp3');
    this.load.audio('interact2', 'assets/interact2.mp3');

    this.soundsDecoded = false;
    this.sound.setDecodedCallback([
      'coin_sound', 'interact1', 'interact2'
    ], this.onSoundsDecoded, this);
  }

  onSoundsDecoded() {
    this.soundsDecoded = true;
  }

  render() {
    if (this.soundsDecoded) {
      this.state.start('Game');
    }
  }
}
