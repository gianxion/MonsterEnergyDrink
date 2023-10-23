function showModal() {
  document.getElementById("addItemModal").style.display = "block";
}

function closeModal() {
  document.getElementById("addItemModal").style.display = "none";
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
function imgSlider(image, color) {
  document.querySelector(".monster").src = image;
  changeBgColor(color);
}

function changeBgColor(color) {
  document.querySelector(".sec").style.background = color;
}
let logged = false;

function validateEmail(email) {
  var regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
}

// LOGOUT
function logouting() {
  const logout = document.getElementById("form"); // set the new text
  logout.addEventListener("submit", logouts);
  async function logouts(event) {
    event.preventDefault();
  }

  localStorage.clear();
  document.getElementById("password").hidden = false;
  document.getElementById("register").style.display = "inline-block";
  document.getElementById("logout").value = "Login";
  document.getElementById("password").value = "";
  document.getElementById("logout").id = "login";
  logged = false;
}

//LOGIN
const form = document.getElementById("form");
form.addEventListener("submit", login);
async function login(event) {
  event.preventDefault();
  if (document.getElementById("login")) {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

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
        logged = true;

        document.getElementById("password").hidden = true;
        document.getElementById("register").style.display = "none";
        document.getElementById("login").value = "Logout";
        document.getElementById("login").id = "logout";
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
  } else if (document.getElementById("logout")) {
    logouting();
  }
}

if (localStorage.userId != null && localStorage.token != null) {
  logged = true;

  document.getElementById("email").value = localStorage.email;
  document.getElementById("password").hidden = true;
  document.getElementById("register").style.display = "none";
  document.getElementById("login").value = "Logout";
  document.getElementById("login").id = "logout";
  document.getElementById("logout").addEventListener("click", logouting);
}
function openRegisterForm() {
  document.getElementById("registerForm").style.display = "flex";
}

function closeRegisterForm() {
  document.getElementById("registerForm").style.display = "none";
}

async function register() {
  const email = document.getElementById("email2").value;
  const password = document.getElementById("password2").value;
  const password2 = document.getElementById("password3").value;
  if (!validateEmail(email)) {
    showModalF();
  } else if (password != password2 && password != "") {
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
        showModal();
        closeRegisterForm();
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

function replace() {
  const textBox = document.querySelector(".email"); // get the text box element
  const textBox2 = document.querySelector(".password"); // get the text box element
  const newText = document.getElementById("email").value; // set the new text
  textBox.style.opacity = 0; // set the text box to be transparent
  // document.write(textBox.bold()); // set the text box to be transparent
  textBox2.style.opacity = 0; // set the text box to be transparent
  textBox.innerText = newText; // set the new text
  let opacity = 0; // set the initial opacity to 0
  const fadeInInterval = setInterval(function () {
    opacity += 0.05; // increase the opacity by 5%
    textBox.style.opacity = opacity; // set the new opacity
    textBox2.style.opacity = opacity; // set the new opacity
    if (opacity >= 1) {
      // if the opacity is fully opaque
      clearInterval(fadeInInterval); // stop the interval
    }
  }, 50); // run the interval every 50 milliseconds
}

function replaceText() {
  const textBox = document.getElementById("textBox"); // get the text box element
  const emailLink =
    'E-mail: <a href="mailto:junsnew@hotmail.com"> junsnew@hotmail.com</a>';
  const phoneLink = ' Phone: <a href="tel:+306978026232"> +30 6978 026 232</a>';
  const newText = emailLink + "<br>" + phoneLink; // set the new text with links

  textBox.style.fontSize = "x-large";
  textBox.style.opacity = 0; // set the text box to be transparent
  textBox.innerHTML = newText; // set the new text with links

  let opacity = 0; // set the initial opacity to 0
  const fadeInInterval = setInterval(function () {
    textBox.style.paddingTop = "130px";
    opacity += 0.05; // increase the opacity by 5%
    textBox.style.opacity = opacity; // set the new opacity
    if (opacity >= 1) {
      // if the opacity is fully opaque
      clearInterval(fadeInInterval); // stop the interval
    }
  }, 50); // run the interval every 50 milliseconds
}

var currentUrl = window.location.href;

function gotoproducts() {
  location.href = "./products.html";
}

function gotocart() {
  if (logged) {
    location.href = "./cart.html";
  } else {
    cartModal();
  }
}

function refresh() {
  location.reload();
}

function carousel(images, gradients) {
  let currentIndex = 0;

  function changeImage() {
    const image = images[currentIndex];
    const gradient = gradients[currentIndex];
    imgSlider(image, gradient);
    currentIndex = (currentIndex + 1) % images.length;
  }

  setInterval(changeImage, 5000);
  changeImage();
}

const images = [
  "./img/black.png",
  "./img/blue.png",
  "./img/cian.png",
  "./img/orange.png",
  "./img/green.png",
  "./img/orangered.png",
  "./img/pink.png",
  "./img/pinkk.png",
  "./img/purple.png",
  "./img/red.png",
  "./img/white.png",
  "./img/yellow.png",
];
const gradients = [
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(5,5,5,1) 38%, rgba(255,4,0,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(5,5,5,1) 38%, rgba(0,224,255,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(5,5,5,1) 38%, rgba(0,255,222,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(5,5,5,1) 38%, rgba(255,132,0,1) 100%)",
  " linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(5,5,5,1) 38%, rgba(56,255,0,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(5,5,5,1) 38%, rgba(172,0,0,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(5,5,5,1) 38%, rgba(250,88,0,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(15,15,15,1) 38%, rgba(255,81,234,1) 100%)",
  " linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(15,15,15,1) 38%, rgba(222,0,250,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(15,15,15,1) 38%, rgba(193,19,0,1) 100%)",
  " linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(15,15,15,1) 38%, rgba(250,250,250,1) 100%)",
  "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(15,15,15,1) 38%, rgba(250,235,0,1) 100%)",
];

carousel(images, gradients);
