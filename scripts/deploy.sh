#!/bin/bash
for item in index.html assets dist; do
  mayberecursive=
  if [ -d $item ]; then
    mayberecursive=--recursive
  fi
  aws s3 cp $mayberecursive --acl public-read $item s3://cloudhacking-assets/gren/$item
done
