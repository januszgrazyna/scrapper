#!/bin/sh
set -e

ngrok tcp 8080 > /dev/null &
echo "waiting for ngrok start"
sleep 15
url=$(curl -s http://127.0.0.1:4040/api/tunnels | jq -r '.tunnels[] | .public_url')

echo "starting mitmdump"
mitmdump --set ssl_insecure=true > /dev/null &

echo "tunnel at $url"

sleep inf