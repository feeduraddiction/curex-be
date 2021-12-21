const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors())
const port = 3002;
// import fetch from 'node-fetch';
const fetch = require('node-fetch');
// import fetch from 'node-fetch';
const url = "https://www.nbrb.by/api/exrates/rates?periodicity=0";
const settings = { method: "Get", base: "USD" };

fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        app.get('/', (req, res) => {
            res.json(json);
          });
    })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
