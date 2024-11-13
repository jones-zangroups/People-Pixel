
// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/PeoplePixelDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  category: String,
  todos: [{
    text: String,
    completed: { type: Boolean, default: false }
  }],
  reminders: [{
    text: String,
    date: Date
  }],
  transactions: [{
    amount: Number,
    description: String,
    date: Date
  }]
});

const Contact = mongoose.model('Contact', contactSchema);

// API Routes
// Get all contacts by category
app.get('/api/contacts', async (req, res) => {
  const category = req.query.category;
  try {
    const contacts = category 
      ? await Contact.find({ category }) 
      : await Contact.find(); // If no category, return all contacts
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving contacts', error: error.message });
  }
});

// Add new contact
app.post('/api/contacts', async (req, res) => {
  const contact = new Contact(req.body);
  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (error) {
    res.status(400).json({ message: 'Error adding new contact', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





// Add this to server.js

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

const Category = mongoose.model('Category', categorySchema);

// Route to add a new category
app.post('/api/categories', async (req, res) => {
  const category = new Category({ name: req.body.name });
  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error adding category', error: error.message });
  }
});
