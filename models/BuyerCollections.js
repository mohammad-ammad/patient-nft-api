const mongoose = require("mongoose");

const BuyerCollectionSchema = new mongoose.Schema(
  {
    buyer_wallet: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    image_url:{
        type:String,
        required:true
    },
    pdf_url:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        default:0
    },
    tokenId:{
        type:Number,
        required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("BuyerCollections", BuyerCollectionSchema);
