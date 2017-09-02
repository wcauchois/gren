#!/usr/bin/env python
from PIL import Image
import xml.etree.ElementTree as ET
import os
import math
from collections import namedtuple

class Tile:
  def __init__(self, id, relative_filename):
    self.id = id
    self.filename = os.path.join('assets', relative_filename)

class BreakIt(Exception):
  pass

if __name__ == '__main__':
  tree = ET.parse('assets/gren_tileset.tsx')
  root = tree.getroot()
  tiles = []
  tiles_by_id = {}
  for tile_elem in root.findall('tile'):
    id = int(tile_elem.get('id'))
    source = tile_elem.find('image').get('source')
    t = Tile(id, source)
    tiles.append(t)
    tiles_by_id[t.id] = t
  dim = int(math.ceil(math.sqrt(float(max(tiles, key=lambda t: t.id).id))))
  tile_size = 40 # Hardcoded for now

  atlas_size = dim * tile_size
  out_image = Image.new('RGBA', (atlas_size, atlas_size), 'white') 
  for y in range(0, dim):
    for x in range(0, dim):
      idx = x + y * dim
      if idx in tiles_by_id:
        tile = tiles_by_id[idx]
        tile_im = Image.open(tile.filename)
        out_image.paste(tile_im, (x * tile_size, y * tile_size))
  out_image.save('assets/tileset_atlas.png', 'png')

