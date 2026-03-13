const User = require('../models/User');
const Vendor = require('../models/Vendor');
const mongoose = require('mongoose');

// GET: User Profile with populated lists
exports.getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid User ID format' });
        }

        const user = await User.findById(id)
            .populate('savedPlaces', 'name category location images rating')
            .populate('favorites', 'name category location images rating')
            .populate('visited', 'name category')
            .populate('submissions', 'name isVerified createdAt');

        if (!user) return res.status(404).json({ message: 'User not found' });

        return res.status(200).json(user);
    } catch (err) {
        console.error('Audit: getUserProfile failed:', err);
        return res.status(500).json({ error: 'Server Error' });
    }
};

// POST: Toggle Saved Place
exports.toggleSavedPlace = async (req, res) => {
    try {
        const { userId, vendorId } = req.body;
        
        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(vendorId)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format provided' });
        }

        const user = await User.findById(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        const index = user.savedPlaces.indexOf(vendorId);
        if (index > -1) {
            user.savedPlaces.splice(index, 1); // Remove if exists
        } else {
            user.savedPlaces.push(vendorId); // Add if not exists
        }

        await user.save();
        return res.status(200).json({ message: 'Saved places updated', savedPlaces: user.savedPlaces });
    } catch (err) {
        console.error('Audit: toggleSavedPlace failed:', err);
        return res.status(500).json({ error: 'Server Error' });
    }
};
