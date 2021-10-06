set /p Build=<scrapper_download_list.txt
set APPROOT="%cd%"

call npm run build-impldownload
call npm run start-impldownload %APPROOT% %Build%