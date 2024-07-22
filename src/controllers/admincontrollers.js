const usermodel = require("../models/usersModel");
const booksModel = require("../models/booksModel");

exports.getallusers = async (req, res) => {
    try {
        const users = await usermodel.find();
        res.status(200).json({ message: "Users fetched successfully", users });
    } catch (error) {
        console.error("Error in fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

exports.getallbooks = async (req, res) => {
    try {
        const books = await booksModel.find();
        res.status(200).json({ message: "Books fetched successfully", books });
    } catch (error) {
        console.error("Error in fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
}


exports.deletebook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await booksModel.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        console.error("Error in deleting book:", error);
        res.status(500).json({ error: "Failed to delete book" });
    }
}

