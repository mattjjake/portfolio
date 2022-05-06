// Import scripts
import "./paint-footer.js";
import "./paint-nav.js";
import "./paint-mode.js";
import { loadFile } from "./utils.js";

// Variables
export const paintData = {
    //"drawing": "",
    "mode": "",
    "layersStore" : [],
    "layerNames" : []
};

// Initialize page
const init = () => {
    // Load JSON
    const url = "./data/presets.json";
    loadFile(url, jsonLoaded);

    if (localStorage.getItem("jaj8571-p2-settings")) {
        if (JSON.parse(localStorage.getItem("jaj8571-p2-settings")).mode) {
          paintData.mode = JSON.parse(localStorage.getItem("jaj8571-p2-settings")).mode;
        }
    }
};

const jsonLoaded = json => {
    if (document.querySelector("#tool-chooser")) {
        // Tools
        const toolHTML = Object.keys(json.default.chooser).map(s => `<option value="tool-${json.default.chooser[s]}">
            ${json.default.chooser[s].charAt(0).toUpperCase() + json.default.chooser[s].slice(1)}</option>`).join("");

        const toolSelect = document.querySelector("#tool-chooser");
        toolSelect.innerHTML = `<option value="none" selected disabled hidden>&lt;Choose a Tool&gt;</option>`;
        toolSelect.innerHTML += toolHTML;

        // Color
        document.querySelector("#strokestyle-chooser").value = json.default.color;
    }
};

window.onload = init;