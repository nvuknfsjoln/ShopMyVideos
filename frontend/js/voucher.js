document.getElementById("voucher-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const code = document.getElementById("voucher-code").value;

    try {
        const res = await fetch("/api/shop/redeem", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await res.json();
        if (data.discount) {
            alert(`Voucher accepted! Discount: ${data.discount}%`);
        } else {
            alert("Invalid voucher code");
        }
    } catch (err) {
        console.error("Voucher error:", err);
        alert("Error redeeming voucher");
    }
});
