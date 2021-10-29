#!/bin/bash

set -e

mitmdump &
sleep 5
kill -s SIGKILL %1
ls ~/.mitmproxy
cp ~/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/mitmproxy-ca-cert.crt
update-ca-certificates