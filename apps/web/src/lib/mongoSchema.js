import mongoose from 'mongoose';

// Schema modeling (Mongo)
// This file demonstrates NoSQL (Mongo) schema modeling for the viva evaluation.
// Although the primary database is SQL (Postgres), this illustrates how the same 
// concepts would be modeled in a NoSQL environment like MongoDB using Mongoose.

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  // Embedded Document Pattern: Storing related data directly inside the parent document.
  // This avoids expensive JOINs, which are generally not supported or slow in NoSQL.
  profile: {
    address: String,
    notes: String
  },
  // Reference Pattern: Storing ObjectIds of related documents. 
  // Useful when the related data is large or needs to be queried independently.
  transactionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
}, { timestamps: true });

export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
