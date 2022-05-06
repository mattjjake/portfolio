import { paintData } from "./init.js";
import "./paint-layer.js";
import { loadFile } from "./utils.js";

// MODULE SCOPED VARIABLES
export let canvas = null;
let canvasGrid = null,
  ctx = null,
  ctxGrid = null,
  dragging = false,
  lineWidth = null,
  strokeStyle = null,
  lineCap = null,
  lineJoin = null,
  tool = null,
  grid = true,
  togglePP = true,
  width = 700,
  rectX = 0,
  rectY = 0,
  height = 500;

// CONSTANTS
const defaultLineWidth = 5;
const defaultStrokeStyle = "red";
const defaultLineCap = "round";
const defaultLineJoin = "round";
export const layers = [];

// HELPER FUNCTIONS
// Returns mouse position in local coordinate system of element
const getMouse = (evt) => {
  const mouse = {};
  mouse.x = evt.pageX - evt.target.offsetLeft;
  mouse.y = evt.pageY - evt.target.offsetTop;
  return mouse;
};

// Return touch position in local coordinates of canvas
const getTouch = (e) => {
  const touch = {};
  var bounds = canvas.getBoundingClientRect();
  touch.x = e.touches[0].clientX - bounds.left;
  touch.y = e.touches[0].clientY - bounds.top;
  return touch;
};

// Grabs local storage drawing and draw to screen
const getStored = () => {
  // Test if storage is present first
  if (localStorage.getItem("jaj8571-p2-settings")) {
    if (JSON.parse(localStorage.getItem("jaj8571-p2-settings")).layersStore.length != 0) {

      // Get data
      paintData.layersStore = JSON.parse(localStorage.getItem("jaj8571-p2-settings")).layersStore;
      paintData.layerNames = JSON.parse(localStorage.getItem("jaj8571-p2-settings")).layerNames;

      // Set initial main layer
      let img = new Image;
      ctx.beginPath();
      img.onload = function () {
        ctx.drawImage(img, 0, 0);
        document.querySelector("#layers").children[0].name = paintData.layerNames[0];
      };
      img.src = paintData.layersStore[0];
      document.querySelector("#layers").children[0].select = false;
      

      // Set all other layers
      for (let i = 1; i < paintData.layersStore.length; i++)
      {
        let img = new Image;
        addLayer();

        img.onload = function () {
          document.querySelector("#layers").children[i].select = true;
          SetLayer();
          ctx.beginPath();
          ctx.drawImage(img, 0, 0);
          document.querySelector("#layers").children[i].select = false;
          document.querySelector("#layers").children[i].name = paintData.layerNames[i];
        };
        
        img.src = paintData.layersStore[i];

      }
      document.querySelector("#layers").children[0].select = true;
    }
  }
};

// Get name if present in local storage
const getName = (num) => {
  if (localStorage.getItem("jaj8571-p2-settings")) {
    if (JSON.parse(localStorage.getItem("jaj8571-p2-settings")).layerNames) {
      paintData.layerNames = JSON.parse(localStorage.getItem("jaj8571-p2-settings")).layerNames;

      return paintData.layerNames[num];
    }
  }
  return null;
};

// Save the state of the canvas to local storage
export const saveState = () => {
  paintData.layersStore = [];

  for (let i = 0; i < layers.length; i++) {
    let newCanvas = document.createElement('canvas');
    let newCtx = newCanvas.getContext('2d');
    newCanvas.width = width;
    newCanvas.height = height;
    newCtx.beginPath();
    newCtx.drawImage(layers[i], 0, 0);
    paintData.layersStore[i] = newCanvas.toDataURL();
  }

  if(paintData.layerNames.length > paintData.layersStore.length)
  {
    paintData.layerNames = paintData.layerNames.slice(0, paintData.layersStore.length);
  }

  localStorage.setItem("jaj8571-p2-settings", JSON.stringify(paintData));
}

// Code sourced from:
// https://css-tricks.com/converting-color-spaces-in-javascript/
function RGBToHex(r, g, b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

  return "#" + r + g + b;
}

// Code sourced from:
// https://stackoverflow.com/questions/17221802/canvas-eyedropper
function getPixelColor(x, y) {
  var pxData = ctx.getImageData(x, y, 1, 1);
  return ("rgb(" + pxData.data[0] + "," + pxData.data[1] + "," + pxData.data[2] + ")");
}

// EVENT CALLBACK FUNCTIONS
// MOUSE INPUT
// On mouse down, start the ctx or similar tool specification
const doMousedown = (evt) => {
  dragging = true;
  // get location of mouse in canvas coordinates
  const mouse = getMouse(evt);
  SetLayer();

  if (tool == "tool-pencil" || tool == "tool-eraser" || tool == "tool-line"
    || tool == "tool-rectangle") {
    ctx.beginPath();
    ctx.moveTo(mouse.x, mouse.y);
    rectX = mouse.x;
    rectY = mouse.y;
  }
  else if (tool == "tool-eyedropper") {
    strokeStyle = getPixelColor(mouse.x, mouse.y);
    // https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
    let hex = strokeStyle.match(/\d+/g);
    hex = RGBToHex(parseInt(hex[0]), parseInt(hex[1]), parseInt(hex[2]));
    document.querySelector("#strokestyle-chooser").value = hex;
  }

  saveState();
};

// On moving the mouse, draw the line or similar tool specification
const doMousemove = (evt) => {
  // bail out if the mouse button is not down
  if (!dragging) return;
  // get location of mouse in canvas coordinates
  const mouse = getMouse(evt);

  if (tool == "tool-eyedropper") {
    strokeStyle = getPixelColor(mouse.x, mouse.y);
    // https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
    let hex = strokeStyle.match(/\d+/g);
    hex = RGBToHex(parseInt(hex[0]), parseInt(hex[1]), parseInt(hex[2]));
    document.querySelector("#strokestyle-chooser").value = hex;
    return;
  }

  if (tool == "tool-pencil") {
    ctx.globalCompositeOperation = "source-over";
    // PENCIL TOOL
    // set ctx.strokeStyle and ctx.lineWidth to correct “module variable” values
    // YOUR CODE HERE
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;

    // draw a line to x,y of mouse
    // YOUR CODE HERE
    ctx.lineTo(mouse.x, mouse.y);

    // stroke the line
    // YOUR CODE HERE
    ctx.stroke();
  }
  if (tool == "tool-eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;

    // draw a line to x,y of mouse
    // YOUR CODE HERE
    ctx.lineTo(mouse.x, mouse.y);

    // stroke the line
    // YOUR CODE HERE
    ctx.stroke();
  }



  saveState();
};

// On mouse up, draw a line or rectangle as specified by user
const doMouseup = (evt) => {
  dragging = false;
  if (tool == "tool-line") {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    const mouse = getMouse(evt);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.stroke();
  }
  else if (tool == "tool-rectangle") {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    const mouse = getMouse(evt);
    ctx.lineTo(mouse.x, rectY);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.lineTo(rectX, mouse.y);
    ctx.lineTo(rectX, rectY);
    ctx.stroke();
  }
  ctx.closePath();

  saveState();
};

// If mouse dragged out of canvas, close the path.
const doMouseout = (evt) => {
  dragging = false;
  ctx.closePath();

  saveState();
};

// TOUCH INPUT
// On touch start, start path
const doTouchstart = (e) => {
  e.preventDefault();
  const touch = getTouch(e);
  dragging = true;
  SetLayer();
  if (tool == "tool-pencil" || tool == "tool-eraser" || tool == "tool-line"
    || tool == "tool-rectangle") {
    ctx.beginPath();
    ctx.moveTo(touch.x, touch.y);
    rectX = touch.x;
    rectY = touch.y;
  }
  else if (tool == "tool-eyedropper") {
    strokeStyle = getPixelColor(touch.x, touch.y);

    // Code sourced from:
    // https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
    let hex = strokeStyle.match(/\d+/g);
    hex = RGBToHex(parseInt(hex[0]), parseInt(hex[1]), parseInt(hex[2]));
    document.querySelector("#strokestyle-chooser").value = hex;
  }


  saveState();
};

// On moving across screen, draw path and determine pen pressure
const doTouchmove = (e) => {
  e.preventDefault();
  const touch = getTouch(e);
  if (!dragging) return;
  if (tool == "tool-pencil") {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = strokeStyle;
    if (togglePP) {
      // Only if force is supported on device, return
      if (e.touches[0].force != 0.0) {
        ctx.lineWidth = e.touches[0].force * lineWidth;
      }
    }
    else {
      ctx.lineWidth = lineWidth;
    }
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;


    ctx.lineTo(touch.x, touch.y);
    ctx.stroke();
  }
  else if (tool == "tool-eyedropper") {
    strokeStyle = getPixelColor(touch.x, touch.y);
    // https://stackoverflow.com/questions/10970958/get-a-color-component-from-an-rgb-string-in-javascript
    let hex = strokeStyle.match(/\d+/g);
    hex = RGBToHex(parseInt(hex[0]), parseInt(hex[1]), parseInt(hex[2]));
    document.querySelector("#strokestyle-chooser").value = hex;
  }
  else if (tool == "tool-eraser") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.strokeStyle = "rgba(255,255,255,1)";
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;


    ctx.lineTo(touch.x, touch.y);
    ctx.stroke();
  }


  saveState();
};

// On ending the touch, stroke the tool
const doTouchend = (e) => {
  e.preventDefault();

  dragging = false;
  if (tool == "tool-line") {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    ctx.lineTo(e.changedTouches[e.changedTouches.length - 1].pageX - BB.left,
      e.changedTouches[e.changedTouches.length - 1].pageY - BB.top);
    ctx.stroke();
  }
  else if (tool == "tool-rectangle") {
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;
    ctx.lineTo(e.changedTouches[e.changedTouches.length - 1].pageX - BB.left, rectY);
    ctx.lineTo(e.changedTouches[e.changedTouches.length - 1].pageX - BB.left, e.changedTouches[e.changedTouches.length - 1].pageY - BB.top);
    ctx.lineTo(rectX, e.changedTouches[e.changedTouches.length - 1].pageY - BB.top);
    ctx.lineTo(rectX, rectY);
    ctx.stroke();
  }
  ctx.closePath();
  saveState();
};

// Invalide file names
const invalidFileChar = ["#", "%", "&", "{", "}", "<", ">", "\\", "*", "?", "/",
  ":", "@", "!", "$", "\'", "\"", "+", "=", "`", "|", "."];

const doExport = () => {
  // Activate the modal for options
  document.querySelector("#export-modal").classList.add("is-active");

  // Default values
  let fileName = "My Drawing";
  let fileExt = "jpg";
  let fileRatio = 100;

  // Set up selection box for multiple layers
  let selection = document.createElement('select');
  selection.setAttribute('multiple', true);
  selection.setAttribute('hidden', true);
  selection.id = "mult";

  let optionDefault = document.createElement('option');
  optionDefault.value = "none";
  optionDefault.innerHTML = "--Choose layers with ctrl--";

  optionDefault.setAttribute('disabled', true);

  selection.appendChild(optionDefault);

  for (let i = 0; i < document.querySelector("#layers").children.length; i++) {
    let option = document.createElement('option');
    option.value = document.querySelector("#layers").children[i].name;
    option.innerHTML = document.querySelector("#layers").children[i].name;
    selection.appendChild(option);
  };

  document.querySelector(".modal-card-body").appendChild(selection);

  // Set up event listeners to navigate modal
  // Close modal
  document.querySelector("#btn-cancel").onclick = () => {
    document.querySelector(".modal-card-body").removeChild(document.querySelector("#mult"));
    document.querySelector("#export-modal").classList.remove("is-active");

  };
  document.querySelector("#btn-close").onclick = () => {
    document.querySelector(".modal-card-body").removeChild(document.querySelector("#mult"));
    document.querySelector("#export-modal").classList.remove("is-active");
  };

  // Option changes file export variables
  document.querySelector("#file-chooser").onchange = () => {
    fileExt = document.querySelector("#file-chooser").value;
  };
  document.querySelector("#input-ratio").onchange = () => {
    fileRatio = document.querySelector("#input-ratio").value / 100;
  };
  document.querySelector("#input-file-name").onchange = () => {
    if (invalidFileChar.some(term => document.querySelector("#input-file-name").value.includes(term))) {
      document.querySelector("#char-warning").style.display = "block";
      document.querySelector("#char-warning").innerHTML = "Error! File name can not include characters #%&{}&lt;&gt;\*?/:@!$\'\"+=`|."
    }
    else {
      if (document.querySelector("#char-warning").style.display == "block") {
        document.querySelector("#char-warning").style.display = "none";
      }
      fileName = document.querySelector("#input-file-name").value;
    }
  };

  // If user would export multiple layers, set up dropdown for their options
  document.querySelector("#export-layers").onchange = () => {
    if(document.querySelector("#export-layers").value == "some")
    {
      document.querySelector(".modal-card-body").lastChild.removeAttribute("hidden");
    }
    else {
      if (document.querySelector("#char-warning").style.display != "none")
      {
        document.querySelector("#char-warning").style.display = "none";
      }
      document.querySelector(".modal-card-body").lastChild.setAttribute("hidden", true);
    }
  };

  // Export drawing
  document.querySelector("#btn-confirm-export").onclick = () => {
    // Get variable to store single layer canvas
    // Draw each layer on top in order
    let newCanvas;
    if (document.querySelector("#export-layers").value == "all") {
      newCanvas = document.createElement('canvas');
      let newCtx = newCanvas.getContext('2d');
      newCanvas.width = width;
      newCanvas.height = height;
      newCtx.beginPath();
      for (let i = 0; i < layers.length; i++) {

        newCtx.drawImage(layers[i], 0, 0);
      }
    }
    // User chose to export some layers from a selection of multiple
    else if (document.querySelector("#export-layers").value == "some") {
      let layersCollect = document.querySelector("#mult").selectedOptions;
      if (layersCollect.length == 0)
      {
        document.querySelector("#char-warning").style.display = "block";
        document.querySelector("#char-warning").innerHTML = "Error! Please select at least one layer."
        return;
      }
      else
      {
        document.querySelector("#char-warning").style.display = "none";
      }
      newCanvas = document.createElement('canvas');
      let newCtx = newCanvas.getContext('2d');
      newCanvas.width = width;
      newCanvas.height = height;
      newCtx.beginPath();

      // Iterate through layers
      for (let i = 0; i < document.querySelector("#layers").children.length; i++) {
        // Iterate through collection to compare name values
        for (let j = 0; j < layersCollect.length; j++)
        {
          if (j == document.querySelector("#layers").children[i].num) {

              newCtx.drawImage(layers[i], 0, 0);
          }

        }

      }
    }
    else if (document.querySelector("#export-layers").value == "single"){

      for (let i = 0; i < document.querySelector("#layers").children.length; i++) {
        if (document.querySelector("#layers").children[i].select == "true") {


            newCanvas = layers[i];

        }
      }
    }
    else
    {
      // warning
    }
    const data = newCanvas.toDataURL(`image/${fileExt}`, fileRatio);
    const link = document.createElement("a");
    link.download = `${fileName}.${fileExt}`;
    link.href = data;
    link.click();
    link.remove();


  };

};

// UTILITY FUNCTIONS
const drawGrid = (ctx, color, cellWidth, cellHeight) => {
  // save the currentd drawing state as it existed before this function was called
  ctx.save();

  // set some drawing state variables
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // vertical lines all set!
  for (let x = cellWidth + 0.5; x < ctx.canvas.width; x += cellWidth) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, ctx.canvas.height);
    ctx.stroke();
  }

  /*
  Need horizontal lines!
  You write it!
  */
  for (let y = cellHeight + 0.5; y < ctx.canvas.height; y += cellHeight) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(ctx.canvas.width, y);
    ctx.stroke();
  }

  // restore the drawing state
  ctx.restore();
};
const doClear = () => {
  SetLayer();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  saveState();
};
const doLineWidthChange = (evt) => {
  lineWidth = evt.target.value;
  document.querySelector("#slide-num").innerHTML = document.querySelector("#linewidth-chooser").value;
};
const doToolChange = (evt) => {
  tool = evt.target.value;
  if (tool == "tool-pencil")
  {
    let selection = document.createElement('select');
    selection.id = "pencil-type";
    let option = document.createElement('option');
    option.value = "line-round";
    option.innerHTML = "Round";
    selection.appendChild(option);

    let option1 = document.createElement('option');
    option1.value = "line-square";
    option1.innerHTML = "Square";
    selection.appendChild(option1);

    if (lineCap == "square")
    {
      option1.setAttribute('selected', true);
    }
    else
    {
      option.setAttribute('selected', true);
    }

    document.querySelector("#controls").appendChild(selection);

    document.querySelector("#pencil-type").onchange = () => {
      if (document.querySelector("#pencil-type").value == "line-square")
      {
        lineCap = "square";
        lineJoin = "miter";
      }
      else if (document.querySelector("#pencil-type").value == "line-round")
      {
        lineCap = "round";
        lineJoin = "round";
      }
    };
  }
  else {
    if (document.querySelector("#pencil-type"))
    {
      document.querySelector("#controls").removeChild(document.querySelector("#pencil-type"));
    }
  }
};
const doStrokeStyleChange = (evt) => {
  strokeStyle = evt.target.value;
};
const doGrid = () => {
  if (grid == false) {
    grid = true;
    drawGrid(ctxGrid, "lightgray", 10, 10);
  }
  else {
    grid = false;
    ctxGrid.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
};
const doPenPressure = () => {
  if (document.querySelector("#pen-pressure").checked) {
    togglePP = true;
  }
  else {
    togglePP = false;
  }
};

// Layer utilities
const addLayer = () => {
  if (layers.length < 8) {
    let layer = document.createElement('canvas');
    layer.style.position = "absolute"
    layer.id = `${layers.length}`;
    layer.width = width;
    layer.height = height;
    layer.style["z-index"] = layers.length;

    document.querySelector("#canvases").appendChild(layer);
    let layerNode = document.createElement("paint-layer");
    layerNode.dataset.num = layers.length;
    if (getName(layers.length) != null)
    {
      layerNode.dataset.name = getName(layers.length);
    }

    document.querySelector("#layers").appendChild(layerNode);
    layers.push(layer);
  }
  else {
    document.querySelector("#over-layers").classList.add("is-active");
  }
};

const SetLayer = () => {

  for (let i = 0; i < document.querySelector("#layers").children.length; i++) {
    if (document.querySelector("#layers").children[i].select == "true") {
      // If the layer is selected, that is the context/canvas in which we draw

        ctx = layers[i].getContext("2d");
        ctx.lineCap = "round"; // "butt", "round", "square" (default "butt")
        ctx.lineJoin = "round";
    }
  }
};

// Resize canvas 
const doCanvasSize = () => {
  document.querySelector("#canvas-size").classList.add("is-active");
  document.querySelector("#btn-cancel-size").onclick = () => {
    document.querySelector("#canvas-size").classList.remove("is-active");

  };
  document.querySelector("#btn-close-size").onclick = () => {
    document.querySelector("#canvas-size").classList.remove("is-active");
  };

  document.querySelector("#btn-create-size").onclick = () => {


    if (document.querySelector("#input-width").value > 1000 || document.querySelector("#input-height").value > 1000) {
      document.querySelector("#size-danger").innerHTML = "Values can not be greater than 1000px.";
    }
    else if (document.querySelector("#input-width").value < 1 || document.querySelector("#input-height").value < 1) {
      document.querySelector("#size-danger").innerHTML = "Values must be at least 1px.";
    }
    else {
      width = document.querySelector("#input-width").value;
      height = document.querySelector("#input-height").value;

      canvasGrid.width = width;
      canvasGrid.height = height;

      for (let i = 0; i < layers.length; i++) {
        layers[i].width = width;
        layers[i].height = height;
      }
      canvas = layers[0];

      document.querySelector("#main").width = width;
      document.querySelector("#main").height = height;
      document.querySelector("#canvas-size").classList.remove("is-active");
    }


  };

};

// Initalize the app page
const init = () => {
  // Variables
  let mainCanvas = document.createElement('canvas');

  mainCanvas.style.position = "absolute"
  mainCanvas.id = `${0}`;
  mainCanvas.width = width;
  mainCanvas.height = height;
  mainCanvas.style["z-index"] = 0;


  
  document.querySelector("#canvases").appendChild(mainCanvas);
  let mainLayer = document.createElement("paint-layer");
  mainLayer.dataset.num = `${0}`;
  mainLayer.dataset.select = true;
  if (getName(0) != null)
  {
    mainLayer.dataset.name = getName(0);
  }
  document.querySelector("#layers").appendChild(mainLayer);
  layers.push(mainCanvas);
  canvas = mainCanvas;
  
  canvasGrid = document.querySelector("#grid");
  ctx = canvas.getContext("2d");
  ctxGrid = canvasGrid.getContext("2d");


  strokeStyle = defaultStrokeStyle;
  lineWidth = defaultLineWidth;
  lineCap = defaultLineCap;
  lineJoin = defaultLineJoin;

  // Initial context properties
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.lineCap = lineCap; // "butt", "round", "square" (default "butt")
  ctx.lineJoin = lineJoin; // "round", "bevel", "miter" (default “miter")

  // Set up canvas
  drawGrid(ctxGrid, "lightgray", 10, 10);

  getStored();

  // Event listeners for controls
  document.querySelector("#linewidth-chooser").onchange = doLineWidthChange;
  document.querySelector("#tool-chooser").onchange = doToolChange;
  document.querySelector("#strokestyle-chooser").onchange = doStrokeStyleChange;
  document.querySelector("#btn-clear").onclick = doClear;
  document.querySelector("#btn-export").onclick = doExport;
  document.querySelector("#btn-grid").onclick = doGrid;
  document.querySelector("#slide-num").innerHTML = document.querySelector("#linewidth-chooser").value;
  document.querySelector("#pen-pressure").onclick = doPenPressure;
  document.querySelector("#btn-layer").onclick = addLayer;
  document.querySelector("#btn-size").onclick = doCanvasSize;

  // Module event listeners
  document.querySelector("#btn-closeover").onclick = () => {
    document.querySelector("#over-layers").classList.remove("is-active");
  };
  document.querySelector("#btn-okay").onclick = () => {
    document.querySelector("#over-layers").classList.remove("is-active");
  };


  // Touch/mouse input listeners
  canvasGrid.onmousedown = doMousedown;
  canvasGrid.onmousemove = doMousemove;
  canvasGrid.onmouseup = doMouseup;
  canvasGrid.onmouseout = doMouseout;

  canvasGrid.ontouchstart = doTouchstart;
  canvasGrid.ontouchmove = doTouchmove;
  canvasGrid.ontouchend = doTouchend;
};

// Run init
init();