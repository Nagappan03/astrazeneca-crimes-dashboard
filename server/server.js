const express = require('express');
const app = express();
const cors = require('cors');

const crimeRoutes = require('./routes/crimeRoutes');
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use('/api', crimeRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});