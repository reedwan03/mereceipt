// console.log(window)

var outerSwitch = document.querySelector(".outer");
var innerSwitch = document.querySelector(".inner");

// SELECT FORM FOR USER INPUTS
var userForm = document.querySelector(".userinputs");

// SELECT NAME INPUT
var nameInput = document.querySelector("#c-name");
var userName = document.querySelector(".name");

// SELECT DATE INPUT
var dateInput = document.querySelector("#mydate");
var dateRender = document.querySelector(".rh");

// RENDER INVOICE DETAILS
var invRend = document.querySelector(".lh");

// SELECT SERVICE INPUT & DETAILS
var serviceForm = document.querySelector(".service-form");
var serviceInput = document.querySelector(".service-input");
var serviceRend = document.querySelector(".left");
var priceInput = document.querySelector(".amount-input");
var priceRend = document.querySelector(".pric");

// SELECT CONTAINER FOR SERVICE INPUTS
var listContainer = document.querySelector(".iteming");
var buttonCont = document.querySelector(".btns");

// SELECT TOTAL
var myTotal = document.querySelector(".number");

// SELECT EACH PAGE
const receiptList = document.querySelector(".mylist");
const addReceiptForm = document.querySelector(".user-info");
const receiptSection = document.querySelector(".formContainer");

const darkColors = () => {
  var rootColors = document.querySelector(":root");

  rootColors.getElementsByClassName.setProperty("--backgroundcolor", "black");
};

// BCK BUTTON CLICK EVENT LISTENER
const toBack = document
  .querySelector(".back-arrow")
  .addEventListener("click", () => {
    receiptList.classList.remove("no-display");
    addReceiptForm.classList.add("no-display");
    receiptSection.classList.add("no-display");

    renderList();
  });

// DISPLAY HOMEPAGE
const homePage = document
  .querySelector(".logo")
  .addEventListener("click", () => {
    receiptList.classList.remove("no-display");
    addReceiptForm.classList.add("no-display");
    receiptSection.classList.add("no-display");

    renderList();
  });

// var currentTheme;

//  DISPLAY ON LOAD
window.addEventListener("DOMContentLoaded", () => {
  getLocalItems();

  var checkTheme = localStorage.getItem("theme");

  if (!checkTheme || checkTheme === "light") {
    innerSwitch.classList.remove("move");
  } else {
    innerSwitch.classList.add("move");
  }

  changeTheme(innerSwitch);

  // currenttheme = localStorage.getItem("theme");

  receiptList.classList.remove("no-display");
});

// DISPLAY NEXT PAGE ON ADD RECEIPT CLICK
const addReceiptBtn = document
  .querySelector(".new-receipt")
  .addEventListener("click", () => {
    receiptList.classList.add("no-display");
    addReceiptForm.classList.remove("no-display");
  });

// TOGGLE SWICTH POSITIONS
outerSwitch.addEventListener("click", () => {
  innerSwitch.classList.toggle("move");
  changeTheme(innerSwitch);
});

const changeTheme = (ins) => {
  var rootColors = document.querySelector(":root");

  if (ins.classList.contains("move")) {
    rootColors.style.setProperty("--backgroundcolor", "#000000");
    rootColors.style.setProperty("--littlelighter", "#333333");
    rootColors.style.setProperty("--white", "#222222");

    localStorage.setItem("theme", "dark");
  } else {
    rootColors.style.setProperty("--backgroundcolor", " #ececec");
    rootColors.style.setProperty("--littlelighter", "#cccccc");
    rootColors.style.setProperty("--white", "#ffffff");

    localStorage.setItem("theme", "light");
  }
};

// SET RECEIPT STATE
let currentReceipt;

// SET SERVICE STATE
let currentService;

// COLLECT EACH RECEIPT
let items = [];

const setLocalItems = () => {
  localStorage.setItem("receipt", JSON.stringify(items));
};

const getLocalItems = () => {
  if (!localStorage.getItem("receipt")) {
    return;
  }
  items = JSON.parse(localStorage.getItem("receipt"));

  renderList();
};

// COLLECT DATA FOR EACH RECEIPT, AFTER ADDING NAME AND DATE
userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // RECEIPT OBJECT
  const newInputs = {
    name: nameInput.value,
    date: dateInput.value,
    invNo: generateId(),
    services: [],
  };

  // GET VALUES FROM RECEIPT OBJECT
  const { date, name, invNo } = newInputs;

  //  DONT RENDER IF INPUT IS EMPTY
  if (!date.trim() || !name.trim()) {
    return;
  }
  // ADD INTO THE ITEMS ARRAY AS NEW RECEIPT
  items.push(newInputs);

  // RENDER TO UI BASED ON INVOICE ID
  renderReceipt(invNo);

  setLocalItems();

  // DISPLAY NEXT SECTION
});

// COLLECT DATA FOR EACH SERVICE INPUTS

serviceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // OBJECT FOR EACH SERVICE
  const newService = {
    service: serviceInput.value,
    price: parseFloat(priceInput.value),
    // UPDATE ON EDIT OR CREATE NEW ID
    id: currentService || generateId(),
  };

  // DONT RENDER IF INPUTS ARE EMPTY
  if (
    newService.service !== "" &&
    !isNaN(newService.price) &&
    newService.price > 0
  ) {
    // SET VALEUS TO NULL AFTER RENDERING
    serviceInput.value = "";
    priceInput.value = "";

    // GET RECEIPT BASED ON INV NO
    const myItem = items.find(
      (currentItem) => currentItem.invNo === currentReceipt
    );

    // IF NOT EDITING
    if (!currentService) {
      // ADD SERVICE TO THE SERVICES ARRAY
      myItem.services.push(newService);
      // ADD TO UI, EITHER THE NEW SERVICE OR ALL SERVICES UNDER & CALC TOTAL
      renderServices([newService], myItem.services);
    } else {
      // IF CURRENTSERVICE ADD ALL SERVICES TO UI AND CALC TOTAL
      myItem.services = myItem.services.map((service) => {
        if (service.id === currentService) {
          // console.log(service.id, currentService, newService);
          return newService;
        }

        return service;
      });

      renderServices(myItem.services);
    }
    // ALWAYS SET CURRENT SERVICE TO NULL IF NOT IN USE
    currentService = null;
  }

  setLocalItems();
});

// FUNCTION TO EDIT SERVICE

const editItem = function (element, id) {
  // LOOP THROUGH ITEMS ARRAY TO FIND SELSCTED RECEIPT SERVICE
  const findService = items
    .find((selectedItem) => selectedItem.invNo === currentReceipt)
    .services.find((service) => service.id === id);
  // SET VALUES
  priceInput.value = findService.price;
  serviceInput.value = findService.service;
  // DELETE FROM UI
  element.parentElement.parentElement.parentElement.classList.add(
    "no-pointer-event"
  );

  // SET CURRENT SERVICE
  currentService = findService.id;
  setLocalItems();
};

// FUNCTION TO DELETE RECEIPT

const deleteReceipt = (invNo) => {
  // FIND RECEIPT SELECTED TO DELETE FORM ITEMS
  const findReceipt = items.findIndex(
    (selectedItem) => selectedItem.invNo === invNo
  );

  // DELETE FROM ARRAY

  items.splice(findReceipt, 1);
  // RENDER TO UI
  renderList();
  setLocalItems();
};

// FUNCTION TO DELETE SERVICE
const deleteItem = (id) => {
  // FIND SELECTED RECEIPT SERVICE

  const findItem = items.find(
    (selectedItem) => selectedItem.invNo === currentReceipt
  );

  // FIND INDEX PF SELECTED RECEIPT SERVICE

  const serviceIndex = findItem.services.findIndex(
    (service) => service.id === id
  );

  // DELETE FROM ARRAY
  findItem.services.splice(serviceIndex, 1);
  // RENDER TO UI
  renderServices(findItem.services);
  setLocalItems();
};

// FUNCTION FOR INNERHTML RENDER
const myHtml = function (newService) {
  return `<div class="left">
    <p class="dv">${newService.service}</p>
    </div>
   <div class="righ">
   <div class="pric">
      <p class="pc">${newService.price}</p>
  </div>

  <div class="btns">
      <button class="edit" onclick="editItem(this, ${newService.id})">
          <ion-icon name="create-outline" class="myedit"></ion-icon>
      </button>
      <button class="delete" onclick="deleteItem(${newService.id})">

          <ion-icon name="close-circle-outline" class="mydelete"></ion-icon>
      </button>
  </div>


</div>`;
};

// GENERATE RANDOM NO FOR ID & INV NO

const generateId = () => parseFloat(Math.floor(Math.random() * 100000001));

// RENDER NEW RECEIPT VALUES OR RENDER EXISTING RECEIPT
const renderReceipt = (id) => {
  // FIND RECEIPT
  const receipt = items.find((currentItem) => currentItem.invNo === id);

  currentReceipt = receipt.invNo;

  userName.innerHTML = `<p class="recipi">${receipt.name}</p>`;
  nameInput.value = "";

  dateRender.innerHTML = `Date<p class="currentdate">${receipt.date}</p>`;
  dateInput.value = "";

  invRend.innerHTML = ` Inv number<p>#INV<span class="nos">${receipt.invNo}</span></p>`;

  receiptList.classList.add("no-display");
  addReceiptForm.classList.add("no-display");
  receiptSection.classList.remove("no-display");
  renderServices(receipt.services);
};

// RENDER RECEIPT LIST TO UI
const renderList = () => {
  // IF LIST IS EMPTY DISPLAY MESSAGE
  if (items.length === 0) {
    document.querySelector(".blank-rec").classList.remove("no-display");
  } else {
    document.querySelector(".blank-rec").classList.add("no-display");
  }

  // RENDER LIST
  const itemParent = document.querySelector(".receipt-list");
  itemParent.innerHTML = ``;
  items.forEach((item) => {
    const receiptList = document.createElement("li");
    receiptList.innerHTML = `<div class="item" onclick="findItemId(${item.invNo})">TO: <span>${item.name}</span></div><div class="delete" onclick="deleteReceipt(${item.invNo})"><ion-icon name="close-circle-outline" class="mydelete"></ion-icon></div>`;
    itemParent.appendChild(receiptList);
  });
};

const findItemId = (itemid) => {
  renderReceipt(itemid);
};

// RENDER SERVICES FOR RECEIPT

const renderServices = (services, optionItems) => {
  // IF RECEIPT IS NOT EXISTING
  if (!optionItems) {
    listContainer.innerHTML = ``;
  }

  for (var i = 0; i < services.length; i++) {
    var newItem = document.createElement("li");
    newItem.classList.add(".new-list");
    newItem.innerHTML = myHtml(services[i]);

    listContainer.appendChild(newItem);
  }

  addTotal(optionItems || services);
  // if (optionItems) {
  //   addTotal(optionItems);
  // } else {
  //   addTotal(services);
  // }
};

// ADD PRICE TOTALS
const addTotal = (services) => {
  let total = 0;
  for (var i = 0; i < services.length; i++) {
    total += services[i].price;
  }
  myTotal.innerText = total;
};

document.querySelector(".download").addEventListener("click", () => {
  // Default export is a4 paper, portrait, using millimeters for units
  // console.log(window)
  const rec = document.querySelector(".receipt-ui");
  const doc = new window.jspdf.jsPDF("p", "px", "a4");

  doc.html(rec, {
    callback: function (doc) {
      doc.save();
    },
    x: 90,
    y: 90,
    x1: 70,
    y1: 70,
    autoPaging: "text",
  });
});
