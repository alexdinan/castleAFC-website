

"use strict";


//import express + call constructor
const express = require("express");
const app = express();


//serve static html directly to client (middleware)
app.use(express.static("client"));

//body parser

//get teams from json file
let teams = require("./teams.json");
let fixtures = require("./fixtures.json");




//get request - returns list of team names
app.get("/teams", (req,resp) => {
    let teamList = [];
    for(const t of teams){
        teamList.push(t.name);
    }
    //set content-type
    resp.setHeader("content-type" , "application/json");
    resp.send(JSON.stringify(teamList));
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
    resp.status(400).send(JSON.stringify(`BAD REQUEST: No team matches the name: ${teamName}`));
});





//returns list of objects with date,opposition name for each fixture - REFER TO STACK OVERFLOW PAGE!!!!!!!!!!!!!!!!
app.get("/fixtures", (req,resp) => {
    let fixtureList = [];

    //function for object destructuring/initialisation
    const subset = ( ({date , time, opposition}) => ({date ,time, opposition}));

    for(const fixture of fixtures){
        fixtureList.push(subset(fixture));
    }
    //set content-type and send
    resp.setHeader("content-type", "application/json");
    resp.status(200).send(JSON.stringify(fixtureList));
});






app.listen(8090);



