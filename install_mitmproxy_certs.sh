#!/bin/bash

mitmproxy &
sleep 1
kill -s SIGKILL %1
cp ~/.mitmproxy/mitmproxy-ca-cert.pem /usr/local/share/ca-certificates/extra/
update-ca-certificates