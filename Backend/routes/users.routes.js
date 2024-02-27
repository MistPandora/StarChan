const express = require('express');
const router = express.Router();
const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkBody = require('../modules/checkBody');
const slugifyString = require('../modules/slugifyString');

const verifyTokenValidity = require('../middlewares/verifyTokenValidity');
const toFrenchDate = require('../modules/toFrenchDate');

// GET

router.get('/', async (req, res) => {
    try {

        const users = await User.find().select().lean();

        if (!users.length) {
            res.status(404).json({ result: false, error: 'No user found' });
            return
        };

        res.json({ result: true, users })

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})

router.get('/currentUser', verifyTokenValidity, async (req, res) => {
    try {
        const userId = req.user;

        const queries = Object.getOwnPropertyNames(req.query).join(" +");
        const user = await User.findById(userId).select(`+${queries}`).lean();

        if (!user) {
            res.status(404).json({ result: false, error: "No user found" });
            return
        }

        res.json({ result: true, user });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});


// POST

router.post('/signup', async (req, res) => {
    if (!checkBody(req.body, ['username', 'email', 'password'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return
    };

    try {

        const username = req.body.username;
        const slugUsername = slugifyString(username);
        const email = req.body.email;

        const existingUser = await User.findOne({ $or: [{ slugUsername }, { email }] }).lean();

        if (existingUser) {
            res.status(409).json({ result: false, error: "A username with the same nickname or email already exists " });
            return
        };

        const hash = bcrypt.hashSync(req.body.password, 12);

        const newUser = await User.create({
            username,
            slugUsername,
            creationDate: toFrenchDate(new Date()),
            email,
            password: hash
        });

        const jwtToken = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" });

        res.status(201).json({ result: true, token: jwtToken });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }

});


router.post('/signin', async (req, res) => {
    if (!checkBody(req.body, ['email', 'password'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.getCredentials({ email }).lean();
        const userId = user._id;

        if (!user) {
            res.status(404).json({ result: false, error: "User not found" });
            return;
        };

        if (bcrypt.compareSync(password, user.password)) {
            const jwtToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" });
            res.json({ result: true, token: jwtToken });
        } else {
            res.status(401).json({ result: false, error: "Wrong password" });
        };

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }

});

// PUT

router.put('/profile', verifyTokenValidity, async (req, res) => {
    try {
        const { updatedUsername, updatedEmail, updatedPassword, updatedPictureLink } = req.body;
        const userId = req.user;

        const user = await User.getCredentials({ _id: userId });

        updatedUsername && slugifyString(updatedUsername) !== user.slugUsername
            && await user.updateOne({ username: updatedUsername, slugUsername: slugifyString(updatedUsername) });

        updatedPictureLink && updatedPictureLink !== user.pictureLink
            && await user.updateOne({ pictureLink: updatedPictureLink });

        updatedEmail && updatedEmail !== user.email
            && await user.updateOne({ email: updatedEmail });

        updatedPassword && await user.updateOne({ password: bcrypt.hashSync(updatedPassword, 12) });

        res.json({ result: true });
    } catch (error) {
        console.error('An error occurred:', error.message);
        const existingKey = Object.keys(error.keyValue);
        res.status(500).json({ result: false, existingKey });
    }
})

// PATCH

router.patch('/favoritePictures', async (req, res) => {
    const email = req.body.email;
    const pictureID = req.body.pictureID;

    // Recherche l'utilisateur dans la base de données par son adresse e-mail et peuple la liste des photos favorite
    const user = await User.findOne({ email }).populate('favoritePictures');

    // Vérifie si la photo spécifiée est déjà incluse dans les favoris de l'utilisateur
    const isPictureIncluded = user.favoritePictures.some(picture => picture._id == pictureID);

    if (isPictureIncluded) {

        // Si l'identifiant de la photo existe, la retire de la liste des favoris
        const favoritePictures = user.favoritePictures.filter(picture => picture._id != pictureID);
        await User.updateOne(user, { favoritePictures });
        res.json({ result: true });

    } else {

        // Sinon, ajoute la photo à la liste des favoris
        await User.updateOne(user, { $push: { favoritePictures: pictureID } });

        res.json({ result: true });
    }
});

// DELETE

router.delete('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        await User.deleteOne({ _id: userId });

        res.json({ result: true });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});

// router.patch('/all/:userId', async (req, res) => {
//     const user = await User.updateOne({ _id: req.params.userId }, { createdAnswers: [] }).select('createdAnswers')
//     console.log(user);
//     res.json({ result: true })
// })

module.exports = router;
