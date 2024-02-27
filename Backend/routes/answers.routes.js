const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

const Answer = require('../models/answers.model');
const User = require('../models/users.model');

const verifyTokenValidity = require('../middlewares/verifyTokenValidity');
const toFrenchDate = require('../modules/toFrenchDate');
const Subject = require('../models/subjects.model');

// GET

router.get('/', async (req, res) => {
    try {
        const subjectId = req.query.subject;
        const answers = subjectId ? await Answer.find({ subject: subjectId }) : await Answer.find();

        answers.length ? res.json({ result: true, answers }) : res.status(404).json({ result: false, error: "No answer found" });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});


// POST

router.post('/new', verifyTokenValidity, async (req, res) => {
    try {
        const userId = req.user;
        const { message, subjectId, pictureLink } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            res.status(401).json({ result: false, error: 'Unauthorized action' });
            return;
        }

        const newAnswer = await Answer.create({
            message,
            creationDate: toFrenchDate(new Date()),
            pictureLink,
            userOwner: userId,
            subject: subjectId,
        })

        await user.updateOne({ $push: { createdAnswers: newAnswer._id } });
        await Subject.updateOne({ _id: subjectId }, { $push: { answers: newAnswer } })

        res.status(201).json({ result: true, message: "The answer got created successfully" });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});

// DELETE

router.delete("/:answerId", verifyTokenValidity, async (req, res) => {
    try {
        const answerId = req.params.answerId;
        const answer = await Answer.findById(answerId);
        const pictureLink = answer.pictureLink;

        pictureLink && await cloudinary.api.delete_resources([`forum/${pictureLink}`]);
        await Answer.deleteOne(answer);

        res.json({ result: true });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})

module.exports = router;
