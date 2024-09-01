var fs = require('fs')
var file = require('./data.json')
console.log(file.name)

fs.readFile('./data.json', 'utf-8', (err,data)=>{
    var data = JSON.parse(data)
    console.log(data.name)
})

var data ={
    name:"tom"
}

fs.writeFile('./data2.json', JSON.stringify(data), (err)=>{
    console.log("wrotong si done ", err)
})