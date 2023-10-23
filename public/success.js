async function clearCart(userId) {
    try {
        const response = await fetch(`/api/cart/clear/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Bearer " + localStorage.token, // Note: Fetch the token as you do in other requests
            }
        });
        const data = await response.json();
        console.log('Cart cleared:', data);
        location.href = "../";
    } catch (err) {
        console.error('Error clearing cart:', err);
    }
}

function myFunction() {
    // clear the cart for the user, you will have to fetch the userId and pass it here
   
    startOrder()
    clearCart(localStorage.userId);
    
}


async function startOrder() {
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
                    address: localStorage.address,
                    zipCode: localStorage.zipCode,
                    city: localStorage.city,
                    phone: localStorage.phone,
                },
                amount: localStorage.total,
                status: "pending",
            };
            makeOrder(addressData)
     
           
        })
        .catch((error) => console.error("Error:", error));
}
async function makeOrder(addressData){
    fetch("/api/orders/create/new", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(addressData),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Order created successfully:", data);



        })
        .catch((error) => console.error("Error:", error));
    }