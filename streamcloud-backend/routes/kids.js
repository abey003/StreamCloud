// routes/kidsShows.js
const express = require('express');
const router = express.Router();
const KidsShow = require('../models/KidsShowData');

router.get('/', async (req, res) => {
    try {
        const kidsShows = await KidsShow.find();
        if (kidsShows.length === 0) {
            return res.status(200).json({ message: "No Shows Available" });
        }
        res.json(kidsShows);
    } catch (error) {
        console.error("Error fetching kids shows:", error);
        res.status(500).json({ message: 'Error fetching kids shows', error });
    }
});

router.post('/add', async (req, res) => {
    try {
        const newKidsShow = new KidsShow(req.body);
        await newKidsShow.save();
        res.send("Kids show added successfully!");
    } catch (error) {
        console.error("Error in adding kids show:", error.message);
        res.status(500).send("Error in adding kids show: " + error.message);
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const kidsShow = await KidsShow.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!kidsShow) return res.status(404).json({ message: 'Kids show not found' });
        res.json(kidsShow);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
