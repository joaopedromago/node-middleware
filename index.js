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
    body: req.body,
    method: req.method.toLowerCase(),
    url: req.path,
    baseURL: pointUrl,
    auth: req.auth,
    params: req.params,
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
    res.send(error.response.data).status(error.response.status);
  } else {
    res.send(result.data).status(result.status);
  }
});

app.listen(port, () => {
  console.log(`Middleware listening at http://localhost:${port}`);
});
