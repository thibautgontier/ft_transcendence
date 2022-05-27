#!/bin/bash

date -u

cd backend
npm install

exec "$@"
