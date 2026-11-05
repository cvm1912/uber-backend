const { Router } = require("express");
// const { pingController } = require("../controllers/ping-controller");

const bookingRouter = Router();


// create booking route
// confirm booking route

bookingRouter.post("/create", createBooking);
bookingRouter.post("/confirm", confirmBooking);


module.exports = bookingRouter;
