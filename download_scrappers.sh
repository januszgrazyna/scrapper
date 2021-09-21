#!/bin/bash


npm run build-impldownload
APPROOT=$(pwd)
IFS=$'\n' read -ra arr -d '' <scrapper_download_list.txt
npm run start-impldownload "$APPROOT" "${arr[@]}"
cat impls/Allegro/AllegroItemsPage.ts