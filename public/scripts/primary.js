const ham = document.querySelector('.ham-container');
const navLinks = document.querySelector('.nav-links');
const container = document.querySelector('.container');

ham.addEventListener('click', () => {
    navLinks.classList.toggle('nav-links-active');
});
