# Crimes Dashboard

A full-stack web application for visualizing crime statistics across India using an interactive map interface.

## Features

- Interactive map visualization of crime rates across Indian states
- Detailed state-wise crime statistics
- Yearly breakdown of various crime categories
- Color-coded visualization for better data representation

## Tech Stack

### Frontend
- React.js
- react-simple-maps for geographical visualization
- d3-scale for data scaling
- Material-UI for styling

### Backend
- Node.js
- Express.js
- MySQL database

## Setup Instructions

1. Clone the repository
```bash
git clone <repository-url>
cd crimes-dashboard
```

2. Install dependencies for both client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Start the application
```bash
# Start the server (from server directory)
npm start

# Start the client (from client directory)
cd ../client
npm start
```

The application should now be running on http://localhost:3000

## Project Structure
```
AstraZeneca/
├── client/
│   ├──crimes-dashboard               # Frontend React application
│       ├── public/
│       ├── src/
│       │   ├── components/
│       │   └── ...
│       └── package.json
├── server/                           # Backend Node.js application
│   ├── routes/
│   ├── lib/
│   └── package.json
└── README.md
```

## API Documentation

The server provides the following endpoints:

- `GET /api/crimes` - Get aggregated crime data by state
- `GET /api/crimes/:state` - Get crime trends over years for a specific state
- `GET /api/crimes/stats/overall` - Get overall statistics

## Author
Nagappan S