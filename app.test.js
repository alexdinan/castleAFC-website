


const request = require("supertest");
const app = require("./app");


//test the teams entity
describe("Test the team entity", () => {

    //testing the list GET request for team entity
    test("GET /teams returns 200 and has json content-type", async () => {
        const res = await request(app).get("/teams");
        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });

    test("GET /teams returns array containing team names", async () => {
        const res = await request(app).get("/teams");
        expect(res.body).toBeInstanceOf(Array);
    });

    //testing the details GET request for team entity
    test("GET /teaminfo returns 200 for valid teamName and has json content type", async () => {
        const validTeamName = "Collingwood-A";
        const res = await request(app).get(`/teaminfo?name=${validTeamName}`);
        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });

    test("GET /teaminfo returns object with expected properties for valid teamName", async () => {
        const validTeamName = "Collingwood-A";
        const res = await request(app).get(`/teaminfo?name=${validTeamName}`);

        for(let property of ["name","ratings","playstyle"]){
            expect(res.body).toHaveProperty(property);
        }
    });

    test("GET /teaminfo returns 400 - bad request for invalid input", async () => {
        const invalidName = "rand";
        const res = await request(app).get(`/teaminfo?name=${invalidName}`);
        expect(res.statusCode).toEqual(400);
    });

    test("GET /teaminfo gives error message containing the invalid name supplied", async () => {
        const invalidName = "rand";
        const res = await request(app).get(`/teaminfo?name=${invalidName}`);
        expect(res.body).toEqual(expect.stringContaining(invalidName));
    });

    //testing the add POST request for team entity
    test("POST /addteam returns 200 + json for valid input", async () => {
        const validParams = {"name": "Stephenson-A", "forwards": "50", "midfield": "48", "defence": "57", "playstyle": ""};
        const res = await request(app).post("/addteam").send(validParams);
        
        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });

    test("POST /addteam returns 400 for invalid input", async () => {
        const invalidParams = {"name":"","forwards":"","midfield":"","defence":"","playstyle":""};
        const res = await request(app).post("/addteam").send(invalidParams);
        expect(res.statusCode).toEqual(400);
    });

    test("POST /addteam returns array of objects with helpful error messages for each invalid input", async () => {
        const invalidParams = {"name":"","forwards":"","midfield":"","defence":"","playstyle":""};
        const res = await request(app).post("/addteam").send(invalidParams);

        for(let errorObject of res.body){
            expect(errorObject).toBeInstanceOf(Object);
        }
    });

});

//test the fixtures entity
describe("Test the fixture entity", () => {

    test("GET /fixtures returns 200 and json content-type", async () => {
        const res = await request(app).get("/fixtures");
        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });

    test("GET /fixtures returns array of fxture objects", async () => {
        const coreFixture = {"date":"15/10/2022","time":"13:15","opposition":"Hatfield-A"};
        const res = await request(app).get("/fixtures");
        expect(res.body).toEqual(expect.arrayContaining([coreFixture]))
    });

    test("GET /fixtureinfo returns 200 and json content-type for valid input", async () => {
        const validFixture = {date:"15/10/2022" , opposition:"Hatfield-A"};
        const res = await request(app).get(`/fixtureinfo?date=${validFixture.date}&opposition=${validFixture.opposition}`);

        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });

    test("GET /fixtureinfo returns object containing appropriate data for valid input", async () => {
        const validFixture = {date:"15/10/2022" , opposition:"Hatfield-A"};
        const res = await request(app).get(`/fixtureinfo?date=${validFixture.date}&opposition=${validFixture.opposition}`);

        expect(res.body).toEqual(expect.objectContaining(validFixture));
    });

    test("GET /fixtureinfo returns 400 for invalid input", async () => {
        const invalid = {date:"", opposition:""};
        const res = await request(app).get(`/fixtureinfo?date=${invalid.date}&opposition=${invalid.opposition}`);
        expect(res.statusCode).toEqual(400);
    });

    test("GET /fixture info returns error message containing invalid info supplied", async () => {
        const invalid = {date:"", opposition:""};
        const res = await request(app).get(`/fixtureinfo?date=${invalid.date}&opposition=${invalid.opposition}`);
        expect(res.body).toEqual(expect.stringContaining(`${invalid.date}${invalid.opposition}`));
    });

    //testing the POST request to add new fixtures
    test("POST /addfixture returns 200 + json content-type for valid input", async () => {
        const validFixture = {date:"19/06/2023", time:"20:15", score:"5-0", competition:"Premier League", opposition:"Collingwood-A", report:""};
        const res = await request(app).post("/addfixture").send(validFixture);

        expect(res.statusCode).toEqual(200);
        expect(res.headers["content-type"]).toEqual("application/json; charset=utf-8");
    });

    test("POST /addfixture returns 400 for invalid input", async () => {
        const invalid = {date:"", time:"", score:"", competition:"", opposition:"", report:""};
        const res = await request(app).post("/addfixture").send(invalid);
        expect(res.statusCode).toEqual(400);
    });
    
    test("POST /addfixture returns array of objects with helpful error messages for each invalid input", async () => {
        const invalid = {date:"", time:"", score:"", competition:"", opposition:"", report:""};
        const res = await request(app).post("/addfixture").send(invalid);

        for(let errorObj of res.body){
            expect(errorObj).toBeInstanceOf(Object);
        }
    });
});