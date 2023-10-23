var addressFormContainer = document.getElementById("addressFormContainer");
var addressForm = document.getElementById("addressForm");

function showAddressForm() {
  document.getElementById("addressFormContainer").style.display = "flex";
  document.getElementById("addressForm").style.display = "block";
}

function closeAddressForm() {
  document.getElementById("addressForm").style.display = "none";
  document.getElementById("addressFormContainer").style.display = "none";
  addressForm.reset();
}
var checkoutButton = document.getElementById("checkoutButton");
checkoutButton.addEventListener("click", function () {
  showAddressForm();
  var result = fetchCart()
  for(i = 0; i < result.products.length; i++){
  if(result.products[i].quantity != quantityInput[i].value){
    fetch("/api/cart/" + localStorage.userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((updatedData) => {
        // Now populate the cart table with the updated data
        populateCartTable(updatedData);
      })
      .catch((error) => console.error("Error:", error));
  }
  }
}
);
document.getElementById("addressForm").addEventListener("submit", function (event) {
  event.preventDefault(); // always prevent the default behavior

  // Get the form values
  var address = document.getElementById("address").value;
  var zipCode = document.getElementById("zipCode").value;
  var city = document.getElementById("city").value;
  var phone = document.getElementById("phone").value;
  var total = document.getElementById("totalPrice").textContent.split("€")[1];
  localStorage.setItem("address", address);
  localStorage.setItem("zipCode", zipCode);
  localStorage.setItem("city", city);
  localStorage.setItem("total", total);
  localStorage.setItem("phone", phone);
  fetch("/api/cart/find/" + localStorage.userId, {
    headers: {
      Authorization: "Bearer " + localStorage.token,
    },
  })
    .then((response) => response.json())
    .then((cartData) => {
      // Extract the productId and quantity fields from each item in the cart
      var products = cartData.products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

      // Create an object with the address information and the products array
      var addressData = {
        userId: localStorage.userId,
        products: products,
        address: {
          address: address,
          zipCode: zipCode,
          city: city,
          phone: phone,
        },
        amount: total,
        status: "pending",
      };
      // Make a POST request to create a new order

      // Clear the form fields
      addressForm.reset();

      // Hide the address form
      addressFormContainer.style.display = "none";
      proceedToCheckout();
    })
    .catch((error) => console.error("Error:", error));
});

async function fetchLastOrderAndAsk(userId) {
 
  try {
    const response = await fetch(`/api/orders/last/` + localStorage.userId, {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const order = await response.json();

    if (order[0] && order[0].address) {
      // The last order[0] exists and has an address, ask the user if they want to fill out the form with it

        // Fill out the form with the address from the last order[0]
        document.getElementById("address").value = order[0].address.address;
        document.getElementById("zipCode").value = order[0].address.zipCode;
        document.getElementById("city").value = order[0].address.city;
        document.getElementById("phone").value = order[0].address.phone;
        // Add other form fields here if needed
      
    }
  } catch (err) {
    console.error("Error fetching last order:", err);
  }
}


//Get cart
function fetchCart() {
  if (!localStorage.userId) {
    goHome();
  } else {
    return fetch("/api/cart/find/" + localStorage.userId, {
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        populateCartTable(data);
        return data; // <-- Return the data for further use
      })
      .catch((error) => {
        console.error("Error:", error);
        goHome();
      });
  }
}

//Give items to table
function populateCartTable(cartData) {
  var table = document.getElementById("cartTable");

  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  for (var i = 0; i < cartData.products.length; i++) {
    var row = table.insertRow(i + 1);
    var imageCell = row.insertCell(0);
    var nameCell = row.insertCell(1);
    var priceCell = row.insertCell(2);
    var quantityCell = row.insertCell(3);
    var actionCell = row.insertCell(4);

    var imageElement = document.createElement("img");
    imageElement.className = "img"
    imageElement.src = cartData.products[i].img;
    // imageElement.style.maxWidth = "100px";
    // imageElement.style.maxHeight = "100px";
    imageCell.appendChild(imageElement);

    nameCell.innerHTML =
      cartData.products[i].title;
    priceCell.innerHTML = "€" + cartData.products[i].price;

    // quantityCell.innerHTML = cartData.products[i].quantity;
    
    var quantityInput = document.createElement("input");
    quantityInput.className = "input";
    quantityInput.type = "number";
    quantityInput.min = "1";
    quantityInput.value = cartData.products[i].quantity;
    // quantityInput.style.width = "60px";
    // quantityInput.style.height = "60px";
    quantityCell.appendChild(quantityInput);


    var removeButton = document.createElement("button");
    removeButton.id = "button";
    removeButton.innerHTML = "❌";
    removeButton.addEventListener(
      "click",
      (function (index) {
        return function () {
          showRemoveModal(index);
        };
      })(i)
    );
    actionCell.appendChild(removeButton);
  }

  calculateTotalPrice(cartData.products);
}

function calculateTotalPrice(products) {
  var totalPrice = 0;

  for (var i = 0; i < products.length; i++) {
    totalPrice += products[i].price * products[i].quantity;
  }

  var formattedTotalPrice = totalPrice.toFixed(2); // Format totalPrice with 2 digits after the decimal point

  var totalPriceElement = document.getElementById("totalPrice");
  totalPriceElement.innerHTML = "Total Price: €" + formattedTotalPrice;
}
//remove an item from cart
async function removeItem(data, index) {
  if (!data || !data.products) {
    console.error("Invalid data provided to removeItem:", data);
    return;
  }

  // Remove the product from the cart data before updating the server
  data.products.splice(index, 1);

  // Now, make a PUT request to update the cart on the server
  fetch("/api/cart/" + localStorage.userId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.token,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((updatedData) => {
      // Now populate the cart table with the updated data
      populateCartTable(updatedData);
    })
    .catch((error) => console.error("Error:", error));
}

async function getCart(userId) {
  try {
    const response = await fetch("/api/cart/find/" + localStorage.userId, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.token,
      },
    });
    const cart = await response.json();
    return cart;
  } catch (err) {
    console.error("Error fetching cart:", err);
  }
}
var currentUrl = window.location.href;
//go to chechout page
async function proceedToCheckout() {
 
  const userId = localStorage.userId; // Retrieve the userId from localStorage or wherever you're storing it
  const cart = await getCart(userId);

  if (cart && cart.products && cart.products.length > 0) {
    // The cart has products in it, proceed to payment
    // ... your code to proceed
    console.log("Proceeding to checkout...");
    location.href = "./checkout.html";
  } else {
    alert("Your cart is empty. Add some items before proceeding!");
    gotoproducts();
  }
}

function gotoproducts() {
  location.href = "./products.html";
}
//go to chechout page
function goHome() {
  console.log("Going back...");
  location.href = "../";
}

var homeButton = document.getElementById("homecartbtn");
homeButton.addEventListener("click", goHome);
var checkoutButton = document.getElementById("checkoutButton");
let currentItemIndexToRemove = null;

function showRemoveModal(index) {
  currentItemIndexToRemove = index;
  document.getElementById("removeItemModal").style.display = "block";
}

function closeRemoveModal() {
  currentItemIndexToRemove = null;
  document.getElementById("removeItemModal").style.display = "none";
}
document
  .getElementById("confirmRemoveButton")
  .addEventListener("click", function () {
    if (currentItemIndexToRemove !== null) {
      fetchCart().then((cartData) => {
        removeItem(cartData, currentItemIndexToRemove);
        closeRemoveModal();
      });
    }
  });

fetchCart();
