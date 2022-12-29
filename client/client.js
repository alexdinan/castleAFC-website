

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

        //add title + image to header
        const header = document.getElementById("cardHeader");
        header.innerHTML=`<h1 class="card-title mt-3 mb-3 mx-auto my-auto">${details.name}</h1>`;

        //add playstyle information
        let body = "<hr>";
        for(const [key,value] of Object.entries(details.playStyle)){
            body += `<div class="d-flex flex-row"><h6>${key}:    <span class="text-primary">${value}</span></div><hr>`;
        }
        document.getElementById("cardBody").innerHTML = body;


    }catch(error){
        alert(error);
    }
}



async function listFixtures(){
    try{
        //send get request to server and parse response
        const fixtureList = JSON.parse(await (await fetch(endPointRoot + "fixtures")).text());

        //add title and padding etc...
        document.getElementById("fixtureSection").className += " pt-5 pb-5 bg-grey2";
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
    //send get request + parse response
    const details = JSON.parse(await (await fetch(`${endPointRoot}fixtureinfo?date=${date}&opposition=${oppo}`)).text());
    
}