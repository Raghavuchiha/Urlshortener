const input = document.getElementById("urlInput");
const button = document.getElementById("shortenBtn");
const result = document.getElementById("result");

button.addEventListener("click", async () => {

    const originalUrl = input.value.trim();

    if (originalUrl === "") {
        alert("Please enter a URL");
        return;
    }

    try {

        const response = await fetch("http://127.0.0.1:8000/shorten", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                original_url: originalUrl
            })

        });

        const data = await response.json();

        result.innerHTML = `
            <p>Short URL:</p>
            <a href="${data.short_url}" target="_blank">
                ${data.short_url}
            </a>
        `;

    } catch (error) {

        console.log(error);

        result.innerHTML = "Something went wrong.";

    }

});