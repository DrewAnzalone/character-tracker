const mongoose = require('mongoose');

const sheetSchema = new mongoose.Schema({
  name:       { type: String, required: true, },
  level:      { type: Number, required: true, },
  class:      { type: String, required: true, },
  baseHP:     { type: Number, default: 0, },
  baseAtk:    { type: Number, default: 0, },
  baseDef:    { type: Number, default: 0, },
  baseMagic:  { type: Number, default: 0, },
  equips:     { type: [mongoose.Schema.Types.ObjectId], ref: "Equip", },
});

sheetSchema.pre('find', function() {
  this.populate('equips');
});

module.exports = mongoose.model('Sheet', sheetSchema);
