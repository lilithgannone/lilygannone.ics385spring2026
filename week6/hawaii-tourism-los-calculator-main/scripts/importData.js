/*
AI Comments to increase Understanding
This runnable script imports tourism LOS data from a CSV file into MongoDB.
Data flow: read CSV rows -> clean/filter rows -> build yearly data arrays -> insert documents into `TourismData`.
It is meant for setup/reset workflows before running the API server.
*/
const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const TourismData = require('../models/TourismData');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hawaii_tourism';
const CSV_FILE =
  process.env.CSV_FILE || path.join(__dirname, '../standalone/data.csv');

// Keywords to skip (footer rows)
const SKIP_KEYWORDS = [
  'Data is updated',
  'Source of Data',
  'Seasonally adjusted',
  'Hotel performance'
];

// AI Alteration: Prevented data overwrite during import
function normalizeRecord(rawRecord) {
  if (!rawRecord.group || !rawRecord.indicator || !Array.isArray(rawRecord.yearlyData)) {
    return null;
  }
  if (rawRecord.yearlyData.length === 0) {
    return null;
  }
  return {
    group: rawRecord.group.trim(),
    indicator: rawRecord.indicator.trim(),
    units: rawRecord.units || 'days',
    yearlyData: rawRecord.yearlyData
  };
}

async function importData() {
  // AI Alteration: Prevented data overwrite during import
  // Main import workflow: connect DB, parse CSV, upsert records safely, print summary, close connection.
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const recordsByKey = new Map();
    // AI Alteration: Prevented data overwrite during import
    let skippedInvalid = 0;
    // AI Alteration: Prevented data overwrite during import
    let skippedDuplicateInput = 0;

    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_FILE)
        .pipe(csv())
        .on('data', (row) => {
          const group = row.Group || '';

          // Skip footer/metadata rows
          if (!group || SKIP_KEYWORDS.some(keyword => group.includes(keyword))) {
            return;
          }

          const indicator = row.Indicator || '';
          const units = row.Units || 'days';

          // Extract yearly data
          // For each numeric year column, parse LOS into `{ year, value }` pairs.
          const yearlyData = [];
          Object.keys(row).forEach(key => {
            // Check if key is a year (numeric)
            if (!isNaN(key) && row[key] && row[key].trim() !== '') {
              try {
                const value = parseFloat(row[key]);
                if (!isNaN(value)) {
                  yearlyData.push({
                    year: key,
                    value: value
                  });
                }
              } catch (e) {
                /*
                AI Analysis: Core Vulnerability
                Issue: parse failures are silently ignored for individual values.
                Why it matters: bad rows can be skipped without visibility, causing hidden data gaps.
                Where: yearly value parse block in CSV row processing.
                Later fix idea: track and report rejected rows/fields in an import log.
                */
                // Skip invalid values
              }
            }
          });

          // AI Alteration: Prevented data overwrite during import
          const normalized = normalizeRecord({
            group,
            indicator,
            units,
            yearlyData
          });

          if (!normalized) {
            skippedInvalid += 1;
            return;
          }

          const dedupeKey = `${normalized.group}||${normalized.indicator}`;
          if (recordsByKey.has(dedupeKey)) {
            skippedDuplicateInput += 1;
            return;
          }
          recordsByKey.set(dedupeKey, normalized);
        })
        .on('end', resolve)
        .on('error', reject);
    });

    // Insert records into MongoDB
    // AI Alteration: Prevented data overwrite during import
    const records = Array.from(recordsByKey.values());
    if (records.length > 0) {
      // AI Alteration: Prevented data overwrite during import
      const operations = records.map((record) => ({
        updateOne: {
          // AI Alteration: Added duplicate prevention logic
          filter: { group: record.group, indicator: record.indicator },
          update: {
            $set: {
              units: record.units,
              yearlyData: record.yearlyData
            },
            $setOnInsert: {
              group: record.group,
              indicator: record.indicator
            }
          },
          upsert: true
        }
      }));

      // AI Alteration: Prevented data overwrite during import
      const result = await TourismData.bulkWrite(operations, { ordered: false });
      const inserted = result.upsertedCount || 0;
      const updated = result.modifiedCount || 0;
      const matchedUnchanged = Math.max(0, (result.matchedCount || 0) - updated);
      const skipped = skippedInvalid + skippedDuplicateInput + matchedUnchanged;

      console.log(`Import completed. Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`);
    } else {
      console.log('No records to import');
    }

    // Display summary
    const categories = await TourismData.distinct('group');
    const locations = await TourismData.distinct('indicator');

    console.log('\nImport Summary:');
    console.log(`- Total parsed unique records: ${records.length}`);
    // AI Alteration: Prevented data overwrite during import
    console.log(`- Skipped invalid rows: ${skippedInvalid}`);
    // AI Alteration: Prevented data overwrite during import
    console.log(`- Skipped duplicate input rows: ${skippedDuplicateInput}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Locations: ${locations.length}`);

  } catch (error) {
    // AI Alteration: Added duplicate prevention logic
    if (error && error.code === 11000) {
      console.error('Duplicate key conflict detected during import:', error);
    } else {
    console.error('Error importing data:', error);
    }
  } finally {
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

importData();
