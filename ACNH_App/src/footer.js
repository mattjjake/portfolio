const template = document.createElement("template");
template.innerHTML = `
<style>
:host{
    display: block;
}
span{
    color: white;
    font-family: sans-serif;
}
</style>
<span></span>
<hr>
`;

class ACFooter extends HTMLElement{
    constructor(){
      super();

      // Shadow DOM
      // 1 - attach shadow DOM tree to instance
      this.attachShadow({mode: "open"});

      // 2 - clone and append
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.footer = this.shadowRoot.querySelector("footer");
    }

    // 5 - called when component added
    connectedCallback(){
        this.render();
    }

    disconnectedCallback(){
    }


    // 6 - helper method that displays attributes
    render(){
        //grab and assign default
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "John Doe";
        const text = this.getAttribute('data-text') ? this.getAttribute('data-text') : "Page Title";
        const org = this.getAttribute('data-org') ? this.getAttribute('data-org') : "Game Org";

        this.shadowRoot.querySelector("span").innerHTML = `&copy; Copyright ${name}, ${text}, ACNH is owned by ${org}`;
    }
  } 
	
  customElements.define('ac-footer', ACFooter);