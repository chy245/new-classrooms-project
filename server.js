const bodyParser = require('body-parser');
const express = require('express');
const http = require('http')
const path = require('path');

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log('running'));

app.route('/api/get_test').get((req, res) => {
  console.log('got a get request');
  console.log(req.body);
  res.send("GET received, response returned");
});

app.route('/api/post_test').post((req, res) => {
  console.log('got a post request');
  console.log(req.body);
  res.send("POST received, response returned");
});
