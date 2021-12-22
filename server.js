const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3002;
// import fetch from 'node-fetch';
const fetch = require('node-fetch');
// import fetch from 'node-fetch';
const url = "https://api.exchangerate.host/latest?base=USD&places=2&";
const settings = { method: "Get"};
fetch(url, settings)
    .then(res => res.json())
    .then((currencies) => {
     const initialCurrencies = Object.fromEntries(
       Object.entries(currencies.rates)
     .filter(([key,value]) => 
      (key === 'USD') || 
      (key === 'EUR') ||
      (key === 'BYN') ||
      (key === 'RUB')
      ))

        app.get('/filtered', (req, res) => {
            res.json(initialCurrencies);
          });

        app.post('/filtered', (req, res) => {
          console.log(req.body.key);
          const currencyToAdd = req.body.key;
         const filteredCurrencies = Object.assign(initialCurrencies, Object.fromEntries(
           Object.entries(currencies.rates)
           .filter(([key,value]) =>
           key === currencyToAdd
           )
         ))
          res.json(filteredCurrencies);
        });

        app.get('/', (req, res) => {
          res.json(currencies.rates);
        });
          console.log(initialCurrencies);
          console.log(currencies.rates);
    })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
