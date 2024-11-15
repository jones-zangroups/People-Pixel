// backend/models/Finance.js
const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
  },
  date: Date,
  description: String,
  amount: Number,
  category: String,
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
});

module.exports = mongoose.model('Finance', FinanceSchema);
