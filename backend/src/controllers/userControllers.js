const argon = require("argon2");
const jwt = require("jsonwebtoken");
const tables = require("../tables");

const add = async (req, res) => {
  const user = req.body;
  try {
    const insertId = await tables.person.create(user);
    res.status(201).json(insertId);
  } catch (err) {
    res.sendStatus(500);
  }
};

const read = async (req, res) => {
  try {
    const userId = req.idUser;
    const connectedUser = await tables.person.getConnectedUserById(userId);
    if (connectedUser == null) {
      res.sendStatus(404);
    } else {
      res.json(connectedUser);
    }
  } catch (err) {
    res.sendStatus(500);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const [user] = await tables.person.getById(req.idUser);
    if (user) res.status(200).json(user);
    else res.sendStatus(404);
  } catch (err) {
    res.sendStatus(500);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await tables.person.getByEmail(email);
    if (!user) return res.status(400).json("Invalid email");
    if (await argon.verify(user.password, password)) {
      const token = jwt.sign(
        { id: user.id, status: user.status },
        process.env.JWT_AUTH_SECRET,
        { expiresIn: "1h" }
      );
      res.cookie("access_token", token, {
        httpOnly: true,
        secure: false,
      });

      res.status(200).json({
        firstname: user.firstname,
        email,
        id: user.id,
        status: user.status,
      });
    } else res.status(400).json("invalid password");
  } catch (err) {
    res.sendStatus(500);
  }
  return null;
};

const logout = ({ res }) => {
  res.clearCookie("access_token").sendStatus(200);
};

const updateUser = async (req, res) => {
  try {
    const user = req.body;
    const userId = req.idUser;
    const updatedUser = await tables.person.updateUser(user, userId);
    res.status(204).json(updatedUser);
  } catch (err) {
    res.sendStatus(500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const rows = await tables.person.deleteOne(req.params.id);
    if (rows.affectedRows > 0)
      res.status(200).send({ message: "User deleted successfully" });
    else res.sendStatus(404);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = {
  add,
  read,
  getCurrentUser,
  login,
  logout,
  updateUser,
  deleteUser,
};
