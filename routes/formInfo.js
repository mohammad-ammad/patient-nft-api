const router = require("express").Router();
const FormInfo = require("./../models/FormInfo");
const { isAuthenticated } = require("./../middlewares/authMiddleware");

router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const isExist = await FormInfo.findOne({ json_hash: req.body.json_hash });
    const formInfo = new FormInfo({
      wallet_address: req.body.wallet_address,
      json_hash: req.body.json_hash,
    });
    if (isExist) {
      res.status(401).json({ message: "Record Exist" });
    } else {
      await formInfo.save();
      res.status(200).json({ message: "Form Submit Successfully!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/get-all", isAuthenticated, async (req, res) => {
  try {
    const _record = await FormInfo.find();
    res.status(200).json(_record);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
