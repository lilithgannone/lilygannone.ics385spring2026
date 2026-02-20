/*
AI Comments to increase Understanding
This file is the browser-side controller for the server-backed LOS calculator page.
Data flow: page loads -> fetch categories/locations -> user submits form -> POST to `/api/calculate` -> render stats/chart.
It manages UI states (loading, errors, results) and updates Chart.js visuals.
*/
// API Base URL
const API_BASE = '/api';
// AI Alteration: Added timeout and controlled retry logic
const REQUEST_TIMEOUT_MS = 8000;
// AI Alteration: Added timeout and controlled retry logic
const MAX_GET_ATTEMPTS = 2;

// Global chart instance
let losChart = null;

// DOM Elements
const losForm = document.getElementById('losForm');
const categorySelect = document.getElementById('category');
const locationSelect = document.getElementById('location');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const resultsDiv = document.getElementById('results');
// AI Alteration: Accessibility improvement
const chartSummaryDiv = document.getElementById('chartSummary');

// AI Alteration: Added timeout and controlled retry logic
async function fetchWithTimeoutAndRetry(url, options = {}, config = {}) {
    const timeoutMs = config.timeoutMs || REQUEST_TIMEOUT_MS;
    const maxAttempts = config.maxAttempts || 1;
    let attempt = 0;
    let lastError = null;

    while (attempt < maxAttempts) {
        attempt += 1;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
        try {
            const response = await fetch(url, { ...options, signal: controller.signal });
            clearTimeout(timeoutId);

            let responseBody = null;
            try {
                responseBody = await response.json();
            } catch (parseError) {
                responseBody = null;
            }

            if (!response.ok) {
                const safeMessage = responseBody && responseBody.error && responseBody.error.message
                    ? responseBody.error.message
                    : 'Request failed.';
                const requestError = new Error(safeMessage);
                requestError.status = response.status;
                lastError = requestError;
                if (response.status >= 500 && attempt < maxAttempts) {
                    continue;
                }
                throw requestError;
            }

            // AI Alteration: Secured client-facing error handling
            if (!responseBody) {
                throw new Error('Unexpected server response.');
            }
            return responseBody;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                lastError = new Error('Request timed out. Please try again.');
            } else {
                lastError = error;
            }
            if (attempt < maxAttempts) {
                continue;
            }
        }
    }

    throw lastError || new Error('Request failed.');
}

// Initialize the app
// Startup sequence: load dropdown data first, then attach form event handlers.
async function init() {
    try {
        await loadCategories();
        await loadLocations();
        setupEventListeners();
    } catch (error) {
        showError('Failed to initialize application: ' + error.message);
    }
}

// Load categories from API
// Calls backend endpoint and fills category options in the form.
async function loadCategories() {
  try {
        /*
        AI Analysis: Core Vulnerability
        Issue: network calls do not check `response.ok` before parsing JSON.
        Why it matters: non-JSON error pages can cause runtime failures and weak error handling.
        Where: fetch calls in `loadCategories`, `loadLocations`, and form submit.
        Later fix idea: verify HTTP status/content-type before `response.json()`.
        */
        // AI Alteration: Added timeout and controlled retry logic
        const data = await fetchWithTimeoutAndRetry(`${API_BASE}/categories`, {}, {
            timeoutMs: REQUEST_TIMEOUT_MS,
            maxAttempts: MAX_GET_ATTEMPTS
        });

        if (data.success) {
            categorySelect.innerHTML = '<option value="">-- Select Category --</option>';
            data.data.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        } else {
            // AI Alteration: Secured client-facing error handling
            throw new Error(data.error && data.error.message ? data.error.message : 'Failed to load categories');
        }
    } catch (error) {
        showError('Error loading categories: ' + error.message);
    }
}

// Load locations from API
// Calls backend endpoint and fills location options in the form.
async function loadLocations() {
    try {
        // AI Alteration: Added timeout and controlled retry logic
        const data = await fetchWithTimeoutAndRetry(`${API_BASE}/locations`, {}, {
            timeoutMs: REQUEST_TIMEOUT_MS,
            maxAttempts: MAX_GET_ATTEMPTS
        });

        if (data.success) {
            locationSelect.innerHTML = '<option value="">-- All Locations --</option>';
            data.data.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
        } else {
            // AI Alteration: Secured client-facing error handling
            throw new Error(data.error && data.error.message ? data.error.message : 'Failed to load locations');
        }
    } catch (error) {
        showError('Error loading locations: ' + error.message);
    }
}

// Setup event listeners
// Binds form submit/reset events to their handler functions.
function setupEventListeners() {
    losForm.addEventListener('submit', handleFormSubmit);
    losForm.addEventListener('reset', handleFormReset);
}

// Handle form submission
// Sends selected filters to the API and then displays computed LOS results.
async function handleFormSubmit(e) {
    e.preventDefault();

    const category = categorySelect.value;
    const location = locationSelect.value;

    if (!category) {
        showError('Please select a category');
        return;
    }

    hideError();
    hideResults();
    showLoading();

    try {
        /*
        AI Analysis: Core Vulnerability
        Issue: there is no request timeout or retry behavior for slow/unreachable API calls.
        Why it matters: users can be stuck waiting and may see inconsistent reliability.
        Where: POST `/calculate` request in `handleFormSubmit`.
        Later fix idea: use AbortController timeouts and controlled retry strategy.
        */
        // AI Alteration: Added timeout and controlled retry logic
        const data = await fetchWithTimeoutAndRetry(`${API_BASE}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ category, location })
        }, {
            timeoutMs: REQUEST_TIMEOUT_MS,
            maxAttempts: 1
        });

        if (data.success) {
            displayResults(data.data);
        } else {
            // AI Alteration: Secured client-facing error handling
            throw new Error(data.error && data.error.message ? data.error.message : 'Calculation failed');
        }
    } catch (error) {
        showError('Error calculating results: ' + error.message);
    } finally {
        hideLoading();
    }
}

// Handle form reset
function handleFormReset() {
    hideError();
    hideResults();
}

// Display results
// Writes API result values into the DOM and then draws the trend chart.
function displayResults(data) {
    // Update result header
    document.getElementById('resultCategory').textContent = data.category;
    document.getElementById('resultLocation').textContent = data.location;

    // Update statistics
    const stats = data.statistics;
    document.getElementById('avgValue').textContent = stats.average.toFixed(2);
    document.getElementById('minValue').textContent = stats.min.value.toFixed(2);
    document.getElementById('minDetail').textContent =
        `${stats.min.year} - ${stats.min.location}`;
    document.getElementById('maxValue').textContent = stats.max.value.toFixed(2);
    document.getElementById('maxDetail').textContent =
        `${stats.max.year} - ${stats.max.location}`;
    document.getElementById('dataPoints').textContent = stats.dataPoints;

    // Create chart
    createChart(data.chartData);
    // AI Alteration: Accessibility improvement
    if (chartSummaryDiv && data.chartData.length > 0) {
        // AI Alteration: Accessibility improvement
        chartSummaryDiv.textContent = `Trend summary: ${data.chartData.length} yearly points from ${data.chartData[0].year} to ${data.chartData[data.chartData.length - 1].year}.`;
    }

    // Show results
    showResults();
}

// Create chart using Chart.js
// Converts yearly averages into a line chart for quick trend comparison.
function createChart(chartData) {
    const ctx = document.getElementById('losChart').getContext('2d');

    // Destroy existing chart if it exists
    if (losChart) {
        losChart.destroy();
    }

    const labels = chartData.map(d => d.year);
    const values = chartData.map(d => d.average);

    losChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Length of Stay (days)',
                data: values,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return 'Average: ' + context.parsed.y.toFixed(2) + ' days';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Days'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(1);
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// UI Helper functions
// These helpers toggle visibility and show feedback messages for users.
function showLoading() {
    loadingDiv.style.display = 'block';
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideError() {
    errorDiv.style.display = 'none';
}

function showResults() {
    resultsDiv.style.display = 'block';
    // Scroll to results
    resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function hideResults() {
    resultsDiv.style.display = 'none';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
