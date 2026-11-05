const { Router } = require("express");
// const { pingController } = require("../controllers/ping-controller");

const driverRouter = Router();


// route to get updated driver location -- continuously sending location to the server
driverRouter.post("/location", updateLocation);

// route to get previous booking history of the driver
driverRouter.get("/history", getBookingHistory);

module.exports = driverRouter;
