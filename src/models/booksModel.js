const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    user: mongoose.Schema.Types.ObjectId,
    title: String,
    author: String,
    genre: String,
    image: String,
    description: String,
    created_at: {
        type: Date,
        default: Date.now
    }

});
const Books = mongoose.model("books", bookSchema);
module.exports = Books