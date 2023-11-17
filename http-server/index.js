const http = require("http");
const fs = require("fs");


const args = require('minimist')(process.argv.slice(2));



let registrationContent = "";

fs.readFile("registration.html",(err,registration)=>{
    if (err){
        throw err;
    }

    registrationContent = registration;
})

let homeContent = "";

fs.readFile("home.html",(err,home)=>{
    if (err){
        throw err;
    }

    homeContent = home;
})

let projectContent = "";

fs.readFile("project.html",(err,project)=>{
    if (err){
        throw err;
    }

    projectContent = project;
})
const server = http.createServer((req,res)=>{
    let url = req.url;
    res.writeHeader(200, { "Content-Type": "text/html" });
    if (url=="/project"){
        res.write(projectContent);
        res.end();
    }
    else if(url == "/registration"){
        res.write(registrationContent);
        res.end();
    }
    else{
        res.write(homeContent);
        res.end();
    }

}).listen(args["port"],(err)=>{
    if (err){
        throw err
    }
    console.log(args["port"])
})