var express = require("express");
var router = express.Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin, isSignedIn } = require("../controllers/auth"); //importing controller syntax

//signup validation
router.post(
  "/signup",
  [
    check("name", "name should be atleast 3 characters").isLength({ min: 3 }),
    check("email", "email is required").isEmail(),
    check("password", "passoword should be atleast 3 characters").isLength({
      min: 3,
    }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "email is required").isEmail(),
    check("password", "passoword is required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", signout); //get grabs something from database
/*
router.get("/testroute", isSignedIn, (req, res) => {
  res.json(req.auth);
}); //testing route
*/
module.exports = router;
