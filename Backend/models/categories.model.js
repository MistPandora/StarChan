const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    slugTitle: {
        type: String,
        unique: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subjects'
    }]
});

categorySchema.pre("deleteOne", async function () {
    const categoryId = this.getFilter()._id;
    await mongoose.model("subjects").deleteMany({ category: categoryId });
});

const Category = mongoose.model('categories', categorySchema);

module.exports = Category;