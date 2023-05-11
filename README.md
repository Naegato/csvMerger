# CSV MERGER

First you must have docker installed on your machine.

## How to run ?

1. Clone this repository
2. Run `docker compose up` or `docker-compose up`  on the root folder (this run on you port 3000 and 8080)
3. Open your browser and go to `http://localhost:3000/`
4. Upload your csv files
5. Click on `Process` button
6. View the result in `/php/concat.csv`
7. Enjoy!

## How to use it ?

- You can click on the label of column to modify the name of the column
- You can click on the first three dots to choose the column you want to merge
- You can click on the last three dots the function to use if data was null
- You can click on the 🔒 / 🔓 button to lock / unlock the column