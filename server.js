const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/swim-ui-angular/browser')));

// Catch all routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/swim-ui-angular/browser', 'index.html'));
});

// Start the app by listening on the default port or the one specified in the environment
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
