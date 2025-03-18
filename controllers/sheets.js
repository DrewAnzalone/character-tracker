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
})

module.exports = router;
