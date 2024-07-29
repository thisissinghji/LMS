// Wait for the DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form');
  if (form) {
      form.addEventListener('submit', function(e) {
          e.preventDefault();
          validateForm();
      });
  } else {
      console.error("Form not found in the DOM");
  }
});

// Function to perform a POST request
async function postData(url, data) {
  console.log("Sending POST request to:", url, "with data:", data);
  try {
      const response = await fetch(url, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      console.log("Response data:", responseData);
      return responseData;
  } catch (error) {
      console.error("Error in postData:", error);
      throw error;
  }
}

// Function to perform a GET request with JWT token
async function getData(url, token) {
  try {
      const response = await fetch(url, {
          method: "GET",
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
  } catch (error) {
      console.error("Error in getData:", error);
      throw error;
  }
}

// Signup function
async function signup(email, password) {
  try {
      const signupData = { email, password };
      const data = await postData("/signup", signupData);
      if (data.token) {
          console.log("Signed up successfully. Token:", data.token);
          // Here you can save the token and redirect the user
      } else {
          console.error("Signup failed: No token in response");
          alert("Signup failed. Please try again.");
      }
  } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
  }
}

// Login function
async function login(email, password) {
  try {
      const loginData = { email, password };
      console.log("Attempting login with data:", loginData);
      const data = await postData("/login", loginData);
      if (data.token) {
          console.log("Logged in successfully. Token:", data.token);
          // Here you can save the token and redirect the user
          alert("Logged in successfully!");
      } else {
          console.error("Login failed: No token in response");
          alert("Login failed. Please check your credentials.");
      }
  } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
  }
}

// Borrow book function
async function borrowBook(book, name, email) {
  try {
      const borrowData = { book, name, email };
      const data = await postData("/borrow", borrowData);
      console.log("Borrow response:", data);
      alert("Book borrowed successfully!");
  } catch (error) {
      console.error("Borrow error:", error);
      alert("Failed to borrow book. Please try again.");
  }
}

// Form validation function
function validateForm() {
  const fullName = document.getElementById("full-name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (fullName === "" || email === "" || password === "") {
      alert("Please fill out all fields.");
      return false;
  }

  // You might want to add more validation here (e.g., email format, password strength)

  login(email, password);
}