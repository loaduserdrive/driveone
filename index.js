const express = require('express');
const path = require('path');


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));

const submitRouter = require('./api/submit');
app.use('/api/submit', submitRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module) {
  app.listen(port, () => {
  console.log('Port running at localhost:3000');
  });
}

module.exports = app;