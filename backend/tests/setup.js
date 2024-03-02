/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */

// Load environment variables from .env file
require("dotenv").config();

const request = require("supertest");

const app = require("../src/app");
const tables = require("../src/tables");
const database = require("../database/client");

let connection;

beforeAll(async () => {
  connection = await database.getConnection();
});

afterEach(() => {
  connection.release();
});

afterAll((done) => {
  database.end().then(done);
});

module.exports = { app, database, request, tables };
