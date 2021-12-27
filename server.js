const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3002;
const fetch = require('node-fetch');


fetch(
  process.env.URL_CURRENCIES,
  {
    method: "Get"
  },
).then(res => res.json())
  .then((currencies) => {
    const initialCurrencies = Object.fromEntries(
      Object.entries(currencies.rates)
        .filter(([key]) =>
          (key === 'USD') ||
          (key === 'EUR') ||
          (key === 'BYN') ||
          (key === 'RUB')
        ).reverse())

    let usdKoef = currencies.rates.USD;

    app.post('/filtered', (req, res) => {
      const CODE_OF_ADD = 1;
      const CODE_OF_CHANGE = 2;

      const chosenCurrency = req.body.currencyToChange;

      if (req.body.codeOfMethod === CODE_OF_ADD) {

        initialCurrencies[chosenCurrency] = currencies.rates[chosenCurrency] * usdKoef;
        res.json(initialCurrencies);

      } else if (req.body.codeOfMethod === CODE_OF_CHANGE) {
        const inputValue =
          req.body.valueAfterChange === 0 &&
            req.body.valueAfterChange === '' ? 1 :
            req.body.valueAfterChange;
 
        usdKoef = inputValue / currencies.rates[chosenCurrency];

        Object.entries(initialCurrencies)
          .map(([key]) => initialCurrencies[key] = currencies.rates[key] * usdKoef);

        initialCurrencies[chosenCurrency] = Number(inputValue);
        res.json(initialCurrencies);
      }
    });

    app.get('/filtered', (req, res) => {
      res.json(initialCurrencies);
    });

    app.get('/', (req, res) => {
      res.json(currencies.rates);
    });
  })

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})

