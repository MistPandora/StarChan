import mongoose from 'mongoose';
const timeAgo = require('../modules/timeAgo');
const cloudinary = require('cloudinary').v2;

const answersSchema = mongoose.Schema({
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
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects',
        required: true
    }

}, { toJSON: { virtuals: true } });

// Middlewares

answersSchema.pre("find", async function (next) {
    this.populate('userOwner');
    next();
});

answersSchema.pre("findOne", async function (next) {
    this.populate('userOwner');
    next();
});

answersSchema.pre('deleteOne', async function (next) {
    const answerId = this.getFilter()._id;

    await mongoose.model('users').updateOne({ createdAnswers: answerId }, { $pull: { createdAnswers: answerId } });
    await mongoose.model('subjects').updateOne({ answers: answerId }, { $pull: { answers: answerId } });

    next();
});

answersSchema.pre("deleteMany", async function (next) {
    const subjectId = this.getFilter().subject;

    const answers = await mongoose.model("answers").find({ subject: subjectId });

    await Promise.all(answers.map(async (answer) => {
        const answerId = answer._id;
        const pictureLink = answer.pictureLink;

        await mongoose.model("users").updateOne({ createdAnswers: answerId }, { $pull: { createdAnswers: answerId } });
        pictureLink && await cloudinary.api.delete_resources([`forum/${pictureLink}`]);
    }));

    next();
});


// Virtuals

answersSchema.virtual("timeAgo").get(function () {
    return timeAgo(this.creationDate);
});

const Answer = mongoose.model('answers', answersSchema);

module.exports = Answer;