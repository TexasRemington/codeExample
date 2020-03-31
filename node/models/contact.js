var mongoose = require('mongoose');
ObjectId = mongoose.Schema.ObjectId;

var contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  company: { type: ObjectId, ref: 'company', required: true },
  job: { type: ObjectId, ref: 'job', required: true },
  startDate: { type: Date, required: false },
  email: { type: String },
  contacted: { type: Boolean(false) },
  dateCreated: { type: Date, default: Date.now() }
});

var Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
