const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Sheet = require("../models/sheet.js");
const router = express.Router();

router.get("/:sheetId", verifyToken, async (req, res) => {
    try {
        const sheet = await Sheet.findById(req.params.sheetId);
        res.status(200).json(sheet);
    } catch {
        res.status(500).json({ err: err.message })
    }
});


router.delete("/:sheetId", verifyToken, async (req, res) => {
    try {
        const sheet = await Sheet.findById(req.params.sheetId);
        const author = await User.findById(req.body._id);

        if (!author.sheets.includes(sheet._id)) {
            return res.status(403).send("You are not allowed to do that!");
        }
        const deletedSheet = await Sheet.findByIdAndDelete(req.params.sheetId);
        res.status(200).json(deletedSheet);

    } catch (err) {
        res.status(500).json({ err: err.message });
    }
});

module.exports = router;
