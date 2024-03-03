const express = require("express");

const router = express.Router();

const { hashPassword, validateUserSchema } = require("./middlewares/auth");

const userControllers = require("./controllers/userControllers");

const { authorize } = require("./middlewares/auth");
const loginValidation = require("./middlewares/loginValidation");

router.get("/users/me", authorize, userControllers.getCurrentUser);
router.get("/users/logout", userControllers.logout);
router.get("/connecteduserinfo", authorize, userControllers.read);
router.post("/users/login", loginValidation, userControllers.login);
router.post("/user", validateUserSchema, hashPassword, userControllers.add);
router.put("/users", authorize, userControllers.updateUser);
router.delete("/users/:id", userControllers.deleteUser);

const chargePointControllers = require("./controllers/chargePointControllers");

router.get("/chargepoint", chargePointControllers.browse);
router.get("/station/:id", chargePointControllers.getOne);

const carControllers = require("./controllers/carControllers");

router.get("/users/car", authorize, carControllers.getCarsOfUser);
router.get("/car", carControllers.getCarsType);
router.get("/users/:id/car", carControllers.getAvailableCar);
router.post("/car", authorize, carControllers.createCar);
router.delete("/car/:id", carControllers.deleteCar);

const bookControllers = require("./controllers/bookControllers");

router.get("/bookAvailable", bookControllers.browse);
router.get("/users/:id/booking", bookControllers.getBookingUser);
router.post("/booking", bookControllers.booking);
router.post("/book/:id", bookControllers.getAllBookedDate);
router.delete(
  "/users/booking/:id",
  authorize,
  bookControllers.deleteReservation
);

module.exports = router;
