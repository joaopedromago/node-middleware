const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { to } = require('nh-utils');
const app = express();

app.use(bodyParser.json());

const port = 3000;
const pointUrl = 'http://localhost:1444';

app.all('*', async (req, res) => {
  const config = {
    headers: req.headers,
    auth: req.auth,
  };

  const [error, result] = await to(
    req.method == 'GET'
      ? axios.get(`${pointUrl}${req.url}`, config)
      : req.method == 'DELETE'
      ? axios.delete(`${pointUrl}${req.url}`, config)
      : req.method == 'HEAD'
      ? axios.head(`${pointUrl}${req.url}`, config)
      : req.method == 'OPTIONS'
      ? axios.options(`${pointUrl}${req.url}`, config)
      : req.method == 'POST'
      ? axios.post(`${pointUrl}${req.url}`, req.body, config)
      : req.method == 'PUT'
      ? axios.put(`${pointUrl}${req.url}`, req.body, config)
      : axios.patch(`${pointUrl}${req.url}`, req.body, config),
  );

  if (error) {
    res.status(error.response.status).send(error.response.data);
  } else {
    res.status(result.status).send(result.data);
  }
});

app.listen(port, () => {
  console.log(`Middleware listening at http://localhost:${port}`);
});
