if (getCookie("uid") !== null) {
    document.getElementById("login-form").style.visibility = 'hidden';
    document.getElementById("login-completed").style.visibility = 'visible';
}

document.getElementById("login-button").addEventListener("click", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    console.log(username + ", " + password);
    if (username === "" || password === "") {
        Swal.fire({
            icon: "error",
            title: 'Lỗi',
            text: "Xin vui lòng diền mật khẩu hoặc tài khoản",
        });
        document.body.className = ""
    } else {
        httpAsync("GET", "/add_on_login?username=" + username + "&password=" + password, function (responseText) {
            const jsonResponse = JSON.parse(responseText);
            console.log(jsonResponse);
            if (jsonResponse["accept"] === false) {
                Swal.fire({
                    icon: "error",
                    title: 'Lỗi',
                    text: jsonResponse["reason"],
                });
                document.body.className = ""
            } else {
                setCookie("uid", jsonResponse["uid"], 365 * 20);
                localStorage.setItem("uid", jsonResponse["uid"]);
                Swal.fire({
                    icon: "info",
                    title: 'Thông báo',
                    text: "Đăng nhập thành công ",
                });
                document.body.className = ""
            }
        })
    }
});

document.getElementById("logout").addEventListener("click", function (e) {
    e.preventDefault();

    document.getElementById("login-completed").style.visibility = 'hidden';
    document.getElementById("login-form").style.visibility = 'visible';
    eraseCookie("uid");
    localStorage.removeItem("uid");
});
