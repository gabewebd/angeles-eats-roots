const Admin = require('../models/admin');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
        return res.status(200).json({ token, admin: { id: admin._id, username: admin.username } });
    } catch (err) {
        console.error('Audit: adminLogin failed:', err);
        return res.status(500).json({ error: err.message });
    }
};

exports.userLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Enforce Await for bcrypt comparison to prevent event loop blocking
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                full_name: user.name
            }
        });
    } catch (err) {
        console.error('Audit: userLogin failed:', err);
        return res.status(500).json({ error: err.message });
    }
};