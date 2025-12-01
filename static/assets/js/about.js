// Simple scroll animation for headings
document.addEventListener("scroll", () => {
    const reveals = document.querySelectorAll(".about-text, .mission");
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            el.classList.add("visible");
        }
    });
});