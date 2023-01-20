// import express + call constructor
const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

// serve static html directly to client (middleware)
app.use(express.static("client"));

// body parser
app.use(express.json());

// get teams from json file
const teamFileName = path.join(__dirname, "teams.json");
const fixtureFileName = path.join(__dirname, "fixtures.json");
const teams = require(teamFileName);
const fixtures = require(fixtureFileName);

const validTeamFormat = {
                        name: { regex: /^[A-Z].*-[A-Z]$/, msg: "College name is invalid - must be of form Collegename-X" },
                        forwards: { regex: /^\d{1,2}$/, msg: "Rating must be an integer 0-100" },
                        midfield: { regex: /^\d{1,2}$/, msg: "Rating must be an integer 0-100" },
                        defence: { regex: /^\d{1,2}$/, msg: "Rating must be an integer 0-100" }
};

const validFixtureFormat = {
                            date: { regex: /^\d{2}\/\d{2}\/\d{4}$/, msg: "Date must be in form DD/MM/YYYY" },
                            time: { regex: /^\d{2}:\d{2}$/, msg: "Time must be in form HH:MM" },
                            competition: { regex: /.+/, msg: "Competition entered is invalid" },
                            score: { regex: /^\d+-\d+$/, msg: "Score must be in form x-y" }
};

// get request - returns list of team names
app.get("/teams", (req, resp) => {
    const teamList = [];
    for (const t of teams) {
        teamList.push(t.name);
    }

    resp.status(200).json(teamList);
});

// returns detail of an individual team
app.get("/teaminfo", (req, resp) => {
    const teamName = req.query.name;

    for (const t of teams) {
        // if match found - send back team + return
        if (t.name === teamName) {
            resp.status(200).json(t);
            return;
        }
    }
    // no match found - send 400 BAD request
    resp.status(400).json(`BAD REQUEST: No team matches the name: ${teamName}`);
});

// returns list of objects with date,opposition name for each fixture
app.get("/fixtures", (req, resp) => {
    const fixtureList = [];

    // function for object destructuring/initialisation
    const subset = ({ date, time, opposition }) => ({ date, time, opposition });

    for (const fixture of fixtures) {
        fixtureList.push(subset(fixture));
    }

    resp.status(200).json(fixtureList);
});

// returns details of an individual fixture
app.get("/fixtureinfo", (req, resp) => {
    const date = req.query.date;
    const oppo = req.query.opposition;

    for (const f of fixtures) {
        if (f.date === date & f.opposition === oppo) {
            resp.status(200).json(f);
            return;
        }
    }
    // no match found => BAD request
    resp.status(400).json(`BAD request no fixtures match date: ${date}, opposition: ${oppo}`);
});

// add a new team to json file - teams.json
app.post("/addteam", (req, resp) => {
    // server-side validation
    const body = req.body;
    const errors = validatePostData(validTeamFormat, body);
    if (errors.length === 0) {
        // if valid - create team object from request body
        const newTeam = {
            name: body.name,
            ratings: { forwards: body.forwards, midfield: body.midfield, defence: body.defence },
            playstyle: body.playstyle
        };

        teams.push(newTeam);
        // persistent => append to json file (synchronous)
        fs.writeFileSync(teamFileName, JSON.stringify(teams));
        resp.status(200).json(teams);
    } else {
        // bad request - send back errors
        resp.status(400).json(errors);
    }
});

app.post("/addfixture", (req, resp) => {
    // server-side validation
    const body = req.body;
    const errors = validatePostData(validFixtureFormat, body);
    // must also check that opposition team is held in teams.json
    const teamNames = teams.map(team => team.name);
    if (!teamNames.includes(body.opposition)) {
        errors.push({ opposition: "not a valid pre-existing team" });
    }

    if (errors.length === 0) {
        // if valid - create fixture object
        const newFixture = {
            date: body.date,
            time: body.time,
            competition: body.competition,
            opposition: body.opposition,
            goalsFor: body.score.split("-")[0],
            goalsAgainst: body.score.split("-")[1],
            report: body.report
        };

        fixtures.push(newFixture);
        // write to json file
        fs.writeFileSync(fixtureFileName, JSON.stringify(fixtures));
        resp.status(200).json(fixtures);
    } else {
        // bad request - send back errors
        resp.status(400).json(errors);
    }
});

function validatePostData (format, reqBody) {
    const errors = [];
    // compare body data to regex formats defined in format
    for (const [arg, formatObj] of Object.entries(format)) {
        // if no match - add argument and associated error message
        if (!formatObj.regex.test(reqBody[arg])) {
            errors.push({ [arg]: formatObj.msg });
        }
    }
    return errors;
}

module.exports = app;
