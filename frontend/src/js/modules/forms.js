import $ from "jquery";
import shop from "./shop-api.js";
import {popupsMaker} from "./popups-maker.js";

const METRIKA_ID = 89523189;

function ymGoal(name, params, callback) {
    if (!name) return;
    console.log('reachGoal', name, params)
    if (!('ym' in window)) {
        if (callback) callback();
        return console.warn('metrika not found');
    }
    if (! METRIKA_ID) {
        return console.warn('METRIKA_ID not found');
    }
    ym(METRIKA_ID, 'reachGoal', name, params, callback);
}

function formatPrice(val, delim) {
    val = '' + val;
    let hiCount = val.length - 3;
    if (hiCount < 1) return val;
    if (!delim) delim = ' ';

    let hiVal = val.substr(0, hiCount),
        lowVal = val.substr(hiCount);

    return hiVal + delim + lowVal;
}

function getLS(key) {
    try {
        return localStorage.getItem(key);
    } catch (e) {}
}

function setLS(key, val) {
    try {
        localStorage.setItem(key, val);
    } catch (e) {}
}

const initModulesMain = [
    initPrices,
    initCatalogPrices,
    initCheckPromoCode,
    initComponentQuantities,
    initMakeOrder,
    initCreditRequest,
    initDolyamePayment,
    initLeadForm,
    initOptRequest,
    initShowOrderNumber,
];

//region run modules
function startForms() {
    runModules(initModulesMain, 'All');
}

function runModules(modules, name) {
    for (let i in modules) {
        try {
            let module = modules[i];
            module();
        } catch (e) {
            console.warn('init module error: ', e);
        }
    }
}
//endregion run modules

// load server prices
function initPrices() {

    $('.jsSelectProduct').on('click', function() {
        let code = $(this).data('code');
        if (code) {
            shop.cart.productCode = code;
            updateViewPrices();
        }
    });

    updateViewPrices();
}

// update visual prices after changing options
function updateViewPrices() {
    //updateViewPricesApply(false);
    shop.updatePrice(() => {
        updateViewPricesApply(true);
        updateViewComponentsPrices();
    })
}

function updateViewPricesApply(show) {
    let priceEnd = 0, priceBase = 0, priceOld = 0, priceCredit = 0, discount = 0;
    if (shop.prices.actual && show) {
        priceEnd = shop.prices.priceEnd;
        priceBase = shop.prices.priceBase;
        priceOld = shop.prices.priceOld;
        priceCredit = shop.prices.priceCredit;
        discount = shop.prices.getTotalDiscount();
    }

    let $price = $('.jsPrice');
    let $priceOld = $('.jsPriceOld');
    let $discount = $('.jsPriceDiscount');

    $price.toggle(!! priceEnd).find('.value').text(formatPrice(priceEnd));
    $priceOld.toggle(priceOld > priceEnd).find('.value').text(formatPrice(priceOld));
    $('.jsPricePart').each((i, price) => {
        let $price = $(price);
        let kf = + $price.data('price-part');
        let pricePart = Math.round(priceCredit * kf);
        $price.toggle(!! pricePart).find('.value').text(formatPrice(pricePart));
    });
    $discount.toggle(!! discount).find('.value').text(formatPrice(discount));
}

function initCatalogPrices() {
    shop.loadBasePrices(() => {
        $('[data-price]').each((i, div) => {
            let $price = $(div);
            let code = $price.data('price');
            let price = shop.getPrice(code)
            $price.toggle(!! price).find('.value').text(formatPrice(price));
        });
        $('[data-old-price]').each((i, div) => {
            let $price = $(div);
            let code = $price.data('old-price');
            let oldPrice = shop.getOldPrice(code)
            $price.toggle(!! oldPrice).find('.value').text(formatPrice(oldPrice));
        });
    });
}

function initCheckPromoCode() {
    $('.jsPromoCode').each(function (i, root) {
        const $root = $(root);
        const $input = $root.find('.jsPromoCodeInput');
        const $info = $root.find('.jsPromoCodeInfo');
        // const $checkButton = $root.find('.jsPromoCodeCheckButton');
        // const $deleteButton = $root.find('.jsPromoCodeDeleteButton');

        $input.on('change', function (e) {
            e.preventDefault();
            const code = $input.val();
            $info.text('');

            //if (code) {
                shop.checkPromoCode(code, (response) => {
                    if (response.active) {
                        shop.cart.promoCode = code;
                        $('.order__installment').hide();
                    } else {
                        $('.order__installment').show();
                    }
                    $info.text(response.info);
                    $info.toggleClass('active', response.active);

                    updateViewPrices();
                });
            //}
        });

        // $deleteButton.on('click', function (e) {
        //     e.preventDefault();
        //     $input.val('');
        //     $info.text('');
        //     shop.cart.promoCode = '';
        //     updateViewPrices();
        // });
    });
}

// обновить цены на доп товары
function updateViewComponentsPrices() {
    $('.jsComponentPrice').each((i, block) => {
        let $block = $(block)
        let $item = $block.closest('.jsComponentItem')
        let productCode = $item.data('product')
        let price = shop.cache.prices[productCode]
        $block.text(`${price} руб.`)
        if (! price) { // нет цены - не продаем - скрыть
            $item.hide()
        }
    })
}

// кнопки для выбора количества доп товаров
function initComponentQuantities() {
    $('.jsComponentQuantity').each((i, block) => {
        let $block = $(block)
        let $item = $block.closest('.jsComponentItem')

        let $btnAdd = $block.find('.jsQuantityAdd');
        let $btnMinus = $block.find('.jsQuantityMinus');
        let $valueField = $block.find('.jsQuantityValue');

        let value = +$valueField.text();
        let maxValue = $block.data('max') || 100;
        let minValue = $block.data('min') || 0;
        let productCode = $item.data('product')

        let setQuantity = (newValue) => {
            value = newValue
            // validate
            if (value > maxValue) value = maxValue
            if (value < minValue) value = minValue
            // view update
            $valueField.text(value)
            // disable buttons
            $btnAdd.attr('disabled', value === maxValue)
            $btnMinus.attr('disabled', value === minValue)
            // update quantity in api
            shop.cart.additionalProducts[productCode] = value
            // update full price
            updateViewPrices()
        }

        $btnAdd.on('click', () => setQuantity(value + 1))
        $btnMinus.on('click', () => setQuantity(value - 1))
        setQuantity(value)
    })
}

function initMakeOrder() {
    $('.jsOrderForm').each(function (i, form) {
        const $form = $(form);

        $form.on('submit', (e) => {
            e.preventDefault();
            let user = {
                name: $form.find('[name="name"]').val(),
                phone: $form.find('[name="phone"]').val(),
            };

            shop.makeOrder(user, (response) => {
                if (response.error) {
                    alert(response.error);
                } else {
                    ymGoal('zakaz');
                    form.reset();

                    let order = Object.assign({orderNumber: response.orderNumber}, user)
                    setLS('order', JSON.stringify(order));

                    setTimeout(() => {
                        window.location = 'order-success.html?order=' + encodeURIComponent(response.orderNumber);
                    }, 1000);
                    //alert(`Ваш заказ принят. Номер заказа ${response.orderNumber}`);
                }
            });
        });
    });
}

function getOrderNumber() {
    const match = window.location.search.match(/order=([^&]+)/);
    if (match) {
        return decodeURIComponent(match[1]);
    } else {
        let order = getLS('order');
        if (order && (order = JSON.parse(order)) && order.orderNumber) {
            return order.orderNumber;
        }
    }
}
function initShowOrderNumber() {
    let $number = $('.jsOrderNumber')
    if ($number.length) {
        let orderNumber = getOrderNumber()
        $number.text(orderNumber)
    }
}

function initOptRequest() {
    $('.jsRequestForm').each(function (i, form) {
        const $form = $(form);

        $form.on('submit', (e) => {
            e.preventDefault();
            let user = {
                name: $form.find('[name="name"]').val(),
                phone: $form.find('[name="phone"]').val(),
            };

            shop.optRequest(user, (response) => {
                if (response.error) {
                    alert(response.error);
                } else {
                    form.reset();
                    var scrollWidth= window.innerWidth-$(document).width();
		            $('.exhibition__popap-back, .exhibition__popap-wrapper, body').addClass("active");
		            $('body, .header, .b24-widget-button-wrapper, .exhibition__popap-wrapper ').css('padding-right', scrollWidth);
                }
            });
        });
    });
}


function initLeadForm() {
    $('.jsLeadForm').each(function (i, form) {
        const $form = $(form);
        const $formType = $form.find('[type="hidden"]').val();

        $form.on('submit', (e) => {
            e.preventDefault();

            if ($form.hasClass('partnership__form')) {
                const link = document.createElement('a');
                link.setAttribute('href','brochures/Каталог март 2023.pdf');
                link.setAttribute('download','Каталог март 2023');
                link.style.display = 'none';
                document.body.append(link);
                link.click();

                setTimeout(() => {
                    link.remove();
                  }, 1000);
            }

            const data = new FormData(form);

            shop.lead(data, (response) => {
                form.reset();
                ymGoal('getconsult');
                if ($formType === 'стать партнёром') {
                    popupsMaker.openPopup('partnership');
                } else if ($formType === 'консультация') {
                    popupsMaker.openPopup('thanks');
                } else {
                    popupsMaker.openPopup('thanks');
                }
            });
        });
    });
}


function initCreditRequest() {
    $('.jsCreditRequestBtn').on('click', (e) => {
        e.preventDefault();
        shop.makeCreditTinkoff((data) => {
            // data.type - статус например tinkoff.constants.SUCCESS
            console.log('TNK EVENT', data);
            ymGoal('rassrochka');
        }, (response) => {
            if (response.error) alert(response.error);
        });
    });
}

function initDolyamePayment() {
    $('.jsDolyamePaymentBtn').on('click', (e) => {
        e.preventDefault();
        shop.makeDolyamePayment((response) => {
            window.open(response.link, '_blank');
        }, (response) => {
            if (response.error) alert(response.error);
        });
    });
}

export {
    startForms,
};