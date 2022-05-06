import {paintData} from "./init.js";
const template = document.createElement("template");
template.innerHTML = `
<input type="checkbox" id="dark-mode" name="dark-mode">
<label for="dark-mode">Dark Mode</label>
`;

class PaintMode extends HTMLElement {
    constructor() {
        super();

        // Shadow DOM
        // 1 - attach shadow DOM tree to instance
        this.attachShadow({ mode: "open" });

        // 2 - clone and append
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.checkBox = this.shadowRoot.querySelector("#dark-mode");

    }

    // 5 - called when component added
    connectedCallback() {
        this.render();
        this.checkBox.addEventListener("click", () => {
            if(this.checkBox.checked)
            {
                // All stylization for dark-mode
                document.querySelector("body").style.background = "#282828";
                document.querySelector("body").style.color = "#eeeeee";
                let modal = document.querySelectorAll(".modal-card-body")
                for (let i = 0; i < modal.length; i++)
                {
                    modal[i].style.background = "#3A3B3C";
                }
                let modalH = document.querySelectorAll(".modal-card-head")
                for (let i = 0; i < modalH.length; i++)
                {
                    modalH[i].style.background = "#282828";
                }
                let modalT = document.querySelectorAll(".modal-card-title")
                for (let i = 0; i < modalT.length; i++)
                {
                    modalT[i].style.color = "#eeeeee";
                }
                let modalF = document.querySelectorAll(".modal-card-foot")
                for (let i = 0; i < modalF.length; i++)
                {
                    modalF[i].style.background = "#282828";
                }
                let subtitles = document.querySelectorAll(".subtitle");
                for (let i = 0; i < subtitles.length; i++)
                {
                    subtitles[i].style.color = "#eeeeee";
                }
                let titles = document.querySelectorAll(".title");
                for (let i = 0; i < titles.length; i++)
                {
                    titles[i].style.color = "#eeeeee";
                }
                paintData.mode = "dark";
            }
            else
            {
                // All stylization for light-mode
                document.querySelector("body").style.background = "#eeeeee";
                document.querySelector("body").style.color = "#282828";
                let modal = document.querySelectorAll(".modal-card-body")
                for (let i = 0; i < modal.length; i++)
                {
                    modal[i].style.background = "#FFFFFF";
                }
                let modalH = document.querySelectorAll(".modal-card-head")
                for (let i = 0; i < modalH.length; i++)
                {
                    modalH[i].style.background = "#f5f5f5";
                }
                let modalT = document.querySelectorAll(".modal-card-title")
                for (let i = 0; i < modalT.length; i++)
                {
                    modalT[i].style.color = "#282828";
                }
                let modalF = document.querySelectorAll(".modal-card-foot")
                for (let i = 0; i < modalF.length; i++)
                {
                    modalF[i].style.background = "#f5f5f5";
                }
                let subtitles = document.querySelectorAll(".subtitle");
                for (let i = 0; i < subtitles.length; i++)
                {
                    subtitles[i].style.color = "#282828";
                }
                let titles = document.querySelectorAll(".title");
                for (let i = 0; i < titles.length; i++)
                {
                    titles[i].style.color = "#282828";
                }
                paintData.mode = "light";
            }
            localStorage.setItem("jaj8571-p1-settings", JSON.stringify(paintData));
        });

    }

    disconnectedCallback() {
        this.checkBox.onclick = null;
    }


    // 6 - helper method that displays attributes
    render() {
        // If local storage exists
        if (localStorage.getItem("jaj8571-p1-settings"))
        {
            // If it is saved as dark
            if (JSON.parse(localStorage.getItem("jaj8571-p1-settings")).mode == "dark")
            {
                // All stylization for dark-mode
                const state = document.createAttribute("checked");
                this.checkBox.setAttributeNode(state);
                document.querySelector("body").style.background = "#282828";
                document.querySelector("body").style.color = "#eeeeee";
                let modal = document.querySelectorAll(".modal-card-body")
                for (let i = 0; i < modal.length; i++)
                {
                    modal[i].style.background = "#3A3B3C";
                }
                let modalH = document.querySelectorAll(".modal-card-head")
                for (let i = 0; i < modalH.length; i++)
                {
                    modalH[i].style.background = "#282828";
                }
                let modalT = document.querySelectorAll(".modal-card-title")
                for (let i = 0; i < modalT.length; i++)
                {
                    modalT[i].style.color = "#eeeeee";
                }
                let modalF = document.querySelectorAll(".modal-card-foot")
                for (let i = 0; i < modalF.length; i++)
                {
                    modalF[i].style.background = "#282828";
                }
                let subtitles = document.querySelectorAll(".subtitle");
                for (let i = 0; i < subtitles.length; i++)
                {
                    subtitles[i].style.color = "#eeeeee";
                }
                let titles = document.querySelectorAll(".title");
                for (let i = 0; i < titles.length; i++)
                {
                    titles[i].style.color = "#eeeeee";
                }
            }
        }
    }
}

customElements.define('paint-mode', PaintMode);