import "./ac-card.js";
import { showCreature } from "./init.js";
import { loadFile } from "./utils.js";

// Load API and set up clear onclick event
const init = () => {
    const url = "https://acnhapi.com/v1/fish";
    loadFile(url, jsonLoaded);

    document.querySelector("#clear-btn").onclick = clear;
};

// Clear button clears storage and reloads the page
const clear = () => {
    document.querySelector("#clear-btn").classList.add("is-loading");
    localStorage.clear();
    location.reload();
}

// When json is loaded, show stored favorites
const jsonLoaded = json => {
    if (localStorage.getItem("jaj8571-p1-settings"))
    {
        for (let c of JSON.parse(localStorage.getItem("jaj8571-p1-settings")).favList)
        {
            showCreature(json[c]);
        }
    }
};

// Onload of page, run init
window.onload = init;