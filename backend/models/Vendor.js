const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    yearsInOperation: { type: String, required: true }, // e.g., "Since 1974"
    category: { type: String, enum: ['Local Eatery', 'Heritage Site'], required: true },
    culturalStory: { type: String, required: true }, // Max 500 chars per your UI
    location: {
        address: String, // e.g., "Valdez Street, Angeles City"
        coordinates: { lat: Number, lng: Number }
    },
    images: [String], // Array of Cloudinary URLs
    authenticityTraits: [String], // e.g., "Original family recipe"
    isVerified: { type: Boolean, default: false }, // For Admin Approval
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', VendorSchema);