const express = require("express");
const verifyToken = require("../middleware/verify-token.js");
const Equip = require("../models/equip.js");
const Sheet = require("../models/sheet.js");
const router = express.Router()

router.post("/", verifyToken, async (req, res) => {
  try {
    const newEquip = await Equip.create(req.body);
    res.status(201).json(newEquip);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const equips = await Equip.find();
    res.status(200).json(equips);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.get('/:equipId', async (req, res) => {
  try {
    const chosenEquip = await Equip.findById(req.params.equipId);

    if (!chosenEquip) {
      res.status(404)
      throw new Error('Equip not found');
    }
    res.status(200).json(chosenEquip);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ err: err.message });
    } else {
      res.status(500).json({ err: err.message });
    }
  }
});

router.put('/:equipId', verifyToken, async (req, res) => {
  try {
    const updatedEquip = await Equip.findByIdAndUpdate(req.params.equipId, req.body, { new: true });

    if (!updatedEquip) {
      res.status(404);
      throw new Error('Equip not found');
    }
    res.status(200).json(updatedEquip);
  } catch (err) {
    if (res.statusCode === 404) {
      res.json({ err: err.message });
    } else {
      res.status(500).json({ err: err.message });
    }
  }
});

router.delete('/:equipId', verifyToken, async (req, res) => {
  try {
    const equipToBeDeleted = await Equip.findById(req.params.equipId);
    if (!equipToBeDeleted) {
      res.status(404);
      throw new Error('Equip not found');
    }

    const isEquipped = !!(await Sheet.findOne({ equips: equipToBeDeleted._id }));
    if (isEquipped) {
      res.status(403);
      throw new Error("Equips on any sheets cannot be deleted");
    }

    await Equip.findByIdAndDelete(equipToBeDeleted._id);
    res.status(200).json(equipToBeDeleted);
  } catch (err) {
    if (!([404, 403].includes(res.statusCode))) res.status(500);
    res.json({ err: err.message });
  }
});

module.exports = router
