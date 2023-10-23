function validateEmail(email) {
  var regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}

async function register() {
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  const password2 = document.getElementById("registerPassword2").value;
  if (!validateEmail(email)) {
    showModalF();
  } else if (password != password2) {
    showModalF();
  } else {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Registration successful (status 200)
        closeRegisterForm();
        showModal3();
      } else {
        // Registration failed
        showModalF();
      }
    } catch (error) {
      console.log("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  }
}

async function login() {
  var email = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  // make a request to your backend to login the user
  // ....
  try {
    const response = await fetch("/api/auth/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const result = await response.json();

    // Check if the response object contains the accessToken and email properties
    if (response.ok) {
      closeLoginModal();
      closeModalCart();
      logged = true;
      console.log("Got the token:", result.token);
      localStorage.setItem("token", result.token);
      localStorage.setItem("email", result.email);
      localStorage.setItem("userId", result._id);
    } else {
      console.log("Error: Invalid response format");
    }
  } catch (error) {
    console.log("Error:", error);
  }
}
function loginModal() {
  document.getElementById("loginModal").style.display = "block";
}

function closeLoginModal() {
  document.getElementById("loginModal").style.display = "none";
}
function registerModal() {
  document.getElementById("registerModal").style.display = "block";
}

function closeRegisterForm() {
  document.getElementById("registerModal").style.display = "none";
}

// Function to fetch JSON data from the server and parse it
function fetchProducts() {
  fetch("/api/products/", {
    headers: {
      Authorization: "Bearer " + localStorage.token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Removed the redundant JSON.parse call
      // Call the function to populate the cart table with the parsed data
      populateCartTable(data);
    })
    .catch((error) => console.error("Error:", error));
}

// Rest of your code...

function populateCartTable(data) {
  var table = document.getElementById("productTable");

  // Remove existing rows
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  // Add new rows based on the parsed data
  for (var i = 0; i < data.length; i++) {
    var row = table.insertRow(i + 1);
    var imageCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var priceCell = row.insertCell(2);
    var quantityCell = row.insertCell(3);
    var actionCell = row.insertCell(4);

    var imageElement = document.createElement("img");
    imageElement.src = data[i].img;

    // imageElement.style.maxWidth = "200px";
    // imageElement.style.maxHeight = "200px";
    imageElement.className = "monsterimageproducts";
    imageCell.appendChild(imageElement);

    nameCell.innerHTML = data[i].title;
    priceCell.innerHTML = "€" + data[i].price;

    var quantityInput = document.createElement("input");
    quantityInput.className = "input";
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = "1";
    // quantityInput.style.width = "60px";
    // quantityInput.style.height = "60px";
    quantityCell.appendChild(quantityInput);

    var addButton = document.createElement("button");
    addButton.className = "btn-style";
    addButton.style.backgroundColor = "blue";
    addButton.style.color = "white";

    addButton.id = "btn";
    addButton.innerHTML = "Add to Cart";
    addButton.addEventListener(
      "click",
      (function (product, inputElement) {
        return function () {
          var quantity = parseInt(inputElement.value);
          addItemToCart(product, quantity);
        };
      })(data[i], quantityInput)
    );
    actionCell.appendChild(addButton);
  }
}
var currentUrl = window.location.href;
function myFunction() {
  location.href = "../";
}
function gotocart() {
  if (localStorage.userId) {
    location.href = "./cart.html";
  } else {
    cartModal();
  }
}

// Call the function to fetch JSON data and populate the cart table
fetchProducts();

function addItemToCart(product, quantity) {
  if (localStorage.userId == null) {
    cartModal();
  } else {
    const newItem = {
      img: product.img,
      title: product.title,
      productId: product._id,
      quantity: quantity,
      price: product.price,
    };
    const newItem2 = {
      email: localStorage.email,
      userId: localStorage.userId,
      products: [
        {
          img: product.img,
          title: product.title,
          productId: product._id,
          quantity: quantity,
          price: product.price,
        },
      ],
    };

    const result = fetch("/api/cart/find/" + localStorage.userId, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          // Check if the product with the same title already exists in the cart
          const existingProduct = data.products.find(
            (item) => item.title === newItem.title
          );

          if (existingProduct) {
            // Product already exists, update the quantity
            existingProduct.quantity += newItem.quantity;
          } else {
            // Product doesn't exist, add it to the cart
            data.products.push(newItem);
          }

          // Make a PUT request to update the cart
          fetch("/api/cart/" + localStorage.userId, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.token,
            },
            body: JSON.stringify(data),
          })
            .then((response) => response.json())
            .then((data) => {
              // In your addItemToCart function, replace alert("Item added to cart:", data); with:
              showModal();
            })
            .catch((error) => console.error("Error:", error));
        } else {
          // Cart does not exist, make a POST request to create a new cart
          fetch("/api/cart/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.token,
            },
            body: JSON.stringify(newItem2),
          })
            .then((response) => response.json())
            .then((data) => {
              // In your addItemToCart function, replace alert("Item added to cart:", data); with:
              showModal();
            })
            .catch((error) => console.error("Error:", error));
        }
      })
      .catch((error) => console.error("Error:", error));
  }
}

function showModal() {
  document.getElementById("addItemModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addItemModal").style.display = "none";
}

function showModal3() {
  document.getElementById("addItemModal3").style.display = "block";
}

function closeModal3() {
  document.getElementById("addItemModal3").style.display = "none";
}

function cartModal() {
  document.getElementById("cartModal").style.display = "block";
}

function closeModalCart() {
  document.getElementById("cartModal").style.display = "none";
}

function showModalF() {
  document.getElementById("addItemModalF").style.display = "block";
}

function closeModalF() {
  document.getElementById("addItemModalF").style.display = "none";
}
