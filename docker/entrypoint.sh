#!/bin/sh
set -e

node /app/gen-config.mjs
/usr/local/bin/busybox crond -L /dev/stderr
exec /usr/sbin/nginx -g 'daemon off;'
