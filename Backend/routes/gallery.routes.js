const express = require('express');
const router = express.Router();
const Picture = require('../models/pictures.model');
const toFrenchDate = require('../modules/toFrenchDate');
const User = require('../models/users.model');


// route GET pour récupérer les photos

router.get('/', async (_, res) => {
    try {
        const pictures = await Picture.find().lean().populate('user');

        if (!pictures.length) {
            res.status(404).json({ result: false, error: "No picture found" });
            return
        };

        const filteredPictures = pictures.map(picture => {
            const userOwnerName = picture.user.username;
            const filteredPicture = filterPicturesDatas(picture);
            filteredPicture.userOwnerName = userOwnerName;

            return filteredPicture
        })

        res.json({ result: true, pictures: filteredPictures });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});


router.get('/picture', async (req, res) => {
    try {
        const pictureId = req.query.q;
        const picture = await Picture.findById(pictureId).lean().populate('user');

        if (!picture) {
            res.status(404).json({ result: false, error: "No picture found" });
            return
        };

        const userOwnerName = picture.user.username;
        const userOwnerPictureLink = picture.user.pictureLink;
        const filteredPicture = filterPicturesDatas(picture);
        filteredPicture.userOwnerName = userOwnerName;
        filteredPicture.userOwnerPictureLink = userOwnerPictureLink;

        res.json({ result: true, picture: filteredPicture });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});

// route POST pour créer un nouveau document picture qui s'enregistrera dans la base de données

router.post('/new', async (req, res) => {
    try {
        const { userOwner, title, description, pictureLink, place } = req.body;

        const newPicture = await Picture.create({
            title,
            description,
            place,
            creationDate: toFrenchDate(new Date()),
            pictureLink,
            userOwner
        })

        newPicture && res.status(201).json({ result: true });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }


})

//  Route GET pour récupérer les photos favorites d'un utilisateur spécifié par son adresse e-mail.

router.get('/favorites/:email', async (req, res) => {
    const email = req.params.email;
    const user = await User.findOne({ email });

    const favoritePictures = [];
    for (const id of user.favoritePictures) {
        const picture = await Picture.findOne({ _id: id }).populate('user');
        favoritePictures.push(picture);
    }

    favoritePictures.length == user.favoritePictures.length && res.json({ result: true, favorites: favoritePictures })
})

module.exports = router;
