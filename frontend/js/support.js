document.getElementById("support-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("support-name").value;
    const email = document.getElementById("support-email").value;
    const message = document.getElementById("support-message").value;

    try {
        const res = await fetch("/api/support", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        });

        if (res.ok) {
            alert("Support message sent successfully");
            e.target.reset();
        } else {
            alert("Failed to send message");
        }
    } catch (err) {
        console.error("Support error:", err);
    }
});
