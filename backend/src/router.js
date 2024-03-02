const express = require("express");

const router = express.Router();

const { hashPassword, validateUserSchema } = require("./services/auth");

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Route to get users

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

// Route to get charge point

const chargePointControllers = require("./controllers/chargePointControllers");

router.get("/chargepoint", chargePointControllers.browse);

const bookControllers = require("./controllers/bookControllers");

router.post("/booking", bookControllers.booking);

/* ************************************************************************* */

const carControllers = require("./controllers/carControllers");

router.get("/users/car", authorize, carControllers.getCarsOfUser);

router.get("/car", carControllers.getCarsType);

router.get("/users/:id/car", carControllers.getAvailableCar);

router.post("/car", authorize, carControllers.createCar);

router.delete("/car", carControllers.deleteCar);

// Route to have reservations available

router.get("/bookAvailable", bookControllers.browse);
router.get("/station/:id", chargePointControllers.getOne);
// Route to get reservation

router.get("/users/:id/booking", bookControllers.getBookingUser);

router.delete(
  "/users/booking/:id",
  authorize,
  bookControllers.deleteReservation
);

router.post("/book/:id", bookControllers.getAllBookedDate);

module.exports = router;
