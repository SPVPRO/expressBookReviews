const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users; 
const public_users = express.Router();
const axios = require('axios');

// Helper function to check if user exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
};

// Task 6: Register a user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" }); 
        } else {
            return res.status(404).json({ message: "User already exists!" }); 
        }
    }
    return res.status(404).json({ message: "Unable to register user: Provide username and password." }); 
});

// Task 10: Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => Promise.resolve(books);
        const bookList = await getBooks();
        res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error fetching book list"});
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const findBook = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    findBook
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({message: err}));
});
  
// Task 12: Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = await Promise.resolve(
            Object.values(books).filter(b => b.author === author)
        );
        if (getBooksByAuthor.length > 0) {
            res.status(200).json(getBooksByAuthor);
        } else {
            res.status(404).json({ message: "No books found for this author" });
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

// Task 13: Get all books based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = await Promise.resolve(
            Object.values(books).filter(b => b.title === title)
        );
        if (getBooksByTitle.length > 0) {
            res.status(200).json(getBooksByTitle);
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

// Get book review (Standard route)
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book.reviews); 
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
