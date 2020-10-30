var toggler = document.getElementsByClassName("caret");
var i;
for (i = 0; i < toggler.length; i++) {
    toggler[i].addEventListener("click", function () {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
    });
}

const slide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-box');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-box-click');
    })
};
slide();