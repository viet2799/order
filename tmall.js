const tmall = function () {
    this.getOriginPrice = function () {
        return getOriginPrice();
    };
    this.getPromoPrice = function () {
        return getPromoPrice();
    };
    this.processPrice = function (k) {
        processPrice(k);
    };
    this.getExchangeRate = function () {
        return getExchangeRate();
    };
    this.currency_format = function (k, _) {
        return currency_format(k, _);
    };
    this.translateProperties = function () {
        $(".tb-metatit").each(function () {
            var k = $(this).text();
            $(this).text(key_translate_lib(k));
            $(this).attr("data-title", k)
        });
    }
};
const tmall_getter = function () {
    this.getImageLink = function () {
        return getImageLink();
    };
    this.getItemID = function () {
        return getItemID();
    };
    this.getAmount = function () {
        return getAmount();
    };
    this.getDelivery = function () {
        return getDelivery();
    };
    this.getStock = function () {
        return getStock();
    };
    this.getDataValue = function () {
        return getDataValue();
    };
    this.getSellerNick = function () {
        return getSellerNick();
    };
    this.getProperties = function () {
        return getProperties();
    };
    this.isFull = function () {
        return isFull();
    };
    this.getItemLink = function () {
        var url = window.location.href;
        url = removeURLParameter(url, 'properties');
        url = removeURLParameter(url, 'propertiesId');
        url = removeURLParameter(url, 'quantity_bought');
        return url
    };
    this.getOriginPrice = function () {
        return getOriginPrice();
    };
    this.getPromoPrice = function () {
        return getPromoPrice();
    };
    this.getTitle = function () {
        return getItemTittle();
    };
    this.getSellerID = function () {
        return getSellerID();
    };
    this.getPriceTable = function () {
        return getPriceTable();
    };
    console.log('ádasdas'+ this.getPriceTable)
    console.log(this,'this')
    this.getData = function () {
        return {
            "source": "TMALL",
            "item_title": this.getTitle(),
            "item_link": this.getItemLink(),
            "item_id": this.getItemID(),
            "image_link": this.getImageLink(),
            "seller_nick": this.getSellerNick(),
            "seller_id": this.getSellerID(),
            "original_price": this.getOriginPrice()[0],
            "promotion_price": this.getPromoPrice()[0],
            "stock": this.getStock(),
            "delivery": this.getDelivery(),
            "amount": this.getAmount(),
            "properties_id": this.getDataValue(),
            "properties_name": this.getProperties(),
            "prices_config": this.getPriceTable()
        }
    }
};
// console.log(this.getData);
// console.log(`data ${tmall_getter.getData}`);
// console.log(`tmall ${tmall_getter}`);

function detail_tmall_loaded() {
    alibaba_web_loaded();
}
