const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'app.html'));
});

if (require.main === module) {
  app.listen(port, () => {
  });
}

module.exports = app;