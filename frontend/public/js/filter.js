document.getElementById("filter-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const search = document.getElementById("search").value.toLowerCase();
    const cards = document.querySelectorAll(".video-card");

    cards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = title.includes(search) ? "block" : "none";
    });
});
