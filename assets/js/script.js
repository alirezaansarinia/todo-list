//#region : variables

const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const inputInvalid = document.querySelector("#input-invalid");
const itemList = document.querySelector("#item-list");
const itemsClearBtn = document.querySelector("#items-clear");
const filterInput = document.querySelector("#filter");
const formBtn = itemForm.querySelector("button");
let isEditModeActive = false;

// console.log(formBtn);

//#endregion

//#region : functions

const checkUI = () => {
  const items = itemList.querySelectorAll("li");

  if (items.length === 0) {
    filterInput.style.display = "none";
    itemsClearBtn.style.display = "none";
  } else {
    filterInput.style.display = "block";
    itemsClearBtn.style.display = "block";
  }
};

const createIcon = (classes) => {
  const icon = document.createElement("i");
  icon.className = classes;

  return icon;
};

const createItem = (classes, item) => {
  const li = document.createElement("li");
  li.className = classes;
  li.textContent = item;

  const icon = createIcon("bi bi-x fs-5 text-danger");

  li.appendChild(icon);

  return li;
};

const addItemToDOM = (item) => {
  const li = createItem("list-item", item);
  itemList.appendChild(li);
};

const getLocalStorageItems = () => {
  let localStorageItems;

  if (localStorage.getItem("items") === null) {
    localStorageItems = [];
  } else {
    localStorageItems = JSON.parse(localStorage.getItem("items"));
  }

  return localStorageItems;
};

const addItemToLocalStorage = (item) => {
  const localStorageItems = getLocalStorageItems();

  localStorageItems.push(item);
  localStorage.setItem("items", JSON.stringify(localStorageItems));
};

const displayItems = () => {
  const localStorageItems = getLocalStorageItems();

  localStorageItems.forEach((item) => {
    addItemToDOM(item);
  });

  checkUI();
};

const checkIfItemExists = (item) => {
  const localStorageItems = getLocalStorageItems();

  return localStorageItems.includes(item);
};

const addItem = (e) => {
  e.preventDefault();

  const newItem = itemInput.value;

  //#region : validation

  if (newItem === "") {
    inputInvalid.innerText = "Fill the input field please!";
    return;
  } else {
    inputInvalid.innerText = "";
  }

  //#endregion

  //#region : edit mode

  if (isEditModeActive) {
    const itemToEdit = itemList.querySelector(".edit-mode");

    removeLocalStorageItem(itemToEdit.textContent);
    itemToEdit.remove();

    formBtn.innerHTML = "<i class='bi bi-plus'></i> Add Item";
    formBtn.classList.replace("btn-primary", "btn-dark");

    isEditModeActive = false;
  }
  //#endregion

  //#region : prevent duplicate value

  if (checkIfItemExists(newItem)) {
    inputInvalid.innerText = "This item is already existed!";
    return;
  } else {
    inputInvalid.innerText = "";
  }

  //#endregion

  addItemToDOM(newItem);

  addItemToLocalStorage(newItem);

  itemInput.value = "";

  checkUI();
};

const removeLocalStorageItem = (item) => {
  let localStorageItems = getLocalStorageItems();

  localStorageItems = localStorageItems.filter((i) => i !== item);

  localStorage.setItem("items", JSON.stringify(localStorageItems));
};

const removeItem = (item) => {
  item.remove();
  removeLocalStorageItem(item.textContent);
  checkUI();
};

const editItem = (item) => {
  isEditModeActive = true;

  itemInput.value = item.textContent;

  itemList
    .querySelectorAll("li")
    .forEach((item) => item.classList.remove("edit-mode"));

  item.classList.add("edit-mode");

  formBtn.innerHTML = '<i class="bi bi-pencil-fill"></i> Update Item';

  formBtn.classList.replace("btn-dark", "btn-primary");
};

const onClickItem = (e) => {
  if (e.target.classList.contains("bi-x")) {
    removeItem(e.target.parentElement);
  } else {
    editItem(e.target);
  }
};

const clearAllItems = () => {
  itemList.innerHTML = "";
  localStorage.removeItem("items");
  checkUI();
};

const filterItems = (e) => {
  const filterText = e.target.value.toLowerCase();
  const items = itemList.querySelectorAll("li");

  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.indexOf(filterText) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
};

//#endregion

//#region : events

itemForm.addEventListener("submit", addItem);

itemList.addEventListener("click", onClickItem);

itemsClearBtn.addEventListener("click", clearAllItems);

filterInput.addEventListener("input", filterItems);

document.addEventListener("DOMContentLoaded", displayItems);

//#endregion

//#region : global callings

checkUI();

//#endregion
