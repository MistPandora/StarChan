const express = require('express');
const router = express.Router();
const Category = require('../models/categories.model');
const Subject = require('../models/subjects.model');
const slugifyString = require('../modules/slugifyString');
const verifyTokenValidity = require('../middlewares/verifyTokenValidity');


// GET

router.get('/', async (_, res) => {
    try {
        const categories = await Category.find().lean();

        categories.length ? res.json({ result: true, categories }) : res.status(404).json({ result: false, error: "Category not found" });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }

});

router.get("/:categoryId", async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        if (!categoryId) {
            res.status(400).json({ result: false });
            return
        };

        const category = await Category.findById(categoryId).lean().populate("subjects");

        category ? res.json({ result: true, category }) : res.status(404).json({ result: false, error: "Category not found" });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }

});


// POST

router.post('/new', verifyTokenValidity, async (req, res) => {
    try {
        const title = req.body.title;
        const slugTitle = slugifyString(title);
        const category = await Category.findOne({ slugTitle }).lean();

        if (category) {
            res.status(409).json({ result: false, error: 'A category with this title already exists' });
            return;
        }

        const newCategory = await Category.create({
            title,
            slugTitle,
            subjects: []
        })

        res.json({ result: true });

    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});


// DELETE

router.delete("/:categoryId", verifyTokenValidity, async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        if (!categoryId) {
            res.status(400).json({ result: false });
            return
        };

        await Category.deleteOne({ _id: categoryId });
        res.json({ result: true });
    } catch (error) {
        console.error('An error occurred:', error.message);
        res.status(500).json({ result: false });
    }
});


module.exports = router;