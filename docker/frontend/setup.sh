#!/bin/bash

date -u

cd frontend
npm install

exec "$@"
