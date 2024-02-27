const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;

const Subject = require('../models/subjects.model');
const Category = require('../models/categories.model');
const User = require('../models/users.model');
const slugifyString = require('../modules/slugifyString');

const verifyTokenValidity = require('../middlewares/verifyTokenValidity');
const toFrenchDate = require('../modules/toFrenchDate');

// GET

router.get('/', async (_, res) => {
    try {
        const subjects = await Subject.find();

        if (!subjects.length) {
            res.status(404).json({ result: false, error: "No subject found" });
            return
        }

        res.json({ result: true, subjects })
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});

router.get('/subject', async (req, res) => {
    try {
        const subjectId = req.query.q;

        if (!subjectId) {
            res.status(400).json({ result: false });
            return
        };

        const subject = await Subject.findById(subjectId);

        if (!subject) {
            res.status(404).json({ result: false, error: "No subject found" });
            return
        };

        res.json({ result: true, subject });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})


router.get('/search', verifyTokenValidity, async (req, res) => {
    try {
        const subjects = await Subject.find();

        if (!subjects.length) {
            res.status(404).json({ result: false, error: "No subject found" });
            return
        }
        const keywords = req.query.keywords.split('+');

        const matchingSubjects = subjects.filter(subject => {
            const title = slugifyString(subject.title);
            return keywords.some(keyword => title.includes(slugifyString(keyword)))
        });

        matchingSubjects.length
            ? res.json({ result: true, subjects: matchingSubjects })
            : res.json({ result: false, error: "No matching subjects" })

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})


// POST

router.post('/new', verifyTokenValidity, async (req, res) => {
    try {
        const userId = req.user;
        const { subjectTitle, message, categoryTitle, pictureLink } = req.body;
        const slugSubjectTitle = slugifyString(subjectTitle);
        const slugCategoryTitle = slugifyString(categoryTitle);

        const existingSubject = await Subject.findOne({ slugTitle: slugSubjectTitle }).lean();
        const category = await Category.findOne({ slugTitle: slugCategoryTitle });

        if (existingSubject) {
            existingSubject.category == category._id &&
                res.status(409).json({ result: false, error: 'A subject, with this title in this category, already exists' });
            return;
        };

        const user = await User.findById(userId);

        if (!user) {
            res.status(401).json({ result: false, error: 'Unauthorized action' });
            return;
        }

        const newSubject = await Subject.create({
            title: subjectTitle,
            slugTitle: slugSubjectTitle,
            message,
            creationDate: toFrenchDate(new Date()),
            pictureLink,
            category: category._id,
            userOwner: userId,
        });

        await category.updateOne({ $push: { subjects: newSubject._id } });
        await user.updateOne({ $push: { createdSubjects: newSubject._id } });

        res.status(201).json({ result: true, message: "The subject got created successfully" });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});


// PATCH

router.patch('/subject', async (req, res) => {
    try {
        const subjectId = req.query.q;

        if (!subjectId) {
            res.status(400).json({ result: false });
            return
        };

        await Subject.updateOne({ _id: subjectId }, { $inc: { views: 1 } });

        res.json({ result: true });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})



// DELETE

router.delete("/:subjectId", verifyTokenValidity, async (req, res) => {
    try {
        const subjectId = req.params.subjectId;
        const subject = await Subject.findById(subjectId);
        const pictureLink = subject.pictureLink;

        pictureLink && await cloudinary.api.delete_resources([`forum/${pictureLink}`]);

        await Subject.deleteOne(subject);

        res.json({ result: true });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
})

module.exports = router;