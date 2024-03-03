const jwt = require("jsonwebtoken");
const { app, request } = require("./setup");

describe("Testing user routes", () => {
  let userId;

  it("POST /user should create a new user", async () => {
    const newUser = {
      lastName: "Doe",
      firstName: "John",
      email: "toto16@example.com",
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

  it("POST /user with no password should return an error 400", async () => {
    const newUser = {
      lastName: "Doe",
      firstName: "John",
      email: "toto16@example.com",
      gender: "Male",
      birthdate: "1990-01-01",
      city: "New York",
      zipcode: "10001",
    };

    const res = await request(app).post("/api/user").send(newUser);
    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ errors: ['"password" is required'] });
  });

  it("PUT /users should update the user created in the first test", async () => {
    expect(userId).toBeDefined();

    const updatedUserData = {
      lastName: "Doe",
      firstName: "Jane",
      email: "tata@example.com",
      gender: "Female",
      birthdate: "1996-01-01",
      city: "Lille",
      zipcode: "159000",
    };

    const user = { id: userId, status: "user" };
    const secret = process.env.JWT_AUTH_SECRET;
    const expiresIn = "1h";
    const accessToken = jwt.sign(user, secret, { expiresIn });

    const res = await request(app)
      .put(`/api/users`)
      .set("Cookie", [`access_token=${accessToken}`])
      .send(updatedUserData);

    expect(res.statusCode).toEqual(204);

    expect(res.body).toEqual({});
  });

  it("GET /users/me should return details of the current user", async () => {
    const user = { id: userId, status: "user" };
    const secret = process.env.JWT_AUTH_SECRET;
    const expiresIn = "1h";
    const accessToken = jwt.sign(user, secret, { expiresIn });

    const res = await request(app)
      .get(`/api/users/me`)
      .set("Cookie", [`access_token=${accessToken}`]);

    expect(res.statusCode).toEqual(200);

    expect(res.body.id).toEqual(userId);
    expect(res.body.firstname).toEqual("Jane");
    expect(res.body.email).toEqual("tata@example.com");
    expect(res.body.status).toEqual("user");
  });

  it("GET /users/me with no token should return 401", async () => {
    const res = await request(app).get(`/api/users/me`);

    expect(res.statusCode).toEqual(401);
  });

  it("POST /user/login should retrieve the user created in the first test", async () => {
    const loginData = {
      email: "tata@example.com",
      password: "password123",
    };

    const res = await request(app).post("/api/users/login").send(loginData);

    expect(res.statusCode).toEqual(200);
    expect(res.body.firstname).toEqual("Jane");
    expect(res.body.email).toEqual("tata@example.com");
    expect(res.body.status).toEqual("user");
  });

  it("POST /user/login with wrong password should return 400", async () => {
    const loginData = {
      email: "tata@example.com",
      password: "wrongPassword",
    };

    const res = await request(app).post("/api/users/login").send(loginData);

    expect(res.statusCode).toEqual(400);
  });

  it("DELETE /users/:id should delete the user created in the previous test", async () => {
    expect(userId).toBeDefined();

    const res = await request(app).delete(`/api/users/${userId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "User deleted successfully");
  });

  it("DELETE /users/:id should not found this userId and return a 404 not found", async () => {
    const res = await request(app).delete(`/api/users/1000000`);
    expect(res.statusCode).toEqual(404);
  });

  it("GET /users/me shoud now return a 404 error because user is deleted", async () => {
    const user = { id: userId, status: "user" };
    const secret = process.env.JWT_AUTH_SECRET;
    const expiresIn = "1h";
    const accessToken = jwt.sign(user, secret, { expiresIn });

    const res = await request(app)
      .get(`/api/users/me`)
      .set("Cookie", [`access_token=${accessToken}`]);

    expect(res.statusCode).toEqual(404);
  });
});
