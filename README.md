## Requirements

You need to have **Node** and **git** installed.

## Installation

After cloning the repository go to the repo directory and execute `. ./make.sh`. You can also manually do 
```
cd ./api
mkdir db
./reset-db.sh
npm install

cd ../client
npm install
```

## Running the app

Go to **/api** and execute `npm start`. Your *api* server will start on port **9000**.

Go to **/client** and execute `npm start`. Your application will start on port **8000**.

Go to your browser at *localhost:3000/* and create a new survey =)
