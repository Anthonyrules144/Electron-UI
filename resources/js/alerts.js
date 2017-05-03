
// _ _ _ _ _ __ _ _ _ _ _ \\
var alert = alert || { internal: 0, element: document.getElementsByClassName("alert")[0] }

alert.setMessage = function (msg, internal) {
    if(!msg) throw "msg was not defined";
    alert.element.children[2].innerHTML = msg;
}

alert.show = function () {
    $(".alert").animate({
        top: "+=30",
        opacity: "+=0.8"
    }, 1000 );
}

alert.close = function () {
    $(".alert").animate({
        top: "-=30",
        opacity: "-=0.8"
    }, 1000 );
}
