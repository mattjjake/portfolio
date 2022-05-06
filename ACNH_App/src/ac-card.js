const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">

    <div class="card large" style="height: 325px; width: 300px; margin: 10px;">
        <div class="card-image">
          <figure class="image">
            <img :src="card.image" alt="Image">
          </figure>
        </div>
        <div class="card-content" style="background-color: rgb(76, 197, 150);">
          <div class="content">
            <h2></h2>
            <button class="button" style="background-color: rgb(76, 197, 150); color: white; padding: 10px; position: absolute;
            top: 1px;
            right: 1px;">Fav</button>
            <p id="acc-location"></p>
            <section></section>
          </div>
        </div>
      </div>
    </div>

`;

class ACCard extends HTMLElement{
    constructor(){
        super();
        // Shadow DOM
        // 1 - attach shadow DOM tree to instance
        this.attachShadow({mode: "open"});

        // 2 - clone and append
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.h2 = this.shadowRoot.querySelector("h2");
        this.img = this.shadowRoot.querySelector("img");
        this.p1 = this.shadowRoot.querySelector("#acc-location");
        this.button = this.shadowRoot.querySelector("button");
    }


    connectedCallback(){
        this.render();

        // If on the FAVORITES page, no favorite button is needed!
        if (document.URL.includes("favorites"))
        {
            this.shadowRoot.querySelector("button").style.visibility = 'hidden';
        }
        else 
        {
            // Else, you can use it!
            this.shadowRoot.querySelector("button").addEventListener("click", () => {
                this.shadowRoot.querySelector("button").innerHTML = "Fav'd";
            });
        }

    }

    disconnectedCallback(){
        this.button.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal){
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes(){
        return ["data-name", "data-location", "data-image", "data-months", "data-time"];
    }

    render(){
        // Store and show the name, location, and image of fish
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "<i>name...</i>";
        const location = this.getAttribute('data-location') ? this.getAttribute('data-location') : "";
        const months = this.getAttribute('data-months') ? this.getAttribute('data-months') : "";
        const time = this.getAttribute('data-time') ? this.getAttribute('data-time') : "";
        const imageURL = this.getAttribute('data-image') ? this.getAttribute('data-image') : "";


        this.h2.innerHTML = `${name}`;
        this.p1.innerHTML = `Location: ${location}<br>Months: ${months}<br>Time: ${time}`;
        this.img.src = imageURL;


    }
} // end class

customElements.define('ac-card', ACCard);

