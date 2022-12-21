

"use strict";


//import express + call constructor
const express = require("express");
const app = express();


//serve static html directly to client (middleware)
app.use(express.static("client"));

//body parser

//get teams from json file
let teams = require("./teams.json");




//get request - returns list of team names
app.get("/teams", (req,resp) => {
    let response = [];
    for(const t of teams){
        response.push(t.name);
    }
    //set content-type
    resp.setHeader("content-type" , "application/json");
    resp.send(JSON.stringify(response));
});




//returns detail of an individual team
app.get("/teaminfo", (req,resp) => {

    const teamName = req.query.name;
    resp.setHeader("content-type", "application/json");

    for(const t of teams){
        //if match found - send back team + return
        if (t.name === teamName){
            resp.send(t);
            return
        }
    }
    //no match found - send 400 BAD request
    resp.status(400).send(JSON.stringify(`BAD REQUEST: No team matches the name ${teamName}`));
});





app.listen(8090);



