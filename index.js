// Import all packages
var Express = require("express");
var { MongoClient } = require("mongodb");
var cors = require("cors");
const multer = require("multer");

// Create an instance of Express
var app = Express();
app.use(cors());

// MongoDB connection details
var CONNECTION_STRING = "mongodb+srv://rakmariano6262:Mariano6262@cluster0.xqumn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
var DATABASENAME = "MyDb";
var database;

// Use Async/Await to Connect to MongoDB
async function connectToDatabase() {
    try {
        const client = await MongoClient.connect(CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
        database = client.db(DATABASENAME);
        console.log("✅ Connected to MongoDB!");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
    }
}

// Start server and connect to DB
app.listen(5038, async () => {
    await connectToDatabase();
});

// ROUTES

// Get all books
app.get("/api/books/GetBooks", async (req, res) => {
    try {
        const books = await database.collection("books").find({}).toArray();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch books" });
    }
});

// Add a new book
app.post("/api/books/AddBook", multer().none(), async (req, res) => {
    try {
        const numOfDocs = await database.collection("books").countDocuments();
        await database.collection("books").insertOne({
            id: (numOfDocs + 1).toString(),
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
        });
        res.json("Added Successfully");
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ error: "Failed to add book" });
    }
});

// Delete a book
app.delete("/api/books/DeleteBook", async (req, res) => {
    try {
        await database.collection("books").deleteOne({ id: req.query.id });
        res.json("Deleted successfully!");
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).json({ error: "Failed to delete book" });
    }
});
