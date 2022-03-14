$(document).ready(function () {
    ready();
});

function setZIndex() {
    setTimeout(function () {
        try {
            $('#detail').css('z-index', 100);
            var layouts = document.getElementsByClassName('layout');
            console.log(layouts)
            for (let i = 0; i < layouts.length; i++) {
                layouts[i].style.zIndex = 100;

            }
            $('#J_TabBarWrap').css('z-index', 100);
        } catch (e) {
            setZIndex();
        }
    }, 1000);
}

function ready() {
    const appendage = document.createElement("div");
    appendage.className = "_appendage";
    appendage.style = "display: block;";
    document.body.insertBefore(appendage, document.body.childNodes[0]);
    const url = window.location.href;
    if (url.match(/taobao-order.com\/home/)) {
        chrome.storage.sync.set({'sid': localStorage.getItem('sid'), 'uid': localStorage.getItem('uid')}, function () {
            console.log(localStorage.getItem('uid'), localStorage.getItem('sid'));
        });
    }
    if (!(match("taobao") || match("tmall") || match("1688"))) return;
    chrome.runtime.sendMessage({
        action: "getAppendage",
        callback: "afterGetAppendage"
    });
    if (match("taobao")) {
        setZIndex();
        item_taobao_loaded();
    } else if (match("tmall")) {
        detail_tmall_loaded();
    } else if (match("1688")) {
        detail_1688_loaded();
    }
}

function loadAppendage() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function (evt) {
        if (req.readyState === 4 && req.status === 200) {
            if (req.responseText === null) return;
            document.getElementsByClassName("_appendage")[0].innerHTML = req.responseText;
            loadScript();
        }
    };
    req.open("GET", chrome.extension.getURL("../template/index.html"), true);
    req.setRequestHeader("Content-type", "text/html");
    req.send();
}

function loadScript() {
    var tool = getToolGetter();


    var map = {};
    if(window.location.href.match(/detail.1688/)) {
        const list = document.querySelectorAll(".list-leading > li > div > a");
        if (list.length > 0) {
            for(let i = 0; i < list.length; i++) {
                list[i].addEventListener("click", function(){
                    console.log(list[i].parentElement.getAttribute("data-unit-config"));
                    const data = tool.getData();
                    if(data['properties'].length > 0) {
                        map[data['properties_id']] = data;
                    } else {
                        try {
                            delete map[data['properties_id']];
                        } catch (e) {
                        }
                    }

                });
            }
        }
    }

    $(document).on("click", ".btn_add_to_cart", function () {
        if (match("taobao") || match("tmall")) {
            if (!tool.isFull()) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Quý khách vui lòng chọn đầy đủ thuộc tính của sản phẩm',
                    customClass: 'notranslate'
                });
                return
            }
        }

        if(match("1688")) {
            try {
                var all_input  = document.getElementsByTagName('input');
                for(let i = 0; i < all_input.length; i++) {
                    all_input[i].blur();
                }
            } catch (e) {

            }
        }

        if(document.getElementsByTagName('html')[0].getAttribute('lang') === 'vi') {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'vui lòng tắt google dịch trước khi đặt hàng',
                customClass: 'notranslate'
            });
            return
        }

        chrome.storage.sync.get(['sid', 'uid'], function (result) {
            const uid = result.uid;
            const sid = result.sid;
            if (uid === null || sid === null) {
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'chưa đăng nhập vui lòng đăng nhập',
                    confirmButtonText: 'đăng nhập'
                }).then(function () {
                    var win = window.open(host + "/login", '_blank');
                    win.focus();
                });
                return
            }
            // const send_data = JSON.stringify();
            const data = tool.getData();
            console.log( data );

            if (data['properties_id'] === 'undefined') {
                alert("xin vui lòng chọn màu của sản phẩm");
                return
            }

            if(match("1688")) {
                if(data['properties'].length > 0) {
                    map[data['properties_id']] = data;
                } else {
                    try {
                        delete map[data['properties_id']];
                    } catch (e) {
                        console.log(e);
                    }
                }
            } else {
                map[data['properties_id']] = data;
            }

            var time = 0;
            order_count = Object.keys(map).length;

            if (order_count === 0) {
                alert("xin vui lòng chọn sản phẩm cần mua");
                return;
            }
            Object.keys(map).forEach(function(key) {
                setTimeout(function () {
                    chrome.runtime.sendMessage({
                        action: "createCart",
                        data: JSON.stringify(map[key]),
                        uid: uid,
                        sid: sid,
                        callback: "afterCreateCart"
                    });
                }, time);
                time += 100;
            });
        });

    });
}

var order_count = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("Action: " + request.action);
    if (request.action === "afterGetAppendage") {
        console.log("after get appendage");
        console.log('loi khi k chon thuoc tinh')
        // console.log(this.getData);

        loadAppendage();
    } else if (request.action === "afterCreateCart") {
        console.log("after create cart");
        if (request.data.accept === false) {
            Swal.fire({
                icon: "error",
                title: '12312312',
                text: request.data.reason,
                customClass: 'notranslate'
            })
        }
    } else if (request.action === "orderSuccess") {
        order_count = order_count - 1 <= 0 ? 0 : order_count - 1;
        if (order_count === 0) {
            Swal.fire({
                icon: 'success',
                title: 'Thông báo',
                text: 'đặt hàng thành công',
                footer: '<a href="https://taobao-order.com/cart">mở giỏ hàng</a>',
                customClass: 'notranslate'
            });
        }

    } else if (request.action === "orderError") {
        if (request.message === 'chưa đăng nhập vui lòng đăng nhập') {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: request.message,
                confirmButtonText: 'đăng nhập',
                customClass: 'notranslate'
            }).then(function () {
                var win = window.open(host + "/login", '_blank');
                win.focus();
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Lzzz',
                text: request.message,
                customClass: 'notranslate'
            })
        }
    } else if (request.action === "loginBeforeOrdering") {
        Swal.fire({
            icon: 'warning',
            title: 'Cảnh báo',
            text: "Vui lòng đăng nhập trước khi đặt hàng!",
            customClass: 'notranslate'
        });
    }
});