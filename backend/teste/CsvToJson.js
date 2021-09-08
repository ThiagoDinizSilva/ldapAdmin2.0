const csv = require('csv-parser')
const fs = require('fs')
const results = [];

fs.createReadStream('./2.csv')
    .pipe(csv({
        separator: ';',
        mapHeaders: ({ header, index }) => header.toLowerCase(),
        mapValues: ({ header, index, value }) => value.trim().replace(/  +/g, ' >> ').toLowerCase()
    }))
    .on('data', (data) => console.log(data))//results.push(data))
    .on('end', () => {
    }); 