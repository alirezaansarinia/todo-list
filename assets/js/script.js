//#region : variables
const itemForm = document.querySelector("#item-form");
const itemInput = itemForm.querySelector("#item-input");
const inputInvalid = itemForm.querySelector("#input-invalid");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector("#items-clear");
const itemFilter = document.querySelector("#filter");
const formBtn = itemForm.querySelector("button");
let isEditMode = false;
//#endregion

//#region : add item to DOM & localStorage
const addItem = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //#region : item input validation
  if (newItem === "") {
    inputInvalid.textContent = "Please enter your item";
    return;
  } else {
    inputInvalid.textContent = "";
  }
  //#endregion

  //#region : check if edit mode & no duplicate value
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeItemFromLocalStorage(itemToEdit.textContent);

    itemToEdit.remove();

    formBtn.innerHTML = "<i class='bi bi-plus'></i> <span>Add Item</span>";
    formBtn.classList.replace("btn-primary", "btn-dark");

    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      inputInvalid.textContent = "This item you entered is already existed!";

      return;
    } else {
      inputInvalid.textContent = "";
    }
  }
  //#endregion

  //#region : add item to DOM
  addItemToDOM(newItem);
  //#endregion

  //#region : add item to localStorage
  addItemToLocalStorage(newItem);
  //#endregion

  //#region : clear input
  itemInput.value = "";
  //#endregion

  checkUI();
};

const addItemToDOM = (newItem) => {
  const li = document.createElement("li");
  li.className = "list-item";

  const textNode = document.createTextNode(newItem);

  const icon = document.createElement("i");
  icon.className = "bi bi-x fs-5 text-danger";

  li.appendChild(textNode);
  textNode.after(icon);
  itemList.appendChild(li);
};

const addItemToLocalStorage = (newItem) => {
  let itemsFromLocalStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromLocalStorage = [];
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem("items"));
  }

  itemsFromLocalStorage.push(newItem);
  localStorage.setItem("items", JSON.stringify(itemsFromLocalStorage));
};

const checkIfItemExists = (item) => {
  const itemsFromLocalStorage = getItemsFromLocalStorage();

  return itemsFromLocalStorage.includes(item);
};

itemForm.addEventListener("submit", addItem);
//#endregion

//#region : remove/edit-mode for an item from DOM & localStorage
const onClickItem = (e) => {
  if (e.target.classList.contains("bi-x")) {
    e.target.parentElement.remove();

    removeItemFromLocalStorage(e.target.parentElement.textContent);

    checkUI();
  } else {
    setItemToEditMode(e.target);
  }
};

const removeItemFromLocalStorage = (item) => {
  let itemsFromLocalStorage = getItemsFromLocalStorage();

  itemsFromLocalStorage = itemsFromLocalStorage.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(itemsFromLocalStorage));
};

const setItemToEditMode = (item) => {
  isEditMode = true;

  const items = itemList.querySelectorAll("li");
  items.forEach((i) => i.classList.remove("edit-mode"));

  item.classList.add("edit-mode");
  itemInput.value = item.textContent;

  formBtn.innerHTML =
    "<i class='bi bi-pencil-fill'></i> <span>Update Item</span>";
  formBtn.classList.replace("btn-dark", "btn-primary");
};

itemList.addEventListener("click", onClickItem);
//#endregion

//#region : remove all items from DOM & localStorage
const clearItems = () => {
  itemList.innerHTML = "";

  localStorage.removeItem("items");

  checkUI();
};

clearBtn.addEventListener("click", clearItems);
//#endregion

//#region : checkUI, show/hidden itemFilter & clearBtn
const checkUI = () => {
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    clearBtn.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearBtn.style.display = "block";
    itemFilter.style.display = "block";
  }
};

checkUI();
//#endregion

//#region : filter items
const filterItems = (e) => {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

itemFilter.addEventListener("input", filterItems);
//#endregion

//#region : get items from localStorage
const getItemsFromLocalStorage = () => {
  let itemsFromLocalStorage;

  if (localStorage.getItem("items") === null) {
    itemsFromLocalStorage = [];
  } else {
    itemsFromLocalStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemsFromLocalStorage;
};
//#endregion

//#region : display items from localStorage on DOM
const displayItems = () => {
  const itemsFromLocalStorage = getItemsFromLocalStorage();

  itemsFromLocalStorage.forEach((item) => addItemToDOM(item));

  checkUI();
};

document.addEventListener("DOMContentLoaded", displayItems);
//#endregion
