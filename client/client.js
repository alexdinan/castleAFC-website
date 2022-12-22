

"use strict";

const endPointRoot = "http://127.0.0.1:8090/";

//add event listener to actions buttons
const getTeamsBtn = document.getElementById("getTeams");
getTeamsBtn.addEventListener('click' , listTeams);




async function listTeams(){
    try{
        //send get requets to server and parse response
        const teamNames = JSON.parse(await (await fetch(endPointRoot + "teams")).text());

        //add html list element for each team
        let teamList = "";
        for (const team of teamNames){
            teamList += `<li class="team-list-item list-group-item"><span class="text-danger">${team}</span></li>`;
        }
        //add to DOM
        document.getElementById("teamHeading").innerHTML = "Teams:";
        document.getElementById("teamNameList").innerHTML = teamList;
       
        //add event listeners
        for(const li of document.querySelectorAll(".team-list-item")){
            li.addEventListener("click", (event) => getTeamDetails(event.target.textContent));
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
        

    }catch(error){
        alert(error);
    }
}