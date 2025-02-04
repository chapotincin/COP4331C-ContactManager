// ----------------------
// code.js
// ----------------------
const urlBase = 'http://thecontactcircuit.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// ======================
// REGISTER
// ======================
function doRegister() {
  let fname = document.getElementById("firstName").value;
  let lname = document.getElementById("lastName").value;
  let username = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  document.getElementById("registerResult").innerHTML = "";

  let tmp = {
    fname: fname,
    lname: lname,
    username: username,
    password: pass
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/Register.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true); 
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        if (jsonObject.error && jsonObject.error.length > 0) {
          document.getElementById("registerResult").innerHTML = jsonObject.error;
          return;
        }
        userId     = jsonObject.id;
        firstName  = jsonObject.fname;
        lastName   = jsonObject.lname;
        saveCookie();
        window.location.href = "../index.html";
      }
    };
    xhr.send(jsonPayload);
  } catch(err) {
    document.getElementById("registerResult").innerHTML = err.message;
  }
}

// ======================
// LOGIN
// ======================
function doLogin() {
  userId = 0;
  firstName = "";
  lastName = "";
  
  let login = document.getElementById("loginName").value;
  let password = document.getElementById("loginPassword").value;
  document.getElementById("loginResult").innerHTML = "";

  let tmp = { login: login, password: password };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/Login.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;
        if (userId < 1) {		
          document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
          return;
        }
        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;
        saveCookie();
        window.location.href = "search/index.html";
      }
    };
    xhr.send(jsonPayload);
  } catch(err) {
    document.getElementById("loginResult").innerHTML = err.message;
  }
}

// ======================
// ADD CONTACT
// ======================
function doAdd() {
  let firstNameField = document.getElementById("firstName").value;
  let lastNameField = document.getElementById("lastName").value;
  let phone = document.getElementById("phone").value;
  let email = document.getElementById("email").value;
  
  let tmp = {
    FirstName: firstNameField,
    LastName: lastNameField,
    Phone: phone,
    Email: email,
    UserID: userId
  };
  
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/Add.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        window.location.href = "index.html";
      }
    };
    xhr.send(jsonPayload);
  } catch(err) {
    // Optionally display error message.
  }
}

// ======================
// DELETE CONTACT
// ======================
function doDelete(button) {
  let deletingID = button.getAttribute('contactID');
  let tmp = { ID: deletingID };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/Delete.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  try {
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let row = button.closest('tr');
        row.remove();
      } else if (this.readyState == 4) {
        alert('Error deleting contact');
      }
    };
    xhr.send(jsonPayload);
  } catch(err) {
    document.getElementById("deleteContactResult").innerHTML = err.message;
  }
}

// ======================
// SEARCH CONTACTS
// ======================
function doSearch() {
  let srch = document.getElementById("searchBar").value;
  document.getElementById("searchButton").innerHTML = "";
  let tmp = { search: srch };
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/Search.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("searchButton").innerHTML = "Search"; 
        let jsonObject = JSON.parse(xhr.responseText);
        let table = document.getElementById("SearchResult");
        table.innerHTML = '';
        let hasContacts = false;
        for (let i = 0; i < jsonObject.results.length; i++) {
          if (userId == jsonObject.results[i].UserID) {
            hasContacts = true;
            let row = document.createElement('tr');
            let firstNameColumn = document.createElement('td');
            firstNameColumn.textContent = jsonObject.results[i].FirstName;
            row.appendChild(firstNameColumn);
            let lastNameColumn = document.createElement('td');
            lastNameColumn.textContent = jsonObject.results[i].LastName;
            row.appendChild(lastNameColumn);
            let emailColumn = document.createElement('td');
            emailColumn.textContent = jsonObject.results[i].Email;
            row.appendChild(emailColumn);
            let phoneColumn = document.createElement('td');
            phoneColumn.textContent = jsonObject.results[i].Phone;
            row.appendChild(phoneColumn);
            // Create the Actions column.
            let actionsCell = document.createElement('td');
            let editButton = document.createElement('button');
            editButton.classList.add('edit-btn');
            // Set attributes with contact info for modal editing.
            editButton.setAttribute('contactID', jsonObject.results[i].ID);
            editButton.setAttribute('contactFirstName', jsonObject.results[i].FirstName);
            editButton.setAttribute('contactLastName', jsonObject.results[i].LastName);
            editButton.setAttribute('contactEmail', jsonObject.results[i].Email);
            editButton.setAttribute('contactPhone', jsonObject.results[i].Phone);
            // *** NEW: Use modal-based editing ***
            editButton.setAttribute('onclick', 'doModalEdit(this)');
            editButton.innerHTML = '<img src="../images/edit-icon.png" alt="Edit" class="action-icon">';
            actionsCell.appendChild(editButton);
            let deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-btn');
            deleteButton.innerHTML = '<img src="../images/delete-icon.png" alt="Delete" class="action-icon">';
            deleteButton.setAttribute('contactID', jsonObject.results[i].ID);
            deleteButton.setAttribute('onclick', 'doDelete(this)');
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);
            table.appendChild(row);
          }
        }
        if (!hasContacts) {
          table.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#37516A; font-size:18px;">No contacts found</td></tr>';
        }
      }
    };
    xhr.send(jsonPayload);
  } catch(err) {
    document.getElementById("SearchResult").innerHTML = err.message;
  }
}

// ======================
// COOKIE MANAGEMENT
// ======================
function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + (minutes * 60 * 1000));	
  document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(",");
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split("=");
    if (tokens[0] == "firstName") {
      firstName = tokens[1];
    } else if (tokens[0] == "lastName") {
      lastName = tokens[1];
    } else if (tokens[0] == "userId") {
      userId = parseInt(tokens[1].trim());
    }
  }
  if (userId < 0) {
    window.location.href = "index.html";
  } else {
    document.getElementById("welcome-message").innerHTML = "Welcome! Logged in as " + firstName + " " + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = "";
  lastName = "";
  document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "index.html";
}

// ======================
// NEW MODAL-BASED EDITING FUNCTIONS
// ======================

// Global variable to store the ID of the contact being edited.
window.currentEditingContactID = null;

// Launch the modal editor and pre-fill its fields.
function doModalEdit(button) {
  let eID = button.getAttribute('contactID');
  let eFirstName = button.getAttribute('contactFirstName');
  let eLastName = button.getAttribute('contactLastName');
  let eEmail = button.getAttribute('contactEmail');
  let ePhone = button.getAttribute('contactPhone');

  window.currentEditingContactID = eID;
  document.getElementById("editFirstName").value = eFirstName;
  document.getElementById("editLastName").value = eLastName;
  document.getElementById("editEmail").value = eEmail;
  document.getElementById("editPhone").value = ePhone;
  document.getElementById("editModal").style.display = "block";
}

// Called when the modal form is submitted to save changes.
function doSaveModal() {
  let eID = window.currentEditingContactID;
  let newFirstName = document.getElementById("editFirstName").value.trim();
  let newLastName  = document.getElementById("editLastName").value.trim();
  let newEmail     = document.getElementById("editEmail").value.trim();
  let newPhone     = document.getElementById("editPhone").value.trim();

  let tmp = {
    ID: eID,
    FirstName: newFirstName,
    LastName: newLastName,
    Phone: newPhone,
    Email: newEmail
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/Edit.' + extension;
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try {
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        doSearch();  // Refresh the table
        document.getElementById("editModal").style.display = "none";
      }
    };
    xhr.send(jsonPayload);
  } catch(err) {
    console.error("Error saving modal edit:", err.message);
  }
}
