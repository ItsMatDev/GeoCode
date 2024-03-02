const { app, request } = require("./setup");

describe("Testing userControllers routes", () => {
  let userId;

  it("POST /user should create a new user", async () => {
    const newUser = {
      lastName: "toto",
      firstName: "John",
      email: "toto@example.com",
      gender: "Male",
      birthdate: "1990-01-01",
      city: "New York",
      zipcode: "10001",
      password: "password123",
    };

    const res = await request(app).post("/api/user").send(newUser);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("insertId");
    expect(res.body.insertId).toBeGreaterThan(0);

    userId = res.body.insertId;
  });

  it("DELETE /user/:id should delete the user created in the previous test", async () => {
    expect(userId).toBeDefined();

    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");
  });
});
