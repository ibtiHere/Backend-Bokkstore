// In your routes file
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { createBook, getBooks, getBook, updateBook, deleteBook } = require('../controllers/booksControllers');
const authenticateToken = require('../middleware/auth');

router.post('/createbooks', upload.single('image'), authenticateToken, createBook);
router.get('/getbooks', authenticateToken, getBooks);
router.get('/getbook/:id', authenticateToken, getBook);
router.put('/updatebook/:id', upload.single('image'), authenticateToken, updateBook);
router.delete('/deletebook/:id', authenticateToken, deleteBook);


module.exports = router;
