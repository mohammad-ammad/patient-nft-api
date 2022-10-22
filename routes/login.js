const router = require("express").Router();
const jwt = require("jsonwebtoken");

const bcrpyt = require("bcryptjs");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const isExist = await User.findOne({ wallet: req.body.wallet });
    if (!isExist) {
      const password_hash = await bcrpyt.hash(req.body.password, 10);
      const user = new User({
        wallet: req.body.wallet,
        name: req.body.name,
        email: req.body.email,
        country: req.body.country,
        address: req.body.address,
        gender: req.body.gender,
        phone: req.body.phone,
        password: password_hash,
      });
      const result = await user.save();
      if(result)
      {
        let token = jwt.sign(req.body.wallet, process.env.JWT_SECRET);
        res.status(200).json({ message: "Registered Successfully", token:token });
      }
    } else {
      res.status(401).json({ message: "User Already Exists" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const wallet = req.body.wallet;
    const _user = await User.findOne({ wallet: wallet });
    if (req.body.password) {
      if (_user) {
        let p_status = await bcrpyt.compare(req.body.password, _user.password);
        if (p_status) {
          let token = jwt.sign(wallet, process.env.JWT_SECRET);
          res
            .status(200)
            .cookie("token", token, {
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              httpOnly: true,
            })
            .json({
              message: "Login Successfully",
              token,
            });
        } else {
          res.status(401).json({ message: "Invalid Password!" });
        }
      } else {
        res.status(401).json({ message: "User not Exists!" });
      }
    } else {
      res.status(401).json({ message: "Please enter a valid password." });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/logout", (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({
        success: true,
        message: "logout",
      });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
