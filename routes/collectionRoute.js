const router = require("express").Router();

const Collections = require('../models/Collections');
const BuyerCollections = require('../models/BuyerCollections');

router.post("/create", async (req, res) => {
    try {
        const {wallet,name, quantity, image_url, pdf_url, tokenId} = req.body;

        if(!wallet || !name || !quantity || !image_url || !pdf_url || !tokenId)
        {
            throw Error("All fields are required")
        }

        const resp = new Collections({
            wallet,
            name,
            quantity,
            image_url,
            pdf_url,
            tokenId
        })

        await resp.save();
        
        res.status(200).json({message:"Data minted...."})
        
    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.get("/unlisted/:address", async (req, res) => {
    try {
        const unlisted = await Collections.find({price:0, wallet:req.params.address.toLocaleLowerCase()})
        res.status(200).json(unlisted)
    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.put("/list/:id", async (req, res) => {
    try {
        const _id = req.params.id;
        await Collections.findByIdAndUpdate({_id},{
            price:req.body.price
        })

        res.status(200).json({message:"NFT Listed Successfully"})

    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.get("/listed", async (req, res) => {
    try {
        const listed = await Collections.find({price:{$ne:0}})
        res.status(200).json(listed)
    } catch (error) {
        res.status(500).json(error.message)
    }
});

router.post("/buy", async (req, res) => {
    try {
        
        const {wallet,name, quantity, image_url, pdf_url, tokenId} = req.body;

        if(!wallet || !name || !quantity || !image_url || !pdf_url || !tokenId)
        {
            throw Error("All fields are required")
        }
        const remaining = await Collections.findById({_id:req.body.id});
        if(remaining.quantity > 0)
        {
            await Collections.findByIdAndUpdate({_id:req.body.id},{
                quantity:remaining.quantity - quantity
            })

            const resp = new Collections({
                wallet,
                name,
                quantity,
                image_url,
                pdf_url,
                tokenId
            })

            resp.save()

            res.status(200).json({message:"Buy successfully"})
        }
    } catch (error) {
        res.status(500).json(error.message)
    }
});

module.exports = router;