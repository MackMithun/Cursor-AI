# Currency Converter

React + TypeScript app that converts amounts between currencies using live rates from the [Frankfurter API](https://www.frankfurter.app/) (no API key required).

## Features

- Enter an amount and convert between two different currencies
- Swap currencies with one click
- Live rates from Frankfurter on "Get Exchange Rate"
- Dynamic currency list and flag emojis (when a country code can be derived)
- Amount limited to 12 digits before the decimal
- Same currency disabled in the opposite dropdown
- Result clears when amount or currencies change

## Commands

```bash
cd currency-converter
npm install
npm run dev      # http://localhost:5173
npm run test     # Vitest unit tests
npm run build    # production build
```

## Note on NPR

Frankfurter does not list NPR (Nepalese Rupee). The app defaults to **USD → EUR**. For a mocked NPR demo (e.g. `1 USD = 118.16 NPR`), you would need a different API or a local fallback rate table.
