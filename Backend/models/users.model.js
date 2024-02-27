const mongoose = require('mongoose');
const toFrenchDate = require('../modules/toFrenchDate');
const cloudinary = require('cloudinary').v2;

const defaultAvatar = "https://res.cloudinary.com/deu4t97ll/image/upload/v1702547761/profile/eqkmw4ax00s1blduv8pr.jpg";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        validate: {
            validator: value => value.length >= 4 && value.length <= 15
        },
        message: ({ value }) => `The username "${value}" is not valid.`
    },
    slugUsername: {
        type: String,
        unique: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ["Admin", "Moderator", "Member"],
        default: "Member"
    },
    pictureLink: {
        type: String,
        default: defaultAvatar
    },
    creationDate: {
        type: Date,
        default: toFrenchDate(new Date())
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        select: false,
        validate: {
            validator: value => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        },
        message: ({ value }) => `The email "${value}" is not valid.`
    },
    password: {
        type: String,
        select: false
    },
    createdSubjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects',
        select: false
    }],
    createdAnswers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'answers',
        select: false
    }],
    favoritePictures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pictures',
        select: false
    }],
});


userSchema.loadClass(
    class {
        static getCredentials(filter) {
            // this = model
            return this.findOne(filter).select("email slugEmail password")
        }
    }
)


// Middlewares

userSchema.pre('deleteOne', async function () {
    const { _id: userId, pictureLink: avatar } = this.getFilter();
    mongoose.model("pictures").deleteMany({ userOwner: userId });
    avatar !== defaultAvatar && await cloudinary.api.delete_resources([`profile/${avatar}`]);
})

const User = mongoose.model('users', userSchema);

module.exports = User;