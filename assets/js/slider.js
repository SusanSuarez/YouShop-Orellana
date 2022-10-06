// window.onload = function(){
//     slideOne();
//     slideTwo();
// }
let sliderOne = document.getElementById("price-1");
let sliderTwo = document.getElementById("price-2");
let displayValOne = document.getElementById("range1");
let displayValTwo = document.getElementById("range2");
let sliderTrack = document.querySelector(".slider-track");
let minGap = 0;

function slideOne(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
        sliderOne.value = parseInt(sliderTwo.value) - minGap;
    }
    displayValOne.textContent = "S/" + sliderOne.value;
    fillColor();
}
function slideTwo(){
    if(parseInt(sliderTwo.value) - parseInt(sliderOne.value) <= minGap){
        sliderTwo.value = parseInt(sliderOne.value) + minGap;
    }
    displayValTwo.textContent = "S/" + sliderTwo.value;
    fillColor();
}
function fillColor(){
    percent1 = ((sliderOne.value-sliderOne.min) / (sliderOne.max-sliderOne.min)) * 100;
    percent2 = ((sliderTwo.value-sliderTwo.min) / (sliderOne.max-sliderTwo.min)) * 100;
    sliderTrack.style.background = `linear-gradient(to right, #dadae5 ${percent1}% , #F49715 ${percent1}% , #F49715 ${percent2}%, #dadae5 ${percent2}%)`;
}