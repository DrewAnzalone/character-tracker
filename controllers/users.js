const express = require('express');
const router = express.Router();

const Equip = require('../models/equip');
const Sheet = require('../models/sheet');
const User = require('../models/user');
const verifyToken = require('../middleware/verify-token');

async function checkEquipExists(e) {
  try {
    return await Equip.exists({ _id: e });
  } catch (err) {
    console.log("Error checking if equip exists:", err);
    return false;
  }
}

router.get('/', verifyToken, async (req, res) => {
  try {
    const author = await User.findById(req.user._id).populate("sheets"); //! needs testing with user.js experimental (commented out) line

    res.json(author.sheets);
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

router.post('/', verifyToken, async (req, res) => {
  const allValid = await req.body.equips.every(checkEquipExists);

  try {
    if (!allValid) throw new Error("Invalid equips");
    const createdSheet = await Sheet.create(req.body);

    const author = await User.findById(req.body._id);
    author.sheets.push(createdSheet._id);
    await User.findByIdAndUpdate(author._id, author);

    res.status(201).json(createdSheet);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.put("/:sheetId", verifyToken, async (req, res) => {
  const allValid = await req.body.equips.every(checkEquipExists);

  try {
    if (!allValid) throw new Error("Invalid equips");

    const sheet = await Sheet.findById(req.params.sheetId);
    const author = await User.findById(req.body._id);

    if (!author.sheets.includes(sheet._id)) {
      return res.status(403).send("You are not allowed to do that!");
    }

    const updatedSheet = await Sheet.findByIdAndUpdate(
      req.params.sheetId,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedSheet)
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
