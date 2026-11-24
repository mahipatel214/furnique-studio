const menuButton = document.querySelector(".mobile-menu");
menuButton?.addEventListener("click", () => {
  const nav = document.querySelector(".main-nav");
  const isOpen = nav.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
});
