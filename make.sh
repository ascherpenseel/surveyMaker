#! /bin/bash
cd api/
mkdir db
./reset-db.sh
npm install &
cd ../client
npm install &

