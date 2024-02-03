/*


1. Testing http: https://www.youtube.com/watch?v=FKnzS_icp20
2. Mocking databases: https://www.youtube.com/watch?v=IDjF6-s1hGkf


- NOTE: I know it seems weird now, but let's worry about making our tests at the 
  end of the application.

*/

const request = require("supertest");
const app = require("../app");

describe("POST /users", () => {
	// A successful user creation

	test("Should return 400 when passwords don't match", async () => {
		const response = await request(app).post("/api/users").send({
			email: "knguyen44@ivytech.edu",
			password: "Pass_word123",
			"confirm-password": "Mismatched_password!",
			"first-name": "Kevin",
			"last-name": "Nguyen",
		});

		expect(response.statusCode).toBe(400);
		expect(response.body.errors["confirm-password"]).toBe(
			"Passwords must match!"
		);
	});

	test("Specifies json content header", async () => {
		const response = await request(app).post("/api/users").send({
			email: "knguyen44@ivytech.edu",
			password: "Pass_word123",
			"confirm-password": "Pass_word123",
			"first-name": "Kevin",
			"last-name": "Nguyen",
		});
		expect(
			response.headers["content-type"].toEqual(expect.stringContaining("json"))
		);
	});
});
