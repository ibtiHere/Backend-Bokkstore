const express = require("express");
const booksModel = require("../models/booksModel");
const upload = require("../middleware/multer");


// Creating a new Book


exports.createBook = async (req, res) => {
    const { title, author, genre, description } = req.body;

    // Handle image upload
    const image = req.file ? req.file.path : req.body.image;

    try {
        const newBook = new booksModel({
            title,
            author,
            genre,
            image,
            description
        });

        await newBook.save();
        res.status(201).json({ message: "Book created successfully", newBook });
    } catch (error) {
        console.error("Error in creating book:", error);
        res.status(500).json({ error: "Failed to create book" });
    }
};


// Get all books


exports.getBooks = async (req, res) => {
    try {
        const books = await booksModel.find();
        res.status(200).json({ message: "Books fetched successfully", books });
    } catch (error) {
        console.error("Error in fetching books:", error);
        res.status(500).json({ error: "Failed to fetch books" });
    }
}

// Get a single book 


exports.getBook = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await booksModel.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book fetched successfully", book });
    } catch (error) {
        console.error("Error in fetching book:", error);
        res.status(500).json({ error: "Failed to fetch book" });
    }
}

// Update a book



exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, author, genre, description } = req.body;

    // Handle image update
    const image = req.file ? req.file.path : req.body.image;

    try {
        const updatedBook = await booksModel.findByIdAndUpdate(
            id,
            { title, author, genre, image, description },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
        console.error("Error in updating book:", error);
        res.status(500).json({ error: "Failed to update book" });
    }
};



// Delete a book


exports.deleteBook = async (req, res) => {
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