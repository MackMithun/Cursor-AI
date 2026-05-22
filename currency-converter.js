class CurrencyConverter {
    // Rates: units of each currency per 1 USD (approximate defaults)
    static DEFAULT_RATES = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.5,
        CNY: 7.24,
        INR: 82.5,
        MXN: 19.5,
        ARS: 300.0,
        BRL: 5.5,
        CLP: 800.0,
        COP: 4000.0,
        PEN: 3.5,
        BOB: 6.5,
        UYU: 35.0,
        PYG: 7000.0,
        UAH: 38.0,
        KRW: 1300.0,
        HKD: 7.8,
        SGD: 1.4,
        MYR: 4.5,
        PHP: 55.0,
        IDR: 15000.0,
        THB: 35.0,
    };

    constructor(amount, fromCurrency, toCurrency, rates = CurrencyConverter.DEFAULT_RATES) {
        this.amount = amount;
        this.fromCurrency = this.normalizeCurrency(fromCurrency);
        this.toCurrency = this.normalizeCurrency(toCurrency);
        this.rates = rates;
    }

    normalizeCurrency(code) {
        return code.toUpperCase();
    }

    getRate(currencyCode) {
        const rate = this.rates[currencyCode];
        if (rate == null) {
            const supported = Object.keys(this.rates).join(', ');
            throw new Error(`Unsupported currency "${currencyCode}". Supported: ${supported}`);
        }
        return rate;
    }

    convert() {
        const fromRate = this.getRate(this.fromCurrency);
        const toRate = this.getRate(this.toCurrency);
        const exchangeFactor = toRate / fromRate;
        return this.amount * exchangeFactor;
    }
}

module.exports = { CurrencyConverter };
