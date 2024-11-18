const express = require('express');
const router = express.Router();
const db = require('../lib/dbConnect');

// Get aggregated crime data by state
router.get('/crimes', (req, res) => {
    const sql = `
        SELECT
            state,
            SUM(rape_cases) as rape_cases,
            SUM(kidnap_assault) as kidnap_assault,
            SUM(dowry_deaths) as dowry_deaths,
            SUM(assault_on_women) as assault_on_women,
            SUM(assault_on_modesty) as assault_on_modesty,
            SUM(domestic_violence) as domestic_violence,
            SUM(women_trafficking) as women_trafficking,
            SUM(rape_cases + kidnap_assault + dowry_deaths + assault_on_women + 
                assault_on_modesty + domestic_violence + women_trafficking) as total_crimes
        FROM crimes_against_women
        GROUP BY state
        ORDER BY total_crimes DESC;
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({
                error: 'Internal server error',
                details: error.message
            });
        }

        // Transform the results to include percentages and rankings
        const transformedResults = results.map((state, index) => ({
            ...state,
            rank: index + 1,
            crimeBreakdown: {
                rape: ((state.rape_cases / state.total_crimes) * 100).toFixed(1),
                kidnap: ((state.kidnap_assault / state.total_crimes) * 100).toFixed(1),
                dowry: ((state.dowry_deaths / state.total_crimes) * 100).toFixed(1),
                assault: ((state.assault_on_women / state.total_crimes) * 100).toFixed(1),
                modesty: ((state.assault_on_modesty / state.total_crimes) * 100).toFixed(1),
                domestic: ((state.domestic_violence / state.total_crimes) * 100).toFixed(1),
                trafficking: ((state.women_trafficking / state.total_crimes) * 100).toFixed(1)
            }
        }));

        res.json(transformedResults);
    });
});

// Get crime trends over years for a specific state
router.get('/crimes/:state', (req, res) => {
    const state = req.params.state;
    const sql = `
        SELECT 
            year,
            rape_cases,
            kidnap_assault,
            dowry_deaths,
            assault_on_women,
            assault_on_modesty,
            domestic_violence,
            women_trafficking,
            (rape_cases + kidnap_assault + dowry_deaths + assault_on_women + 
             assault_on_modesty + domestic_violence + women_trafficking) as total_crimes
        FROM crimes_against_women
        WHERE state = ?
        ORDER BY year ASC;
    `;

    db.query(sql, [state], (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({
                error: 'Internal server error',
                details: error.message
            });
        }
        res.json(results);
    });
});

// Get overall statistics
router.get('/crimes/stats/overall', (req, res) => {
    const sql = `
        SELECT 
            SUM(rape_cases) as total_rape_cases,
            SUM(kidnap_assault) as total_kidnap_assault,
            SUM(dowry_deaths) as total_dowry_deaths,
            SUM(assault_on_women) as total_assault_on_women,
            SUM(assault_on_modesty) as total_assault_on_modesty,
            SUM(domestic_violence) as total_domestic_violence,
            SUM(women_trafficking) as total_women_trafficking,
            COUNT(DISTINCT state) as total_states,
            MIN(year) as start_year,
            MAX(year) as end_year
        FROM crimes_against_women;
    `;

    db.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error);
            return res.status(500).json({
                error: 'Internal server error',
                details: error.message
            });
        }
        res.json(results[0]);
    });
});

module.exports = router;