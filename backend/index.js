const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname,'../frontend')));

// Default route (serving 'new.html' as the homepage)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/new.html'));
});

// Additional routes for specific pages
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, '../frontend/about.html')));
app.get('/aibot', (req, res) => res.sendFile(path.join(__dirname, '../frontend/aibot.html')));
app.get('/links', (req, res) => res.sendFile(path.join(__dirname, '../frontend/links.html')));
app.get('/news', (req, res) => res.sendFile(path.join(__dirname, '../frontend/news.html')));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});