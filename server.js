const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3002;
const fetch = require('node-fetch');
const url = "https://api.exchangerate.host/latest?base=USD&places=2&";
const settings = { method: "Get" };


fetch(url, settings)
  .then(res => res.json())
  .then((currencies) => {
    const initialCurrencies = Object.fromEntries(
      Object.entries(currencies.rates)
        .filter(([key, value]) =>
          (key === 'USD') ||
          (key === 'EUR') ||
          (key === 'BYN') ||
          (key === 'RUB')
        ))

    const changeValueHandler = (req, res) => {
      const inputValue = req.body.valueAfterChange === 0 ? 1 : req.body.valueAfterChange;
      const focusedCurrency = req.body.currencyToChange;
      const usdKoef = inputValue / initialCurrencies[focusedCurrency];
      const newObject = Object.fromEntries(
        Object.entries(initialCurrencies)
          .map(([key, value]) => [key, value * usdKoef])
      )
      newObject.USD = usdKoef;
      res.json(newObject);
    }

    const addCurrencyHandler = (req, res) => {
      const currencyToAdd = req.body.key;
      const currensciesToDisplay = Object.assign(initialCurrencies, Object.fromEntries(
        Object.entries(currencies.rates)
          .filter(([key, value]) =>
            key === currencyToAdd
          )
      ))
      res.json(currensciesToDisplay);
    }

    app.get('/filtered', (req, res) => {
      res.json(initialCurrencies);
    });

    app.post('/filtered', (req, res) => {
      if (req.body.codeOfMethod === 1) {
        addCurrencyHandler(req,res);
      } else if (req.body.codeOfMethod === 2) {
        changeValueHandler(req, res);
      }

    });

    app.get('/', (req, res) => {
      res.json(currencies.rates);
    });
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
