const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<nav class="navbar has-shadow is-white">
<!-- logo / brand-->
<div class="navbar-brand">
  <a class="navbar-item" href="home.html">
    <img src="images/logo.png" alt="site logo" style="max-height: 50px" class="py-2 px-2">
  </a>
  <a class="navbar-burger" style="height: 70px" id="burger">
    <span></span>
    <span></span>
    <span></span>
  </a>
</div>
<div class="navbar-menu" id="nav-links">
<div class="navbar-end">
    <a id="Home" class="navbar-item" href="home.html">Home</a>
    <a id="Documentation" class="navbar-item" href="documentation.html">Documentation</a>
    <a id="Application" class="navbar-item" href="app.html">Application</a>
    <a id="Favorites" class="navbar-item" href="favorites.html">Favorites</a>
    <a id="Community" class="navbar-item" href="community.html">Community</a>
</div>
</div>
</nav>
`;

class ACNav extends HTMLElement{
    constructor(){
      super();

      // Shadow DOM
      // 1 - attach shadow DOM tree to instance
      this.attachShadow({mode: "open"});

      // 2 - clone and append
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      this.nav = this.shadowRoot.querySelector("#nav");
    }

    // 5 - called when component added
    connectedCallback(){
        this.render();
        // mobile menu
        const burgerIcon = this.shadowRoot.querySelector("#burger");
        const navbarMenu = this.shadowRoot.querySelector("#nav-links");

        burgerIcon.addEventListener("click", () => {
        navbarMenu.classList.toggle("is-active");
        });
    }

    disconnectedCallback(){
    }


    // 6 - helper method that displays attributes
    render(){
        //grab and assign default
        const here = this.getAttribute('data-here') ? this.getAttribute('data-here') : "Home";

        this.shadowRoot.querySelector(`#${here}`).innerHTML = `<b>${here}</b>`;
    }
  } 
	
  customElements.define('ac-nav', ACNav);