const express = require('express');
const Sheet = require("../models/sheet.js");
const router = express.Router();

const User = require('../models/user');

const verifyToken = require('../middleware/verify-token');

router.get('/', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.json(users);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/:sheetId", verifyToken, async (req, res) => {
  try {
      const sheet = await Sheet.findById(req.params.sheetId);
      res.status(200).json(sheet);
  } catch {
      res.status(500).json({ err: err.message })
  }
});

router.get("/:sheetId/:equipId", verifyToken, async (req, res) => {
  try{
    const { sheetId, equipId } = req.params;
    const sheet = await Sheet.findById(sheetId);
    
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found!" });
    }
    const equip = sheet.equips.find((e) => e._id.toString() === equipId);

    if (!equip) {
      return res.status(404).json({ message: "No equipment on this sheet yet!" });
    }
    res.status(200).json(equip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:sheetId", verifyToken, async (req, res) => {
  try {
      const author = await User.findById(req.body._id);

      if (!author.sheets.includes(req.params.sheetId)) {
          return res.status(403).send("You are not allowed to do that!");
      }
      const deletedSheet = await Sheet.findByIdAndDelete(req.params.sheetId);
      author.sheets = author.sheets.filter(id => id !== deletedSheet._id);
      await User.findByIdAndUpdate(author._id, author);

      res.status(200).json(deletedSheet);

  } catch (err) {
      res.status(500).json({ err: err.message });
  }
});

module.exports = router;
