const mongoose = require('mongoose');

const equipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Armor', 'Axe', 'Bow', 'Dagger', 'Flail', 'Hammer', 'Mace', 'Nunchucks', 'Shield', 'Shortsword', 'Spear', 'Staff', 'Sword', 'Two-hand', 'XBow'],
  },
  statModify: {
    type: String,
    enum: ["baseHP", "baseAtk", "baseDef", "baseMagic"],
  },
  statValue: {
    type: Number
  },
});

module.exports = mongoose.model('Equip', equipSchema);
