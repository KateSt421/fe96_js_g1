//Функция для выплывающей панели поиска
document.addEventListener('DOMContentLoaded', function() {
    const searchToggle = document.getElementById('searchToggle');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('search');
    const clearButton = document.getElementById('clearButton');

    if (searchToggle) {
        searchToggle.addEventListener('click', function(event) {
            if (searchContainer.classList.contains('show')) {
                closeSearch();
            } else {
                searchContainer.classList.add('show');
            }
        });
    

        const closeSearch = () => {
            searchContainer.classList.remove('show');
            searchInput.value = '';
            clearButton.style.display = 'none';
        }

        searchInput.addEventListener('input', function() {
            if (searchInput.value.length > 0) {
                clearButton.style.display = 'inline';
            } else {
                clearButton.style.display = 'none';
            }
        });

    //Функция для появления/удаления крестика в поле поиска
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            clearButton.style.display = 'none';
            searchInput.focus(); 
        });
        
        searchInput.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                closeSearch();
            }
        });
        
    }}
);

//Функция для выплывающего бургер-меню
const burger = document.querySelector("#burger");
const popup = document.getElementById("popup");
const body = document.body;

const menu = document.getElementById("menu").cloneNode(1);

burger.addEventListener("click", burgerHandler);

function burgerHandler(e) {
    e.preventDefault();

    popup.classList.toggle("open");
    burger.classList.toggle("active");
    body.classList.toggle("noscroll");
    renderPopup();
}

function renderPopup() {
popup.appendChild(menu);
}

const links = Array.from(menu.children);

links.forEach((link) => {
    link.addEventListener("click", closeOnClick);
});

function closeOnClick() {
    popup.classList.remove("open");
    burger.classList.remove("active");
    body.classList.remove("noscroll");
}