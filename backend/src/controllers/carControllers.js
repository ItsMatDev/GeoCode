const tables = require("../tables");

const createCar = async (req, res) => {
  const selectedCar = req.body;
  const userId = req.idUser;
  try {
    const insertId = await tables.car.create(selectedCar[0].id, userId);
    res.status(201).json({ insertId });
  } catch (err) {
    res.sendStatus(500);
  }
};

const deleteCar = async (req, res) => {
  const selectedCar = req.params.id;
  try {
    const deleteId = await tables.car.delete(selectedCar);
    res.status(201).json({ deleteId });
  } catch (err) {
    res.sendStatus(500);
  }
};

const getCarsOfUser = async (req, res) => {
  const userId = req.idUser;
  try {
    const cars = await tables.car.getCarByUserId(userId);
    res.status(201).json(cars);
  } catch (err) {
    res.sendStatus(500);
  }
};
const getCarsType = async (req, res) => {
  try {
    const cars = await tables.car.getAllCars();
    res.status(201).json(cars);
  } catch (err) {
    res.sendStatus(500);
  }
};

const getAvailableCar = async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  try {
    const cars = await tables.car.getAvailableCar(userId);
    res.status(201).json(cars);
  } catch (err) {
    res.sendStatus(500);
  }
};

module.exports = {
  createCar,
  deleteCar,
  getCarsOfUser,
  getCarsType,
  getAvailableCar,
};
