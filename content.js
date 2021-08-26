"use strict";
const Selector = element => document.querySelector(element),
    SelectorAll = elements => document.querySelectorAll(elements),
    sI = (fun, time) => setInterval(fun, time),
    sT = (fun, time) => setTimeout(fun, time),
    cI = interval => clearInterval(interval),
    cT = timeout => clearTimeout(timeout),
    newEle = element => document.createElement(element),
    lsGet = getStorage => localStorage.getItem(getStorage),
    lsSet = (storeName, Item) => localStorage.setItem(storeName, Item);

let nameArray = [];
const halfSecond = 500;
let currentPage;
var fromPage;

// Stop the extraction

function stopExtraction(obj) {
    if (Number(obj.toPage) !== currentPage) {
        fromPage++;
        scrollToEnd(obj);
    } else {
        successOverlay();
        console.clear();
        console.log(nameArray);
    }
}

// Start the extraction

function startExtraction(obj) {
    SelectorAll('span.entity-result__title-text a').forEach(ele => {
        if (ele.children.length) {
            nameArray.push(ele.children[0].children[0].innerText);
        } else {
            nameArray.push([ele.innerText, "Your network have limited visibility"]);
        }
    })
    stopExtraction(obj);
}

// Page check

function pageIndex(obj, id) {
    currentPage = fromPage;
    sT(() => {
        if (Selector(`#${id} div ul li.active button`)) {
            if (Number(Selector(`#${id} div ul li.active button`).innerText) == currentPage) {
                startExtraction(obj);
            } else {
                Selector(`#${id} div ul li[data-test-pagination-page-btn="${currentPage}"] button`).click();
                scrollToEnd(obj);
            }
        } else {
            scrollToEnd(obj);
        }
    }, halfSecond)

}

// Scroll page to end to load all element

function scrollToEnd(obj) {
    let pageIndexDiv = SelectorAll("div.artdeco-card>div.ember-view");
    pageIndexDiv = pageIndexDiv.length == 1 ? pageIndexDiv[0] : pageIndexDiv[1];
    sT(() => {
        if (pageIndexDiv) {
            location.href = `#${pageIndexDiv.id}`;
            pageIndex(obj, pageIndexDiv.id);
        } else {
            scrollToEnd(obj);
        }
    }, halfSecond)
}

// exitOverlay

function exitOverlay() {
    if (Selector('div#waitOverlayDiv')) {
        Selector('div#waitOverlayDiv').remove();
    }
}

// successOverlay

function successOverlay() {

    document.addEventListener("keydown", exitOverlay);

    if (Selector('div#waitOverlayDiv')) {
        SelectorAll('div#waitOverlayDiv>span')[0].style.color = "green";
        SelectorAll('div#waitOverlayDiv>span')[0].innerText = "Your process is done !";
        SelectorAll('div#waitOverlayDiv>span')[1].innerText = "You can get your data in chrome dev console at the top";
        SelectorAll('div#waitOverlayDiv>span')[2].innerText = "Note: Press any key to exit";
    }
}

// waitOverlay

function waitOverlay(obj) {
    const appendWaitOverlay = sI(() => {
        if (!Selector('div#waitOverlayDiv') && obj) {
            let layer = newEle('div');
            layer.id = "waitOverlayDiv";
            layer.innerHTML = "<span style='color:red;'>Wait your process is running !</span><span style='font-size:2rem'>This take sometime according to your Internet Speed and Server Response</span><span style='font-size:1.5rem;padding:2rem 0'>Note: Don't Switch between Tabs or Apps this will pause your process</span>";
            layer.setAttribute('style', 'flex-direction:column;z-index:999999;position:fixed;width:100%;height:100%;top:0;left:0;font-size:3rem;background:rgba(255,255,255,.5);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;');
            Selector('body').insertBefore(layer, Selector('body').children[0]);
            cI(appendWaitOverlay);
        } else {
            cI(appendWaitOverlay)
        }
    }, 0);

}


// Get the stored data from API

chrome.storage.local.get(['linkedinQuery'], function (result) {
    if (result.linkedinQuery) {
        fromPage = Number(result.linkedinQuery.fromPage);
        scrollToEnd(result.linkedinQuery);
        waitOverlay(result.linkedinQuery)
    }
});