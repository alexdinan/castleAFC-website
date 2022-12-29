

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

    resp.status(200).json(teamList);
});




//returns detail of an individual team
app.get("/teaminfo", (req,resp) => {
    const teamName = req.query.name;

    for(const t of teams){
        //if match found - send back team + return
        if (t.name === teamName){
            resp.status(200).json(t);
            return
        }
    }
    //no match found - send 400 BAD request
    resp.status(400).json(`BAD REQUEST: No team matches the name: ${teamName}`);
});





//returns list of objects with date,opposition name for each fixture - REFER TO STACK OVERFLOW PAGE!!!!!!!!!!!!!!!!
app.get("/fixtures", (req,resp) => {
    let fixtureList = [];

    //function for object destructuring/initialisation
    const subset = ( ({date, time, opposition}) => ({date, time, opposition}));

    for(const fixture of fixtures){
        fixtureList.push(subset(fixture));
    }
    
    resp.status(200).json(fixtureList);
});




//returns details of an individual fixture
app.get("/fixtureinfo", (req,resp) => {
    const date = req.query.date;
    const oppo = req.query.opposition;

    for(const f of fixtures){
        if( f.date === date & f.opposition === oppo){
            resp.status(200).json(f);
        }
    }
    //no match found => BAD request
    resp.status(400).json(`BAD request no fixtures match date: ${date}, opposition: ${oppo}`);
});



app.listen(8090);



