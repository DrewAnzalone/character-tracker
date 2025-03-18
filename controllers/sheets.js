const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Sheet = require("../models/sheet.js");
const router = express.Router();

router.get("/:sheetId", verifyToken, async (req, res) => {
    try {
        const sheet = await Sheet.findById(req.params.sheetId).populate("author");
        res.status(200).json(sheet);
    } catch {
        res.status(500).json({ err: err.message })
    }
});

router.put("/:sheetId", verifyToken, async (req, res) => {
    try {
        const sheet = await Sheet.findById(req.params.sheetId);

        if (!sheet.author.equals(req.user._id)) {
            return res.status(403).send("You are not allowed to do that!");
        }

        const updatedSheet = await Sheet.findByIdAndUpdate(
            req.params.sheetId,
            req.body,
            { new: true }
        );
        updatedSheet._doc.author = req.user;
        res.status(200).json(updatedSheet)
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;
