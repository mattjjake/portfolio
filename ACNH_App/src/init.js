import "./firebase-write.js"
import "./footer.js"
import "./header.js";
import "./ac-card.js";
import "./ac-nav.js";
import { loadFile } from "./utils.js";
import { writeSearchData, writeLocData, writeMonthData } from "./firebase-write.js";

//json obj
let accJson = {};
const acData = {
  "favList": [],
  "storedUI" : "",
  "storedLoc" : "",
  "storedMonth" : ""
};

// Helper for month selection and organization
const monthName = {
  1  : "January",
  2  : "February",
  3  : "March",
  4  : "April",
  5  : "May",
  6  : "June",
  7  : "July",
  8  : "August",
  9  : "September",
  10 : "October",
  11 : "November",
  12 : "December"
};

const init = () => {
    // Load API
    const url = "https://acnhapi.com/v1/fish";
    loadFile(url, jsonLoaded);

    // Get the stored data if it exists
    if (localStorage.getItem("jaj8571-p1-settings"))
    {
      acData.storedUI = JSON.parse(localStorage.getItem("jaj8571-p1-settings")).storedUI;
      acData.storedLoc = JSON.parse(localStorage.getItem("jaj8571-p1-settings")).storedLoc;
      acData.storedMonth = JSON.parse(localStorage.getItem("jaj8571-p1-settings")).storedMonth;
      acData.favList = JSON.parse(localStorage.getItem("jaj8571-p1-settings")).favList;
    } 

    // If on app page, allow search clearing
    if (document.querySelector("#clear-search"))
    {
      document.querySelector("#clear-search").onclick = () => {
        document.querySelector("#clear-search").classList.add("is-loading");
        removeAllChildNodes(document.querySelector(".card-list"));
        document.querySelector("#clear-search").classList.remove("is-loading");
      };
    }
};

// Remove child nodes, 
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

// Set json and set select menu
const jsonLoaded = json => {
  accJson = json;

  // If creature select needs to be done
  if (document.querySelector("#creature-select"))
  {
    // Create options for select control
    const optionHTML = Object.keys(accJson).map(acc => `<option value="${accJson[acc]["file-name"]}">
    ${accJson[acc]["file-name"]}</option>`).join("");
    const select = document.querySelector("#creature-select");
    select.innerHTML = `<option value="none" selected disabled hidden>&lt;Choose a Fish&gt;</option>`;
    select.innerHTML += optionHTML;

    // On search click, search the select
    document.querySelector("#search").onclick = selectChange;

    // on searchloc click, search
    document.querySelector("#search-loc").onclick = locChange;

    // on searchmonth click, search
    document.querySelector("#month-search").onclick = monthChange;


    // On select change, write to local storage
    document.querySelector("#creature-select").onchange = () => {
      acData.storedUI = document.querySelector("#creature-select").value;
      localStorage.setItem("jaj8571-p1-settings", JSON.stringify(acData));
    };

    // If a select is stored, update it
    if(acData.storedUI){
      document.querySelector("#creature-select").value = acData.storedUI;
    }

    // On select change, write to local storage
    document.querySelector("#location-select").onchange = () => {
      acData.storedLoc = document.querySelector("#location-select").value;
      localStorage.setItem("jaj8571-p1-settings", JSON.stringify(acData));
    };

    // If a select is stored, update it
    if(acData.storedLoc){
      document.querySelector("#location-select").value = acData.storedLoc;
    }

    // On select change, write to local storage
    document.querySelector("#month-select").onchange = () => {
      acData.storedMonth = document.querySelector("#month-select").value;
      localStorage.setItem("jaj8571-p1-settings", JSON.stringify(acData));
    };
    
    // If a select is stored, update it
    if(acData.storedMonth){
      document.querySelector("#month-select").value = acData.storedMonth;
    }
  }
  
};

// Search by location
const locChange = () => {
  document.querySelector("#search-loc").classList.add("is-loading");
  let locVal = document.querySelector("#location-select").value;
  writeLocData(locVal);
  for (let c of document.querySelector("#creature-select"))
 {
   if (c.value != "none"){
     if (accJson[c.value].availability.location == locVal)
     {
      showCreature(accJson[c.value]);
     }
     // Special
     else if (locVal == "Special")
     {
       // If it is not none OR any of the three, it's a special option
      if (accJson[c.value].availability.location != "Pond" &&
      accJson[c.value].availability.location != "River" &&
      accJson[c.value].availability.location != "Sea")
      {
        showCreature(accJson[c.value]);
      }
     }
   }
 }

 document.querySelector("#search-loc").classList.remove("is-loading");
};

// Search by month
const monthChange = () => {
  document.querySelector("#month-search").classList.add("is-loading");
  let monthVal = document.querySelector("#month-select").value;
  writeMonthData(monthName[monthVal]);
  for (let c of document.querySelector("#creature-select"))
 {
   if (c.value != "none"){
    if (accJson[c.value].availability["month-northern"] == "")
    {
      showCreature(accJson[c.value]);
    }
    else if (accJson[c.value].availability["month-northern"].includes("-") == false)
    {
      if (accJson[c.value].availability["month-northern"] == monthVal)
      {
        showCreature(accJson[c.value]);
      }
    }
    else
    {

      let monthRange = accJson[c.value].availability["month-northern"].split("-");
      let start = parseInt(monthRange[0]);
      let end = parseInt(monthRange[1]);
      console.log(start);
      console.log(end);
      // Loop through the range until you get to the end month

        for (let i = start; i != end; i++)
        {

          // If to december, switch to january
          if (i > 12)
          {
            i = 1;
          }
          // If in the month, show
          if (i == monthVal)
          {
            showCreature(accJson[c.value]);
          }
        }
    }
   }

  }
  document.querySelector("#month-search").classList.remove("is-loading");
}

// Show creature upon select and search
const selectChange = () => {
  document.querySelector("#search").classList.add("is-loading");
  const accID = document.querySelector("#creature-select").value;
  writeSearchData(document.querySelector("#creature-select").value);
  console.log(accID);
  if(accID == 0) return; 
  const accObj = accJson[accID]; 
  if(accObj) showCreature(accObj);
  document.querySelector("#search").classList.remove("is-loading");
};

// Show the creature by creating an ac-card component
export const showCreature = accObj =>{
  const acCard = document.createElement("ac-card");
  acCard.dataset.name = accObj["file-name"] ?? "no name found";
  acCard.dataset.location = accObj.availability.location ?? "no location found";

  if (accObj.availability["month-northern"] == "")
  {
    acCard.dataset.months = "All Year"
  }
  else if (accObj.availability["month-northern"].includes("-") == false)
  {
    acCard.dataset.months = `${monthName[parseInt(accObj.availability["month-northern"])]}`;
  }
  else
  {
    let monthsAvail = accObj.availability["month-northern"].split("-");
    let start = parseInt(monthsAvail[0]);
    let end = parseInt(monthsAvail[1]);
    acCard.dataset.months = `${monthName[start]} - ${monthName[end]}`;
  }

  if (accObj.availability.time == "")
  {
    acCard.dataset.time = "All Day"
  }
  else
  {
    acCard.dataset.time = accObj.availability.time ?? "No time found";
  }
  console.log(accObj.availability["month-northern"]);
  acCard.dataset.image = accObj.image_uri ?? "no img found";
  document.querySelector(".card-list").appendChild(acCard);

  // favorite 
  let listID = "jaj8571-p1-settings";

  // Let user fav, but only once
  if (acData.favList.includes(acCard.dataset.name))
  {
    acCard.button.innerHTML = "Fav'd";
  }
  else
  {
    acCard.button.addEventListener("click", function(){       
      acData.favList.push(accObj["file-name"]);
      localStorage.setItem("jaj8571-p1-settings", JSON.stringify(acData));
    }, {once: true}) 
  }

};

window.onload = init;