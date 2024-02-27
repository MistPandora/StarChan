const mongoose = require('mongoose');
const toFrenchDate = require('../modules/toFrenchDate');
const cloudinary = require('cloudinary').v2;


const picturesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    place: {
        type: String,
        trim: true
    },
    creationDate: {
        type: Date,
        default: toFrenchDate(new Date())
    },
    pictureLink: {
        type: String
    },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

// Middlewares

picturesSchema.post("deleteOne", async function () {
    const pictureLink = this.getFilter().pictureLink;
    await cloudinary.api.delete_resources([`gallery/${pictureLink}`]);
});


// Virtuals

picturesSchema.virtual("timeAgo").get(function () {
    return timeAgo(this.creationDate);
});


const Picture = mongoose.model('pictures', picturesSchema);

module.exports = Picture;