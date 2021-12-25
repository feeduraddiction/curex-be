const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3002;
const fetch = require('node-fetch');
const url = "https://api.exchangerate.host/latest?base=USD&places=4&";
const settings = { method: "Get" };


fetch(url, settings)
  .then(res => res.json())
  .then((currencies) => {
    let initialCurrencies = Object.fromEntries(
      Object.entries(currencies.rates)
        .filter(([key, value]) =>
          (key === 'USD') ||
          (key === 'EUR') ||
          (key === 'BYN') ||
          (key === 'RUB')
        ))

    let usdKoef = currencies.rates.USD;
    let changedCurrencies = initialCurrencies;
    let currensciesToDisplay = initialCurrencies;

    app.post('/filtered', (req, res) => {

      const chosenCurrency = req.body.currencyToChange;

      if (req.body.codeOfMethod === 1) {
        currensciesToDisplay = Object.assign(    // assign for concating old object + a new one
          changedCurrencies, 
          Object.fromEntries(  
          Object.entries(currencies.rates)
            .filter(([key, value]) => key === chosenCurrency)
            .map(([key, value]) => [key, (value * usdKoef)])   // multiply added currency
        ))

        // currensciesToDisplay.USD = usdKoef;
        initialCurrencies = currensciesToDisplay;
        res.json(initialCurrencies);

      } else if (req.body.codeOfMethod === 2) {

        const inputValue = req.body.valueAfterChange === 0 &&
          req.body.valueAfterChange === '' ? 1 : req.body.valueAfterChange;


        usdKoef = inputValue / currencies.rates[chosenCurrency];          //get the koef for calculating all the currencies

        changedCurrencies = Object.fromEntries(
          Object.entries(currensciesToDisplay)
            .map(([key, value]) => [key, currencies.rates[key] * usdKoef])
        )

        changedCurrencies[chosenCurrency] = inputValue;
        initialCurrencies = changedCurrencies;
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
  console.log(`Example app listening at http://localhost:${port}`)
})
