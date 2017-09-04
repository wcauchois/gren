import Phaser from 'phaser';

export function centerGameObjects(objects) {
  objects.forEach(object => {
    object.anchor.setTo(0.5);
  });
}

export function range(begin, end) {
  const result = [];
  for (let i = begin; i < end; i++) {
    result.push(i);
  }
  return result;
}

export function objectCenter(obj) {
  return new Phaser.Point(obj.centerX, obj.centerY);
}

export function cross() {
  if (arguments.length === 0) {
    throw new Error(`Requires at least one argument!`);
  } else if (arguments.length === 1) {
    return arguments[0];
  } else {
    const result = [];
    const restCross = cross.apply(null, Array.prototype.slice.call(arguments, 1));
    arguments[0].forEach(item => {
      restCross.forEach(list => {
        result.push([item].concat(list));
      });
    });
    return result;
  }
}
