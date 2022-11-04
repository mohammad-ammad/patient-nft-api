const router = require("express").Router();
const FormInfo = require("./../models/FormInfo");
const { isAuthenticated } = require("./../middlewares/authMiddleware");
const Counter = require('../models/Counter');
const fs = require('fs')

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

router.post("/file/:wallet", async (req, res) => {
  try {
    const obj = req.body;
    const wallet = req.params.wallet;
    const data = JSON.stringify(obj)
    const counter = await Counter.findOne({wallet:wallet});
    // res.status(200).json(counter)
    if(counter != null)
    {
      let num = counter.counter;
      await Counter.findOneAndUpdate({wallet:wallet},{
        counter:num+1
      })
      fs.writeFile(`${wallet}_${num+1}.json`, data, err => {
        if (err) {
          throw err
        }
        res.status(200).json({message:"Data save"});
      })
    }
    else 
    {
      const count = new Counter({
        wallet:wallet,
        counter:0
      })

      await count.save()
      fs.writeFile(`${wallet}_0.json`, data, err => {
        if (err) {
          throw err
        }
        res.status(200).json({message:"Data save"});
      })
    }
    
  } catch (error) {
    console.log(error.message)
  }
});

router.get("/file/:wallet/:count", async (req, res) => {
  try {
    const count = req.params.count;
    const wallet = req.params.wallet;

    fs.readFile(`${wallet}_${count}.json`, 'utf-8', (err, data) => {
      if (err) {
        throw err
      }
    
      // parse JSON object
      const _file = JSON.parse(data.toString())

      res.status(200).json(_file)
    })
  } catch (error) {
    res.status(500).json(error.message)
  }
});

router.get("/count/:wallet", async (req, res) => {
  try {
    const wallet = req.params.wallet;
    const counter = await Counter.findOne({wallet:wallet.toLowerCase()});
    res.status(200).json(counter)
  } catch (error) {
    res.status(500).json(error.message)
  }
});

module.exports = router;
