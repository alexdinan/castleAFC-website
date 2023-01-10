

"use strict";

const endPointRoot = "http://127.0.0.1:8090/";

//add event listener to actions buttons
const getTeamsBtn = document.getElementById("getTeams");
getTeamsBtn.addEventListener('click' , listTeams);

const getFixturesBtn = document.getElementById("getFixtures");
getFixturesBtn.addEventListener('click', listFixtures);



async function listTeams(){
    try{
        //send get requets to server and parse response
        const teamNames = JSON.parse(await (await fetch(endPointRoot + "teams")).text());

        //add html list element for each team
        let teamList = "";
        for (const team of teamNames){
            teamList += `<li class="team-list-item list-group-item"><span class="text-dark">${team}</span></li>`;
        }
        //add to DOM
        document.getElementById("teamSection").className += " pt-5 pb-5";
        document.getElementById("teamHeading").innerHTML = "Teams:";
        document.getElementById("teamSmallText").innerHTML = "click items below to load team details!";
        document.getElementById("teamNameList").innerHTML = teamList;
       
        //add event listeners
        for(const li of document.querySelectorAll(".team-list-item")){
            li.addEventListener("click", (e) => getTeamDetails(e.target.textContent));
        }
    }catch(error){
        //add 404 handling
        alert(error);
    }
}



async function getTeamDetails(teamName){
    try{
        //send get request + parse response
        const details = JSON.parse(await (await fetch(endPointRoot + `teaminfo?name=${teamName}`)).text());


        //add team name to title box
        document.getElementById("teamNameBox").innerHTML = `<h5 class="text-center display-5 py-3">${details.name}</h5>`;

        //add ratings to Dom
        let ratingsHtml = "";
        for(const [key,val] of Object.entries(details.ratings)){
            ratingsHtml += `<div class="col"><h4>${key}</h4><h4 class="display-4 text-success">${val}</h4></div>`;
        }
        document.getElementById("teamRatingsRow").innerHTML = ratingsHtml;

        //add playstyle description
        document.getElementById("styleCont").innerHTML = `<h5 class="px-3">Playstyle Description:</h5><p class="px-3 py-2">${details.playstyle}</p>`;

        //add appropriate border
        document.querySelector(".colContainer").className += " border";

    }catch(error){
        alert(error);
    }
}



async function listFixtures(){
    try{
        //send get request to server and parse response
        const fixtureList = JSON.parse(await (await fetch(endPointRoot + "fixtures")).text());

        //add title and padding etc...
        document.getElementById("fixtureTableSection").className += " pt-5 pb-5 bg-grey2";
        document.getElementById("fixtureHeading").innerHTML = "Fixtures:";

        
        //create thead (table heading row)
        let thead = "<tr>";
        for(const key of Object.keys(fixtureList[0])){
            thead += `<th class="text-center" scope="col">${key}</th>`;
        }
        document.getElementById("fixtureThead").innerHTML = thead + "</tr>";


        //create table body
        let body = "";
        for(const fixture of fixtureList){
            body += `<tr class="fixTableRow">`;
            for(const [key,value] of Object.entries(fixture)){
                body += `<td class="${key} text-center">${value}</td>`;
            }
            body += "</tr>";
        }
        document.getElementById("fixtureTableBody").innerHTML = body;


        //add event listeners to table rows
        for(const tableRow of document.querySelectorAll(".fixTableRow")){
            tableRow.addEventListener("click", (e) => {
                //get date + opposition from event target
                const date = e.target.parentNode.querySelector(".date").textContent;
                const oppo = e.target.parentNode.querySelector(".opposition").textContent;
                getFixtureDetails(date,oppo);
            });
        }

    }catch(error){
        alert(error);
    }
}





async function getFixtureDetails(date, oppo){
    //send get request + parse response - fixture details
    const f = JSON.parse(await (await fetch(`${endPointRoot}fixtureinfo?date=${date}&opposition=${oppo}`)).text());

    //create top row with date time and competition
    let timeRow = document.getElementById("timeRow");
    timeRow.innerHTML = `<div class="p-3 col">${f.date}</div><div class="p-3 col">${f.competition}</div><div class="p-3 col">${f.time}</div>`;
   

    //create middle row with teams and score
    let scoreRow = document.getElementById("scoreRow");
    scoreRow.className += " bg-white";
    //add color to score - depending on w/d/l
    let color = "";
    if (f.goalsFor > f.goalsAgainst){
        color="text-success";
    }else if(f.goalsFor === f.goalsAgainst){
        color="text-warning";
    }else{
        color="text-danger";
    }

    scoreRow.innerHTML = `<div class="p-2 col display-6 my-auto">Castle A</div>
                        <div class="score p-2 col display-4 ${color}">${f.goalsFor} - ${f.goalsAgainst}</div>
                        <a href="#getAction" class="oppo p-2 col display-6 my-auto">${f.opposition}</a>`;

    //create match report row
    let reportRow = document.getElementById("reportRow");
    reportRow.innerHTML = f.report;
    reportRow.className += " bg-white";

    //add event listener for opposition team button!
    scoreRow.querySelector(".oppo").addEventListener("click", (e) => {
        getTeamDetails(e.target.textContent);
        listTeams();
    });
}




async function addTeam(){
    const teamForm = document.getElementById("teamForm");
    teamForm.addEventListener("submit", async function(e){
        //single-page app => prevent form submission
        e.preventDefault();
        
        //automatic browser form validation
        const valid = teamForm.checkValidity();
        teamForm.classList.add("was-validated");

        if(valid){
            const formContent = Object.fromEntries(new FormData(teamForm));
            //send POST request to server
            const resp = await fetch(endPointRoot + "addteam", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(formContent)
            });
            //list teams, new team details + scroll into view
            listTeams();
            getTeamDetails(formContent.name);
            document.getElementById("getAction").scrollIntoView();
            //reset form
            teamForm.reset();
            teamForm.classList.remove("was-validated");
        }
    });
}



async function addFixture(){
    const fixtureForm = document.getElementById("fixtureForm");
    fixtureForm.addEventListener("submit", async function(e){
        //single-page app => prevent form submission
        e.preventDefault();
        
        //automatic browser form validation
        const valid = fixtureForm.checkValidity();
        fixtureForm.classList.add("was-validated");

        if(valid){
            const formContent = Object.fromEntries(new FormData(fixtureForm))
            console.log(formContent);
            //send POST request to server
            const resp = await fetch(endPointRoot + "addfixture", {
                method: "POST",
                headers: {"content-type":"application/json"},
                body: JSON.stringify(formContent)
            });
            //reset form
            fixtureForm.reset();
            fixtureForm.classList.remove("was-validated");  
        }
    });
}




async function teamSelect(){
    const teamSelect = document.getElementById("teamSelector");
    teamSelect.addEventListener("click", async function(){
        const teams = JSON.parse(await (await fetch(endPointRoot + "teams")).text());

        teamSelect.innerHTML = "<option selected>...</option>";
        for(const team of teams){
            teamSelect.innerHTML += `<option value="${team}">${team}</option>`;
        }
    });
}


addTeam();
addFixture();
teamSelect();