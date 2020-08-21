const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { to } = require('nh-utils');
const app = express();

app.use(bodyParser.json());

const port = 3000;
const pointUrl = 'http://localhost:1444';

app.all('*', async (req, res) => {
  const [error, result] = await to(
    axios.post(`${pointUrl}${req.url}`, req.body, {
      headers: req.headers,
      body: req.body,
      method: req.method,
    }),
  );

  if (error) {
    res.send(error.response.data).status(error.response.status);
  } else {
    res.send(result.data).status(result.status);
  }
});

app.listen(port, () => {
  console.log(`Middleware listening at http://localhost:${port}`);
});
