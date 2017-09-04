#!/usr/bin/env python

import json

if __name__ == '__main__':
  with open('assets/gren_map.json', 'r') as fp:
    map_json = json.load(fp)
  data_arrays = []
  for layer in map_json['layers']:
    if 'data' in layer:
      data_arrays.append(layer['data'])
      layer['data'] = '<<DATA:{}>>'.format(len(data_arrays) - 1)
  map_json['tilesets'] = [{
    "columns": 0,
    "firstgid": 1,
    "margin": 0,
    "imageheight": 200,
    "imagewidth": 200,
    "image": "assets/tileset_atlas.png",
    "name": "gren_tileset",
    "spacing": 0,
    "tilewidth": 40,
    "tileheight": 40
  }]
  # https://bugs.python.org/issue16333
  out_string = json.dumps(map_json, indent=2, separators=(',', ':'), sort_keys=True)
  for (i, data) in enumerate(data_arrays):
    out_string = out_string.replace('"<<DATA:{}>>"'.format(i), json.dumps(data))
  with open('assets/gren_map.json', 'w') as fp:
    fp.write(out_string)

