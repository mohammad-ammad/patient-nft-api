const mongoose = require("mongoose");

const FormInfoSchema = new mongoose.Schema(
  {
    wallet: {
      type: String,
      required: true,
    },
    json_hash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("FormInfo", FormInfoSchema);
