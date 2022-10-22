const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema(
  {
    wallet: {
        type: String,
        required: true,
    },
    counter: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Counter", CounterSchema);
