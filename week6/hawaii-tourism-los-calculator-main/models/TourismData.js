/*
AI Comments to increase Understanding
This file defines the MongoDB schema for tourism LOS records.
Each document stores a visitor group, a location indicator, and many year/value LOS points.
Data flow: CSV import script creates documents with this shape, and API routes read them for calculations.
*/
const mongoose = require('mongoose');

const tourismDataSchema = new mongoose.Schema({
  group: {
    type: String,
    required: true,
    index: true
  },
  indicator: {
    type: String,
    required: true,
    index: true
  },
  units: {
    type: String,
    default: 'days'
  },
  yearlyData: [{
    year: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Compound index for faster queries
/*
AI Analysis: Core Vulnerability
Issue: there is no schema rule to prevent duplicate group+indicator datasets.
Why it matters: duplicates can skew averages and create silent data-integrity errors.
Where: schema/index design in this model file.
Later fix idea: enforce a unique constraint or add deduplication during import.
*/
// AI Alteration: Added duplicate prevention logic
tourismDataSchema.index({ group: 1, indicator: 1 }, { unique: true });

module.exports = mongoose.model('TourismData', tourismDataSchema);
