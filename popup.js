"use strict";
const Selector = element => document.querySelector(element),
    SelectorAll = elements => document.querySelectorAll(elements),
    sT = (fun, time) => setTimeout(fun, time);


// Store the data to Storage API

function storeData(data) {

    chrome.storage.local.set({
        linkedinQuery: data
    });

}
// Create link 

function gotoLink(keyword) {
    let link = `https://www.linkedin.com/search/results/people/?keywords=${keyword}`;
    window.open(link, "_blank");
}

// Create the data Object

Selector('button.btn').onclick = () => {
    let obj = new Object();

    SelectorAll("input").forEach(input => {
        obj[input.id] = input.value;
    });

    storeData(obj);
    gotoLink(SelectorAll("input")[0].value);
}

// Clear Existing Query

Selector('button.clearbtn').onclick = () => {
    chrome.storage.local.remove(['linkedinQuery']);
    Selector('span.cleared').style.display = "block";
    sT(() => {
        Selector('span.cleared').style.display = "none";
    }, 1000)
}