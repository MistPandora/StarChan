const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const uniqid = require('uniqid');

const verifyTokenValidity = require('../middlewares/verifyTokenValidity');

router.post('/', verifyTokenValidity, async (req, res) => {
    try {
        const extension = req.files.image.mimetype.replace('image/', '');
        const photoPath = `./tmp/${uniqid()}.${extension}`;
        const resultMove = await req.files.image.mv(photoPath);

        if (!resultMove) {
            console.log("coucou");
            const resultCloudinary = await cloudinary.uploader.upload(photoPath, { folder: `StarChan/${Object.keys(req.query)}` }); // "gallery", "forum" or "profile"
            fs.unlinkSync(photoPath);
            res.json({ result: true, url: resultCloudinary.secure_url });
        } else {
            res.json({ result: false });
        }

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})

module.exports = router;
