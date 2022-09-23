#!/bin/bash

date -u

npx prisma generate

exec "$@"
