const stripe = Stripe('pk_test_51N5jsFFDocfXvxdpeRKwilSdcl9WU1Y0tu11G6ya1XP9beVdjDvd4cgLPZdvSgfIN8fIC2J9DrIMYlVuYJtHtwP600fYb1HOdH');

const checkOutButton = document.getElementById("btn");

//fix above ^

checkOutButton.addEventListener("click", function () {
    fetch("/api/cart/find/" + localStorage.userId, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.token,
        },
    })
        .then((response) => response.json()) // Add .json() to parse the response as JSON
        .then((data) => {
            console.log('Server response:', data);
            const items = data.products.map((product) => ({
                id: product.productId,
                quantity: product.quantity,
            }));

            console.log(items, "items log");
            const body = JSON.stringify({items: items});
            console.log('Sending to server:', body);

            postItemsOnStripe(items);
        })
        .catch((error) => console.error("Error:", error));
});
function postItemsOnStripe(items) {
    fetch("/create-checkout-session", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({items: items })
    })
        .then((res) => {
            if (res.ok) return res.json();
            return res.json().then((json) => Promise.reject(json));
        })
        .then(({ url }) => {
            window.location = url;
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}
var currentUrl = window.location.href;
function goHome() {
    location.href = "./cart.html";
}