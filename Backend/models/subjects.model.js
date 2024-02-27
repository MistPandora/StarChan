const mongoose = require('mongoose');
const timeAgo = require('../modules/timeAgo');
const toFrenchDate = require('../modules/toFrenchDate');
const cloudinary = require('cloudinary').v2;

const subjectsSchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    slugTitle: {
        type: String,
        unique: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    creationDate: {
        type: Date,
    },
    pictureLink: {
        type: String
    },
    views: {
        type: Number,
        default: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    answers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'answers',
    }],

}, { toJSON: { virtuals: true } });


// Middlewares

subjectsSchema.pre("find", async function (next) {
    this.populate('userOwner');
    next();
});

subjectsSchema.pre("findOne", async function (next) {
    this.populate('userOwner');
    next();
});

subjectsSchema.pre("deleteOne", async function (next) {
    const subjectId = this.getFilter()._id;

    await mongoose.model('answers').deleteMany({ subject: subjectId })

    await mongoose.model("categories").updateOne({ subjects: subjectId }, { $pull: { subjects: subjectId } });
    await mongoose.model("users").updateOne({ createdSubjects: subjectId }, { $pull: { createdSubjects: subjectId } });

    next();
});


subjectsSchema.pre("deleteMany", async function (next) {
    const categoryId = this.getFilter().category;
    const subjects = await mongoose.model("subjects").find({ category: categoryId });

    await Promise.all(subjects.map(async (subject) => {
        const subjectId = subject._id;
        const pictureLink = subject.pictureLink;

        await mongoose.model('answers').deleteMany({ subject: subjectId });
        await mongoose.model("users").updateOne({ createdSubjects: subjectId }, { $pull: { createdSubjects: subjectId } });
        pictureLink && await cloudinary.api.delete_resources([`forum/${pictureLink}`]);
    }));

    next();
});


// Virtuals

subjectsSchema.virtual("timeAgo").get(function () {
    return timeAgo(this.creationDate);
});


const Subject = mongoose.model('subjects', subjectsSchema);

module.exports = Subject;