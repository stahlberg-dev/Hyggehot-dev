//region SHOP
const shop = {
    cart: {
        // выбранный основной товар
        productCode: 'hygge',

        // кол-во основного товара
        productQuantity: 1,

        // корзина доп товаров {code: quantity}, установить кол-во 0 чтобы выключить из корзины
        additionalProducts: {},

        // примененный промокод, если есть
        promoCode: '',
    },

    // все виды цен и скидок на текущую корзину
    prices: {
        actual: false, // во время асинхронного обновления цены ниже временно не актуальны

        priceEnd: null, // конечная цена (с учетом скидок и промокодов)

        priceBase: null, // базовая цена - без скидки по промокоду (если нет промокода =price)

        priceOld: null, // зачеркнутая цена

        priceCredit: null, // цена для покупки в рассрочку/долями

        // базовая скидка цена относительно зачеркнутой (priceOld - priceBase)
        getDiscountBase() {
            if (! this.priceOld || ! this.priceBase) return 0;

            return Math.max(this.priceOld - this.priceBase);
        },

        // только скидка по промокоду
        getDiscountPromoCode() {
            if (!this.priceBase || !this.priceEnd) return 0;

            return Math.max(this.priceBase - this.priceEnd, 0);
        },

        // полная скидка (конечная цена относительно зачеркнутой)
        getTotalDiscount() {
            if (! this.priceOld || ! this.priceEnd) return 0;

            return Math.max(this.priceOld - this.priceEnd);
        },
    },

    cache: {
        // статус загрузки основных цен
        basePricesLoaded: false,

        // коллбэки для запуска после загрузки цен
        basePricesLoadingCallbacks: [],

        // все базовые цены, включая доп товары {code: price}
        prices: {},

        // все зачеркнутые цены, включая доп товары {code: priceOld}
        pricesOld: {},

        // все цены для покупки в кредит
        pricesCredit: {},

        // кеш цен на корзины, включая цены с промокодом
        carts: {},
    },

    async ajaxCall(url, data) {
        let options = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            headers: {},
        };

        if (typeof (data) === 'object') {
            if (data instanceof FormData) {
                // FormData
                options.body = data;
                //options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            } else {
                options.body = JSON.stringify(data);
                options.headers['Content-Type'] = 'application/json';
            }
        }

        const response = await fetch(url, options);

        return await response.json();
    },

    siteApi(action, data) {
        if (data instanceof FormData) {
            data.append('action', action);

            let trackingData = this.getTrackingData();
            for (let key in trackingData) {
                data.append(`tracking[${key}]`, trackingData[key]);
            }
        } else {
            data.action = action;
            data.tracking = this.getTrackingData();
        }

        return this.ajaxCall('/api/', data)
    },

    getTrackingData() {
        return {
            b24_trace: this.getBX24Trace(),
        };
    },

    getBX24Trace() {
        return ('b24Tracker' in window) ? b24Tracker.guest.getTrace() : null;
    },

    checkPromoCode(code, cb) {
        this.cart.promoCode = null;
        this.siteApi('check-promo-code', {code}).then((response) => {
            if (response.active) {
                this.cart.promoCode = code;
            }
            if (cb) cb(response);
        });
    },

    hasProduct(code) {
        return code in this.cache.prices
    },

    getPrice(code) {
        return this.cache.prices[code]
    },

    getOldPrice(code) {
        return this.cache.pricesOld[code]
    },

    // все выбранные товары в корзине, включая основной товар
    getCartItems() {
        let products = [];
        products.push({code: this.cart.productCode, quantity: this.cart.productQuantity});
        for (let code in this.cart.additionalProducts) {
            let quantity = this.cart.additionalProducts[code];
            if (quantity > 0) {
                products.push({code: code, quantity: quantity});
            }
        }

        if (products.length > 1) {
            const collator = new Intl.Collator();
            products.sort((a, b) => collator.compare(a.code, b.code))
        }

        let items = {};
        products.forEach(p => items[p.code] = p.quantity);

        return items;
    },

    // хэш состояния корзины
    getCachePriceKey() {
        return JSON.stringify(this.getCartItems()) + this.cart.promoCode;
    },

    getCachePrice(key) {
        return this.cache.carts[key] || null;
    },

    setCachePrice(key, price) {
        this.cache.carts[key] = price;
    },

    loadEndPrice(cb) {
        this.siteApi('price', {
            code: this.cart.promoCode,
            cart: this.getCartItems(),
        }).then((response) => {
            if (cb) cb(response);
        });
    },

    loadBasePrices(cb) {
        if (this.cache.basePricesLoaded) {
            if (cb) cb();
            return;
        } else {
            this.cache.basePricesLoadingCallbacks.push(cb);
        }

        this.siteApi('prices', {}).then((response) => {
            this.cache.prices = response.prices;
            this.cache.pricesOld = response.pricesOld;
            this.cache.pricesCredit = response.pricesCredit;
            this.cache.basePricesLoaded = true;
            this.cache.basePricesLoadingCallbacks.forEach((cb) => cb());
            this.cache.basePricesLoadingCallbacks = [];
        });
    },

    updatePriceBase() {
        this.prices.priceBase = null;
        const items = this.getCartItems();
        let price = 0;
        for (let code in items) {
            if (! items.hasOwnProperty(code)) continue;
            let quantity = items[code];
            if (! this.cache.prices[code]) {
                console.warn(`no price for ${code}`);
                return;
            }
            let priceItem = this.cache.prices[code];
            price += priceItem * quantity;
        }
        this.prices.priceBase = price;
    },

    updatePriceCredit() {
        this.prices.priceCredit = null;
        const items = this.getCartItems();
        let price = 0;
        for (let code in items) {
            if (! items.hasOwnProperty(code)) continue;
            let quantity = items[code];
            if (! this.cache.pricesCredit[code]) {
                console.warn(`no price for ${code}`);
                return;
            }
            let priceItem = this.cache.pricesCredit[code];
            price += priceItem * quantity;
        }
        this.prices.priceCredit = price;
    },

    updatePriceOld() {
        this.prices.priceOld = null;
        const items = this.getCartItems();
        let price = 0;
        for (let code in items) {
            if (! items.hasOwnProperty(code)) continue;
            let quantity = items[code];
            if (! this.cache.pricesOld[code]) {
                console.warn(`no price for ${code}`);
                return;
            }
            let priceItem = this.cache.pricesOld[code];
            price += priceItem * quantity;
        }
        this.prices.priceOld = price;
    },

    updatePriceEnd(cb) {
        this.prices.priceEnd = null;
        let cacheKey = this.getCachePriceKey();
        let price = this.getCachePrice(cacheKey);
        if (price) {
            this.prices.priceEnd = price;
            cb();
        } else {
            if (this.cart.promoCode) {
                this.loadEndPrice((response) => {
                    let price = response.price;
                    this.prices.priceEnd = price;
                    this.setCachePrice(cacheKey, price);
                    cb();
                })
            } else {
                this.prices.priceEnd = this.prices.priceBase;
                cb();
            }
        }
    },

    updatePrice(cb) {
        this.prices.actual = false;
        this.loadBasePrices(() => {
            // local
            this.updatePriceBase();
            this.updatePriceOld();
            this.updatePriceCredit();
            // remote
            this.updatePriceEnd(() => {
                this.prices.actual = true;
                if (cb) cb();
            });
        });
    },

    makeOrder(user, cb) {
        this.siteApi('make-order', {
            code: this.cart.promoCode,
            cart: this.getCartItems(),
            user: user,
        }).then((response) => {
            if (cb) cb(response);
        });
    },

    optRequest(user, cb) {
        this.siteApi('opt-request', user).then((response) => {
            if (cb) cb(response);
        });
    },

    isTinkoffScriptLoaded: false,

    tinkoffScriptRun(cb) {
        if (this.isTinkoffScriptLoaded) {
            if (cb) cb();
        } else {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://forma.tinkoff.ru/static/onlineScript.js';
            script.onload = () => {
                this.isTinkoffScriptLoaded = true;
                if (('tinkoff' in window)) {
                    if (cb) cb();
                } else {
                    console.error("tinkoff lib is not loaded");
                }
            };
            const head = document.querySelector('head');
            head.appendChild(script);
        }
    },

    makeCreditTinkoff(onMessage, cbFail) {
        this.siteApi('make-credit-request', {
            cart: this.getCartItems(),
        }).then((response) => {
            this.tinkoffScriptRun(() => {
                if (response.status && response.fields) {
                    // tinkoff.createDemo(response.fields, {
                    tinkoff.create(response.fields, {
                        view: 'modal',
                    });
                    if (onMessage) {
                        tinkoff.methods.on(tinkoff.constants.SUCCESS, onMessage);
                        tinkoff.methods.on(tinkoff.constants.APPROVED, onMessage);
                        tinkoff.methods.on(tinkoff.constants.APPOINTED, onMessage);
                        tinkoff.methods.on(tinkoff.constants.REJECT, onMessage);
                        tinkoff.methods.on(tinkoff.constants.CANCEL, onMessage);
                    }
                } else {
                    console.error("make credit request fail");
                    if (cbFail) cbFail(response);
                }
            });
        });
    },

    makeDolyamePayment(cbSuccess, cbFail) {
        this.siteApi('make-dolyame-payment', {
            cart: this.getCartItems(),
        }).then((response) => {
            if (response.status && response.link) {
                if (cbSuccess) cbSuccess(response);
            } else {
                if (cbFail) cbFail(response);
            }
        });
    },

    // data {name,phone,email,trace,comment}
    lead(data, cbSuccess, cbFail) {
        this.siteApi('lead', data).then((response) => {
            if (response.status) {
                if (cbSuccess) cbSuccess(response);
            } else {
                if (cbFail) {
                    cbFail(response);
                } else {
                    alert('Не удалось отправить заявку, попробуйте повторить');
                }
            }
        });
    },

    additionalProducts(cbSuccess, cbFail) {
        this.siteApi('products', {}).then((response) => {
            if (response.status) {
                if (cbSuccess) cbSuccess(response);
            } else {
                if (cbFail) cbFail(response);
            }
        });
    },

    addToOrder(data, cart, cbSuccess, cbFail) {
        let request = Object.assign({}, data, {cart});
        this.siteApi('add-to-order', request).then((response) => {
            if (response.status) {
                if (cbSuccess) cbSuccess(response);
            } else {
                if (cbFail) cbFail(response);
            }
        });
    },

    registerProduct(data, cbSuccess, cbFail) {
        this.siteApi('register-product', data).then((response) => {
            if (response.status) {
                if (cbSuccess) cbSuccess(response);
            } else {
                if (cbFail) cbFail(response);
            }
        });
    },
};
//endregion SHOP

export default shop;