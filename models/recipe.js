const mongoose = require('mongoose');

let recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    ingredients: String,
    direction: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});
module.exports = mongoose.model("Recipe", recipeSchema);