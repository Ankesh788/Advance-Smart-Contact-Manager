// API Base URL
const API_URL = "http://localhost:5000/api";
let currentToken = localStorage.getItem("token");
let currentUser = JSON.parse(localStorage.getItem("user")) || null;

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  if (currentToken && currentUser) {
    showDashboard();
    loadContacts();
    loadAnalytics();
  } else {
    showAuth();
  }
});

// Switch between login and register tabs
function switchTab(tab) {
  // Remove active class from all tabs
  document.querySelectorAll(".tab-content").forEach((el) => {
    el.classList.remove("active");
  });
  document.querySelectorAll(".tab-btn").forEach((el) => {
    el.classList.remove("active");
  });

  // Add active class to selected tab
  document.getElementById(tab + "Tab").classList.add("active");
  event.target.classList.add("active");

  // Clear error messages
  document.getElementById("loginError").textContent = "";
  document.getElementById("registerError").textContent = "";
}

// Handle Register
async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById("regName").value;
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  const errorDiv = document.getElementById("registerError");

  try {
    errorDiv.textContent = "";
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Save token and user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    currentToken = data.token;
    currentUser = data.user;

    showDashboard();
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add("show");
  }
}

// Handle Login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  const errorDiv = document.getElementById("loginError");

  try {
    errorDiv.textContent = "";
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save token and user
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    currentToken = data.token;
    currentUser = data.user;

    showDashboard();
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add("show");
  }
}

// Handle Logout
function handleLogout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  currentToken = null;
  currentUser = null;
  showAuth();
}

// Show Auth Section
function showAuth() {
  document.getElementById("authSection").style.display = "flex";
  document.getElementById("dashboardSection").style.display = "none";
}

// Show Dashboard
function showDashboard() {
  document.getElementById("authSection").style.display = "none";
  document.getElementById("dashboardSection").style.display = "block";
  document.getElementById("userName").textContent = currentUser.name;
}

// Handle Add Contact
async function handleAddContact(event) {
  event.preventDefault();

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const phone = document.getElementById("contactPhone").value;
  const address = document.getElementById("contactAddress").value;
  const errorDiv = document.getElementById("addContactError");

  try {
    errorDiv.textContent = "";
    const response = await fetch(`${API_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${currentToken}`,
      },
      body: JSON.stringify({ name, email, phone, address }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add contact");
    }

    // Clear form
    event.target.reset();
    loadContacts();
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.add("show");
  }
}

// Load Contacts
async function loadContacts() {
  try {
    const response = await fetch(`${API_URL}/contacts`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    const contacts = await response.json();
    const contactsList = document.getElementById("contactsList");

    if (contacts.length === 0) {
      contactsList.innerHTML = "<p class='loading'>No contacts yet. Add one to get started!</p>";
      return;
    }

    contactsList.innerHTML = contacts
      .map(
        (contact) => `
      <div class="contact-item">
        <div class="contact-info">
          <h3>${contact.name}</h3>
          <p>📧 ${contact.email}</p>
          ${contact.phone ? `<p>📱 ${contact.phone}</p>` : ""}
          ${contact.address ? `<p>📍 ${contact.address}</p>` : ""}
        </div>
        <div class="contact-actions">
          <button class="btn btn-danger" onclick="deleteContact('${contact._id}')">Delete</button>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
}

// Delete Contact
async function deleteContact(contactId) {
  if (!confirm("Are you sure you want to delete this contact?")) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/contacts/${contactId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }

    loadContacts();
  } catch (error) {
    alert(error.message);
  }
}

// Load Analytics
async function loadAnalytics() {
  try {
    const response = await fetch(`${API_URL}/analytics`, {
      headers: { Authorization: `Bearer ${currentToken}` },
    });

    const data = await response.json();
    document.getElementById("totalContacts").textContent = data.totalContacts;
  } catch (error) {
    console.error("Error loading analytics:", error);
  }
}
