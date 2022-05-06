import { layers } from "./app.js";
import { saveState } from "./app.js";
import { paintData } from "./init.js";
const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

  <div class="box" draggable="true" value="false" style="padding: 10px; margin: 10px; ">
    <p id="num" style="display: inline;"></p>
    <button class="button" style="background-color: rgb(76, 197, 150); margin-left: 10px;" id="btn-hide">Hide</button>
    <button class="button" style="background-color: rgb(76, 197, 150); margin-left: 10px;" id="btn-del">Delete</button>
  </div>
  <div class="dropzone" value="0" style="padding: 10px; display:block;"></div>
`;

class PaintLayer extends HTMLElement {
    constructor() {
        super();

        // Shadow DOM
        // 1 - attach shadow DOM tree to instance
        this.attachShadow({ mode: "open" });

        // 2 - clone and append
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.hide = this.shadowRoot.querySelector("#btn-hide");
        this.delete = this.shadowRoot.querySelector("#btn-del");
        this.box = this.shadowRoot.querySelector(".box");
    }

    // 5 - called when component added
    connectedCallback() {
        this.render();
        // Onclick of hide, hide/show the layer
        this.hide.onclick = () => {
            if (layers[this.num].style.display == "none") {
                layers[this.num].style.display = "block";
                this.hide.style.background = "rgb(76, 197, 150)";
                this.hide.innerHTML = "Hide";

            }
            else {
                layers[this.num].style.display = "none";
                this.hide.style.background = "rgb(197, 76, 150)";
                this.hide.innerHTML = "Show";
            }

        };


        this.box.onclick = (e) => {
            // Unselect other layer
            if (e.target != this.box) return;
            for (let i = 0; i < layers.length; i++) {
                document.querySelector("#layers").children[i].select = false;
            }

            this.select = true;

            this.render();

        };

        this.box.ondragstart = () => {
            this.box.style.opacity = .5;
            this.box.value = true;
        };
        this.box.ondragend = () => {
            this.box.style.opacity = "";
            this.box.value = false;
        };
        this.shadowRoot.querySelector(".dropzone").ondragover = (e) => {
            e.preventDefault();
        };
        this.shadowRoot.querySelector(".dropzone").ondragleave = (e) => {
            if (e.target.className == "dropzone") {
                e.target.style.background = "";
            }
        };
        this.shadowRoot.querySelector(".dropzone").ondragenter = (e) => {
            if (e.target.className == "dropzone") {
                e.target.style.background = "#FF0000";
            }
        };

        // Reorder layer on drop
        this.shadowRoot.querySelector(".dropzone").ondrop = (e) => {
            e.preventDefault();

            for (let i = 0; i < document.querySelector("#layers").children.length; i++) {


                if (document.querySelector("#layers").children[i].shadowRoot.querySelector(".box").value == true) {
                    let saveLayer;
                    // This is the dragged box

                    saveLayer = layers[this.num];
                    layers[this.num] = layers[i];



                    let saveName = document.querySelector("#layers").children[this.num].name;
                    document.querySelector("#layers").children[this.num].name = document.querySelector("#layers").children[i].name;

                    // transfer data up
                    // Swap values
                    if (parseInt(this.num) + 1 == document.querySelector("#layers").children[i].num ||
                        parseInt(this.num) - 1 == document.querySelector("#layers").children[i].num) {
                        layers[i] = saveLayer;
                        document.querySelector("#layers").children[i].name = saveName;
                    }
                    else if (parseInt(this.num) < document.querySelector("#layers").children[i].num - 1) {
                        for (let j = document.querySelector("#layers").children[i].num; j < document.querySelector("#layers").children.length; j++) {
                            let saveName1 = document.querySelector("#layers").children[j].name;
                            let saveLayer1 = layers[j];
                            layers[j] = saveLayer;
                            saveLayer = saveLayer1

                            document.querySelector("#layers").children[j].name = saveName;
                            saveName = saveName1;
                        }
                    }

                    else {
                        // transfer data down
                        for (let j = parseInt(this.num) - 1; j >= 0; j--) {

                            let saveName1 = document.querySelector("#layers").children[j].name;

                            let saveLayer1 = layers[j];
                            layers[j] = saveLayer;
                            saveLayer = saveLayer1

                            document.querySelector("#layers").children[j].name = saveName;
                            saveName = saveName1;
                        }
                    }



                }

                // This is a non dragged box

            }
            // Refresh numbers
            for (let i = 0; i < document.querySelector("#layers").children.length; i++) {
                document.querySelector("#layers").children[i].num = i;
                layers[i].id = i;
                layers[i].style["z-index"] = i;
            }

            e.target.style.background = "";
            this.render();
        };

        // Holding touch allows mobile name change
        let timePassed;
        let touchTime = 100;
        this.shadowRoot.querySelector('p').ontouchstart = (e) => {
            timePassed = setTimeout(hold, touchTime)
        };
        this.shadowRoot.querySelector('p').ontouchend = () => {
            if (timePassed)
            clearTimeout(timePassed)
        };
        const hold = () => {
            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = this.name;
            this.shadowRoot.querySelector('p').innerHTML = "";
            this.shadowRoot.querySelector('p').appendChild(input);

            this.shadowRoot.querySelector("input").onchange = () => {
                this.name = this.shadowRoot.querySelector("input").value;
                paintData.layerNames[this.num] = this.name;
                localStorage.setItem("jaj8571-p1-settings", JSON.stringify(paintData));
            };
        };

        // Double click allows PC name change
        this.shadowRoot.querySelector('p').ondblclick = () => {

            let input = document.createElement("input");
            input.type = "text";
            input.placeholder = this.name;
            this.shadowRoot.querySelector('p').innerHTML = "";
            this.shadowRoot.querySelector('p').appendChild(input);

            this.shadowRoot.querySelector("input").onchange = () => {
                this.name = this.shadowRoot.querySelector("input").value;
                paintData.layerNames[this.num] = this.name;
                localStorage.setItem("jaj8571-p1-settings", JSON.stringify(paintData));
            };
        };

    }


    disconnectedCallback() {
    }

    static get observedAttributes() {
        return ["data-num", "data-select", "data-name"];
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(attributeName, oldVal, newVal);
        this.render();
    }

    get num() {
        return this.getAttribute('data-num');
    }

    get name() {
        if (this.getAttribute('data-name') != null) {
            return this.getAttribute('data-name');
        }
        return `layer ${this.num}`;
    }

    get select() {
        return this.getAttribute('data-select');
    }

    set num(newValue) {
        this.setAttribute('data-num', newValue);
        this.render();
    }

    set name(newValue) {
        this.setAttribute('data-name', newValue);
        this.render();
    }

    set select(newValue) {
        this.setAttribute('data-select', newValue);

        this.render();
    }

    // 6 - helper method that displays attributes
    render() {
        //grab and assign default
        let num = this.getAttribute('data-num') ? this.getAttribute('data-num') : 0;
        let select = this.getAttribute('data-select') ? this.getAttribute('data-select') : false;
        let name = this.getAttribute('data-name') ? this.getAttribute('data-name') : `layer ${num}`;
        paintData.layerNames[this.num] = this.name;

        this.shadowRoot.querySelector("p").innerHTML = `${name}`;
        this.shadowRoot.querySelector(".dropzone").value = `${num}`;

        if (select == "true") {
            this.box.style.background = "grey";
        }
        else {
            this.box.style.background = "white";
        }


        // Onclick of delete, delete the canvas, then remove from the list, then edit numbers accordingly
        this.delete.onclick = () => {
            layers[num].remove();
            layers.splice(num, 1);
            for (let i = 0; i < layers.length; i++) {
                layers[i].id = i;
            }
            for (let i = 0; i < document.querySelector("#layers").children.length; i++) {
                if (document.querySelector("#layers").children[i].num > this.num) {
                    document.querySelector("#layers").children[i].num -= 1;
                }
            }
            saveState();
            this.remove();
        };

    }
}

customElements.define('paint-layer', PaintLayer);