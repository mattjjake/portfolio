const template = document.createElement("template");
template.innerHTML = `
<style>
:host{
    display: block;
    padding: 2rem 5rem;
    font-style: italic;
}
span{
    color: black;
    font-family: sans-serif;
}
</style>
<span></span>
`;

class ACHeader extends HTMLElement{
    constructor(){
      super();

      // Shadow DOM
      // 1 - attach shadow DOM tree to instance
      this.attachShadow({mode: "open"});

      // 2 - clone and append
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.header = this.shadowRoot.querySelector("#header");
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
        const quote = this.getAttribute('data-quote') ? this.getAttribute('data-quote') : "Lorem Ipsum";

        this.shadowRoot.querySelector("span").innerHTML = `${name}: ${quote}`;
    }
  } 
	
  customElements.define('ac-header', ACHeader);