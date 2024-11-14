
<button class="btn-primary" id="checkout-btn">go to checkout</button>
const mp = new MercadoPago("PUBLIC_KEY", { locale: "es-AR" });
document.getElementById("checkout-btn").addEventListener("click", async () => {
    try {
        const orderData = {
            title: "compra de ecommerce",
            quantity: 1,
            price: total,//el total de la compra, no cada elemento
        };

        const response = await fetch("http://localhost:3000/create_preference", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(orderData),

        });
        const preference = await response.json();
        createCheckoutButton(preference.id);

    } catch (error) {
        alert("error");
    }
});

const createCheckoutButton = (preferenceId) => {
    const brickBuilder = mp.bricks();

    const renderComponent = async () => {
        if (window.checkotButton) window.checkotButton.unmount();

        await brickBuilder.create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId,
            }
        })
    }
renderComponent();
};
