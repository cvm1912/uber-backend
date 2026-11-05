const { Router } = require("express");
// const { pingController } = require("../controllers/ping-controller");

const userRouter = Router();

// route to get past booking history of the user
// provide feedback for the driver after the ride is completed

userRouter.get("/history", getBookingHistory);
userRouter.post("/feedback", provideFeedback);

module.exports = userRouter;
