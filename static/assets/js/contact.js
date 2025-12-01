// contact.js - store contact form submissions locally and show confirmation modal
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const modalOverlay = document.getElementById("modalOverlay");
    const closeModal = document.getElementById("closeModal");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const entry = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value,
            time: new Date().toLocaleString(),
        };

        const messages = JSON.parse(localStorage.getItem("pp_messages") || "[]");
        messages.push(entry);
        localStorage.setItem("pp_messages", JSON.stringify(messages));

        form.reset();
        showModal();
    });

    function showModal() {
        modalOverlay.classList.add("show");
        setTimeout(() => hideModal(), 4500); // auto-close after 4.5s
    }

    function hideModal() {
        modalOverlay.classList.remove("show");
    }

    closeModal.addEventListener("click", hideModal);
    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) hideModal();
    });
});