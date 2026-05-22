const { CurrencyConverter } = require('./currency-converter');

/** Converts amount from one currency to another using the given or default rates. */
function convertCurrency(amount, fromCurrency, toCurrency, rates = CurrencyConverter.DEFAULT_RATES) {
    const converter = new CurrencyConverter(amount, fromCurrency, toCurrency, rates);
    return converter.convert();
}

function getCurrencyRates() {
    return CurrencyConverter.DEFAULT_RATES;
}

module.exports = { convertCurrency, getCurrencyRates };
