/*
AI Comments to increase Understanding
This file defines API endpoints used by the frontend LOS calculator.
Data flow: client sends category/location -> this router queries MongoDB -> calculates stats -> returns JSON.
It also provides lookup endpoints for dropdown options.
*/
const express = require('express');
const router = express.Router();
const TourismData = require('../models/TourismData');

// AI Alteration: Secured client-facing error handling
function sendSafeError(res, statusCode, message, code) {
  return res.status(statusCode).json({
    error: {
      message,
      code
    }
  });
}

// AI Alteration: Secured client-facing error handling
function handleRouteError(error, res, defaultMessage) {
  console.error('API route error:', error);
  if (error && error.code === 11000) {
    // AI Alteration: Added duplicate prevention logic
    return sendSafeError(res, 409, 'Duplicate data conflict.', 'DUPLICATE_CONFLICT');
  }
  if (error && error.name === 'MongooseServerSelectionError') {
    // AI Alteration: Improved MongoDB availability handling
    return sendSafeError(res, 503, 'Service temporarily unavailable. Please try again shortly.', 'DB_UNAVAILABLE');
  }
  return sendSafeError(res, 500, defaultMessage, 'INTERNAL_ERROR');
}

// Get all unique categories (groups)
// Used by the frontend to populate the "Visitor Category" dropdown.
router.get('/categories', async (req, res) => {
  try {
    const categories = await TourismData.distinct('group');
    res.json({ success: true, data: categories.sort() });
  } catch (error) {
    // AI Alteration: Secured client-facing error handling
    handleRouteError(error, res, 'Failed to load categories.');
  }
});

// Get all unique locations (indicators)
// Used by the frontend to populate the optional "Location" dropdown.
router.get('/locations', async (req, res) => {
  try {
    const locations = await TourismData.distinct('indicator');
    res.json({ success: true, data: locations.sort() });
  } catch (error) {
    // AI Alteration: Secured client-facing error handling
    handleRouteError(error, res, 'Failed to load locations.');
  }
});

// Calculate average length of stay
// Main calculator endpoint: validates input, fetches records, computes summary stats, then returns chart-ready yearly averages.
router.post('/calculate', async (req, res) => {
  try {
    const { category, location } = req.body;

    /*
    AI Analysis: Core Vulnerability
    Issue: request fields are only minimally validated (category required, location optional).
    Why it matters: malformed or unexpected input can cause errors or heavy queries.
    Where: `/calculate` request handling in this route.
    Later fix idea: add strict schema validation and allowed-value checks before querying.
    */
    if (!category) {
      // AI Alteration: Secured client-facing error handling
      return sendSafeError(res, 400, 'Category is required.', 'VALIDATION_ERROR');
    }

    // Build query
    // Query starts by group, then narrows to a specific indicator if location is selected.
    const query = { group: category };
    if (location) {
      query.indicator = location;
    }

    // Find matching records
    const records = await TourismData.find(query);

    if (records.length === 0) {
      // AI Alteration: Secured client-facing error handling
      return sendSafeError(res, 400, 'No data found for the specified criteria.', 'NO_DATA_FOUND');
    }

    // Collect all values
    // Flatten nested yearly data from each matched record into one list for calculations.
    const allValues = [];
    records.forEach(record => {
      record.yearlyData.forEach(yearData => {
        allValues.push({
          year: yearData.year,
          value: yearData.value,
          location: record.indicator
        });
      });
    });

    if (allValues.length === 0) {
      // AI Alteration: Secured client-facing error handling
      return sendSafeError(res, 400, 'No valid data points found.', 'NO_VALID_DATA');
    }

    // Calculate statistics
    // Compute overall average, minimum, and maximum across all matched year values.
    const values = allValues.map(v => v.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    const minEntry = allValues.find(v => v.value === min);
    const maxEntry = allValues.find(v => v.value === max);

    // Calculate year-over-year data for chart
    // Group values by year, then average each year so the frontend can draw a trend line.
    const yearlyAverages = {};
    allValues.forEach(item => {
      if (!yearlyAverages[item.year]) {
        yearlyAverages[item.year] = [];
      }
      yearlyAverages[item.year].push(item.value);
    });

    const chartData = Object.keys(yearlyAverages).sort().map(year => ({
      year,
      average: yearlyAverages[year].reduce((a, b) => a + b, 0) / yearlyAverages[year].length
    }));

    res.json({
      success: true,
      data: {
        category,
        location: location || 'All locations',
        statistics: {
          average: parseFloat(average.toFixed(2)),
          min: {
            value: min,
            year: minEntry.year,
            location: minEntry.location
          },
          max: {
            value: max,
            year: maxEntry.year,
            location: maxEntry.location
          },
          dataPoints: values.length
        },
        chartData
      }
    });

  } catch (error) {
    /*
    AI Analysis: Core Vulnerability
    Issue: raw internal error messages are returned to clients.
    Why it matters: error details can reveal backend internals and aid attackers.
    Where: catch blocks returning `error.message` in this router.
    Later fix idea: log detailed errors server-side and return generic client-safe messages.
    */
    // AI Alteration: Secured client-facing error handling
    handleRouteError(error, res, 'Calculation failed due to a server issue.');
  }
});

// Get all data (for admin/debugging)
/*
AI Analysis: Core Vulnerability
Issue: this endpoint exposes raw dataset records without authentication.
Why it matters: anyone with API access can scrape internal data at scale.
Where: `GET /data` route in this file.
Later fix idea: protect with authentication/authorization and disable in production.
*/
router.get('/data', async (req, res) => {
  try {
    const data = await TourismData.find().limit(100);
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    // AI Alteration: Secured client-facing error handling
    handleRouteError(error, res, 'Failed to load data.');
  }
});

module.exports = router;
