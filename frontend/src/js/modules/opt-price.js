
const optPriceApp = {
    data() {
        return {
            active: false,
            priceCode: null,
            groups: [],
            errorMessage: null,
            comment: '',
            popup: {
                added: false,
                order: false,
                complete: false,
            },
        }
    },
    mounted() {
        let result = window.location.search.match(/id=([^&]+)/)
        if (result) {
            this.priceCode = result[1]
            this.active = true
        } else {
            this.errorMessage = 'Страница не найдена'
            this.active = false
            return
        }

        shop.siteApi('opt-price', {id: this.priceCode}).then((response) => {
            if (! response.status) {
                this.active = false
                this.errorMessage = response.message
                return;
            }
            let groups = response.priceGroups
            groups.forEach(group => {
                group.products.forEach(product => {
                    product.quantity = 0;

                })
            });
            this.groups = groups
        });
    },
    computed: {
        selectedProducts() {
            let products = []

            this.groups.forEach(group => {
                group.products.forEach(product => {
                    if (product.quantity > 0) {
                        products.push(product)
                    }
                })
            })

            return products
        },
        countEntities() {
            return this.selectedProducts.length
        },
        countItems() {
            return this.selectedProducts.reduce(
                (sum, product) => product.quantity + sum
            , 0)
        },
        orderTotalSum() {
            return this.selectedProducts.reduce(
                (sum, product) => product.quantity * product.price_opt + sum
            , 0)
        },
    },
    methods: {
        makeOrder() {
            if (! this.countEntities) {
                alert('Выберите количество товара')
                return
            }

            let quantities = {}
            this.selectedProducts.forEach((product) => {
                quantities[product.id] = product.quantity
            })

            shop.siteApi('opt-order', {
                id: this.priceCode,
                comment: this.comment,
                quantities: quantities
            }).then((response) => {
                if (response.status) {
                    alert('Заявка отправлена. С вами свяжется менеджер')
                } else {
                    alert(response.message)
                }
            });

        },
    },
}

function initOptPrice() {
    if (document.getElementById('optPriceApp')) {
        Vue
            .createApp(optPriceApp)
            .mount('#optPriceApp');
    }
}
$(document).ready(initOptPrice);
