const axios = require('axios');
const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;

const public_users = express.Router();

// Register a new users
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (users.find(user => user.username === username)) {
    return res.status(409).json({
      message: 'Username already exists'
    });
  }

  users.push({ username, password });
  return res.status(200).json({
    message: 'User successfully registered'
  });
});


 // Get all books
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });

    const bookList = await getBooks;
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books'
    });
  }
});



 // Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const getBookByISBN = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject('Book not found');
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});



// Get books by author
public_users.get('/author/:author', async function (req, res) {
  try {
    const getBooksByAuthor = new Promise((resolve) => {
      const author = req.params.author;
      const booksByAuthor = Object.values(books).filter(
        book => book.author &&
          book.author.toLowerCase() === author.toLowerCase()
      );
      resolve(booksByAuthor);
    });

    const filteredBooks = await getBooksByAuthor;
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books by author'
    });
  }
});



 // Get books by title
public_users.get('/title/:title', async function (req, res) {
  try {
    const getBooksByTitle = new Promise((resolve) => {
      const title = req.params.title;
      const booksByTitle = Object.values(books).filter(
        book => book.title &&
          book.title.toLowerCase() === title.toLowerCase()
      );
      resolve(booksByTitle);
    });

    const filteredBooks = await getBooksByTitle;
    return res.status(200).json(filteredBooks);
  } catch (error) {
    return res.status(500).json({
      message: 'Error retrieving books by title'
    });
  }
});


// Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
