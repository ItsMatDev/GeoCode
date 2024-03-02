const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    super({ table: "person" });
  }

  async create(person) {
    try {
      await this.database.query("START TRANSACTION");

      const [rows] = await this.database.query(
        `INSERT INTO 
        ${this.table} (lastName, firstName, email, gender, birthdate, city, zipcode, password)
       VALUES (?,?,?,?,?,?,?,?);`,
        [
          person.lastName,
          person.firstName,
          person.email,
          person.gender,
          person.birthdate,
          person.city,
          person.zipcode,
          person.hashedPassword,
        ]
      );

      const userId = rows.insertId;
      await this.database.query("INSERT INTO user (user_id) VALUES (?)", [
        userId,
      ]);
      await this.database.query("COMMIT");
      return rows;
    } catch (error) {
      await this.database.query("ROLLBACK");
      return console.error(error);
    }
  }

  async getByEmail(email) {
    const [data] = await this.database.query(
      "SELECT * FROM person WHERE email = ?",
      [email]
    );
    return data;
  }

  async getById(id) {
    const [user] = await this.database.query(
      "SELECT id, firstname, email, status FROM person WHERE id = ?",
      [id]
    );
    return user;
  }

  async getConnectedUserById(userId) {
    const [rows] = await this.database.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [userId]
    );

    return rows[0];
  }

  async updateUser(user, userId) {
    const result = await this.database.query(
      `UPDATE ${this.table}
      SET
      lastname = ?,
      firstname = ?,
      email = ?,
      gender = ?,
      birthdate = ?,
      city = ?,
      zipcode = ?
       WHERE id= ? `,
      [
        user.lastName,
        user.firstName,
        user.email,
        user.gender,
        user.birthdate,
        user.city,
        user.zipcode,
        userId,
      ]
    );
    return result;
  }

  async deleteOne(id) {
    const [data] = await this.database.query(
      "DELETE FROM person WHERE id = ?",
      [id]
    );
    return data;
  }
}

module.exports = UserManager;
