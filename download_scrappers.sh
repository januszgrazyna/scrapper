#!/bin/bash

npm run build-impldownload
APPROOT=$(pwd)
npm run start-impldownload "$APPROOT" "Allegro"