# Hawaii Tourism Length of Stay Calculator

A web application to calculate and visualize average length of stay for Hawaii tourism data using MongoDB, Express.js, and vanilla JavaScript.

## Changes Made
- Secure client-facing error messaging: added safe error responses. Detailed logging on server-side only. Initially, raw error messages were returned to users.
- CDN validation added to both index.html files using integrity checks to enhance security and prevent tampering. 
- SRI protection added to external CDN scripts for Chart.js and PapaParse-- same issue as above. Initially, the external CDN script is loaded without integrity attributes, which can cause a security issue. 
- Import data-loss prevention: removed wipe and added a safer import process. There was initially a data-loss risk. All records are deleted prior to validating that the import was successful. 
- MongoDB availability handling: added retry logic with limited attempts, connection event handling, and DB-availability gate middleware. Initially, the app exited immediately if MongoDB is unavailable.
- Dupicate prevention logic added to TourismData.js and server logic. Initially, there was nothing in place preventing duplicate group indicator datasets. This can create a data reliability issue. 
- Timeout/ retry behavior improvements: added frontend timeout, enabled controlled retry for GET requests. No retry for POST. Initially, there was no request timeout or retry behavior and no messages for users, meaning they may be stuck waiting. 
- Minor accessibility improvements: added a very minor chart text summary and live regions for loading/error/results. To improve accessibility, a small description of the data sets included was added to the UI, and live regions were implemented to assist screen reader users.
- Prompted to add AI comments throughout the code explaining existing code and alterations. AI comments also added to the README files (not here, in their own separate section), noting changes. 
- Updated /standalone/data.csv file to reflect more recent data. 

## Features

- Interactive web form to select visitor categories and locations
- Real-time calculation of average length of stay statistics
- Beautiful data visualizations with Chart.js
- RESTful API backend with MongoDB database
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally on port 27017)
- CSV data file: `Hawaii Tourism Data (from DBEDT Data Warehouse) (1).csv`

## Installation

1. Install dependencies:
```bash
cd hawaii-los-web
npm install
```

2. Make sure MongoDB is running:
```bash
# On macOS with Homebrew
brew services start mongodb-community

# Or manually
mongod
```

3. Import the CSV data into MongoDB:
```bash
npm run import
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

3. Use the web form to:
   - Select a visitor category (e.g., "All visitors by air")
   - Optionally select a specific location (or leave blank for all locations)
   - Click "Calculate" to see results

## API Endpoints

### GET /api/categories
Returns all available visitor categories.

### GET /api/locations
Returns all available locations.

### POST /api/calculate
Calculate average length of stay.

**Request Body:**
```json
{
  "category": "All visitors by air",
  "location": "LOS Statewide"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "category": "All visitors by air",
    "location": "LOS Statewide",
    "statistics": {
      "average": 9.26,
      "min": {
        "value": 8.8,
        "year": "2019",
        "location": "LOS Statewide"
      },
      "max": {
        "value": 10.6,
        "year": "2020",
        "location": "LOS Statewide"
      },
      "dataPoints": 23
    },
    "chartData": [...]
  }
}
```

## Project Structure

```
hawaii-los-web/
├── models/
│   └── TourismData.js      # MongoDB schema
├── routes/
│   └── api.js              # API routes
├── public/
│   ├── index.html          # Main HTML page
│   ├── styles.css          # Styles
│   └── app.js              # Frontend JavaScript
├── scripts/
│   └── importData.js       # CSV import script
├── server.js               # Express server
├── package.json
├── .env                    # Environment variables
└── README.md
```

## Available Categories

- All visitors by air
- Hotel-only visitors
- First-time visitors
- Honeymoon visitors
- Condo-only visitors
- Repeat visitors
- Get-married visitors
- Timeshare-only visitors
- MCI visitors
- Rental house visitors
- B&B visitors
- Family visitors
- Visiting Friends/Relatives

## Available Locations

- LOS Statewide
- LOS on Oahu
- LOS on Maui
- LOS on Molokai
- LOS on Lanai
- LOS on Kauai
- LOS on Hawaii Island
- LOS in Hilo
- LOS in Kona

## Data Source

Hawaii Tourism Authority (via DBEDT Data Warehouse)
Data covers years 1999-2021

## Development

For development with auto-reload:
```bash
npm run dev
```

## License

ISC

## AI Alterations – Security & Reliability Improvements

**AI Alteration:**
- Secured API error responses to return user-safe error objects with message/code shape and server-side detailed logging only.

**AI Alteration:**
- Added MongoDB availability guard and retry connection logic so API returns 503 safely when the database is unavailable.

**AI Alteration:**
- Added duplicate-prevention with a unique index on `group + indicator` and duplicate conflict handling paths.

**AI Alteration:**
- Updated CSV import flow to avoid destructive data wipe and use safe upsert behavior with inserted/updated/skipped import summary output.

**AI Alteration:**
- Added request timeout and controlled retry logic in the frontend (GET retries only, no retry for POST calculate request).

**AI Alteration:**
- Added accessibility improvements including live regions for loading/error/results and a text summary for chart content.

**AI Alteration:**
- Added SRI (`integrity`) and `crossorigin="anonymous"` attributes for external CDN scripts used by the application.
