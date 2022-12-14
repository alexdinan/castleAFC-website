

"use strict"


//import express + call constructor
const express = require("express");
const app = express();
const fs = require("fs");


//serve static html directly to client (middleware)
app.use(express.static("client"));

//body parser
app.use(express.json());

//get teams from json file
let teams = require("./teams.json");
let fixtures = require("./fixtures.json");


const validTeamFormat = {"name": {"regex": /[A-Z].*-[A-Z]/, "msg":"College name is invalid - must be of form Collegename-X"},
                        "Forwards": {"regex": /^\d{1,2}$/, "msg":"Rating must be an integer 0-100"},
                        "Midfield": {"regex": /^\d{1,2}$/, "msg":"Rating must be an integer 0-100"},
                        "Defence": {"regex": /^\d{1,2}$/, "msg":"Rating must be an integer 0-100"}
};

const validFixtureFormat = {"date": {"regex": /^\d{2}\/\d{2}\/\d{4}$/, "msg":"Date must be in form DD/MM/YYYY"},
                            "time": {"regex": /^\d{2}:\d{2}/, "msg":"Time must be in form HH:MM"},
                            "competition": {"regex": /.+/, "msg":"Competition entered is invalid"},
                            "goalsFor": {"regex": /\d/, "msg":"Enter a positive integer"},
                            "goalsAgainst": {"regex": /\d/, "msg":"enter a positive integer"},
};
    


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



app.post("/addteam", (req,resp) => {
    
    //server-side validation
    const body = req.body;
    const errors = validatePostData(validTeamFormat, body);
    if(errors === []){
        // if valid - create team object from request body
        const newTeam = {"name": body.name, 
                        "ratings": {"Forwards":body.Forwards,"Midfield":body.Midfield,"Defence":body.Defence},
                        "playstyle": body.playstyle};

        teams.push(newTeam);
        //persistent => append to json file (synchronous)
        fs.writeFileSync("./teams.json", JSON.stringify(teams));
        resp.status(200).json(teams);
    }else{
        //bad request - send back errors
        resp.status(400).json(errors);
    }
});



app.post("/addfixture", (req,resp) => {

    //server-side validation
    const body = req.body;
    const errors = validatePostData(validFixtureFormat, body);
    if(errors === []){
        //if valid - create fixture object
        const newFixture = {"date": body.date, "time": body.time, "competition": body.competition,
                            "opposition": body.opposition,
                            "goalsFor": body.score.split("-")[0], "goalsAgainst": body.score.split("-")[1],
                            "report": body.report};
    
        fixtures.push(newFixture);
        //write to json file
        fs.writeFileSync("./fixtures.json", JSON.stringify(fixtures));
        resp.status(200).json(fixtures);
    }else{
        //bad request - send back errors
        resp.status(400).json(errors);
    }
});




function validatePostData(format, reqBody){
    let errors = [];
    for(const [arg,formatObj] of Object.entries(format)){
        if(!formatObj.regex.test(reqBody[arg])){
            errors.push({[arg] : formatObj.msg});
        }
    }
    return errors
}




app.listen(8090);






