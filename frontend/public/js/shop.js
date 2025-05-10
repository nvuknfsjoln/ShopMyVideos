document.addEventListener("DOMContentLoaded", async () => {
    const videoList = document.getElementById("video-list");

    try {
        const res = await fetch("/api/shop/videos");
        const videos = await res.json();

        videos.forEach(video => {
            const div = document.createElement("div");
            div.className = "video-card";
            div.innerHTML = `
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <video width="320" controls>
                    <source src="${video.url}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
            videoList.appendChild(div);
        });
    } catch (error) {
        console.error("Error loading videos:", error);
    }
});
