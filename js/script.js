const bookCardCont = document.getElementById("book-card-cont");
const message = document.getElementById("message");
let msg = "";
const footer = document.getElementById("footer");
const loader = document.getElementById("loader");
const searchResult = document.getElementById("search-result");
const searchButton = document.getElementById("search-btn");
const coverPhoto = document.getElementById("cover-photo");
const altCover = document.getElementById("alt-cover");
const bookCover = document.getElementById("book-cover");

const toggleLoader = status => {
    if (status === "on") {
        loader.style.display = "block";
    } else if (status === "off") {
        loader.style.display = "none";
    }
};

const toggleNotification = status => {
    if (status === "on") {
        message.style.opacity = "1";
    } else if (status === "off") {
        message.style.opacity = "0";
    }
};

const setNotification = (msg, status) => {
    message.innerText = "==> " + msg;
    if (status === "success") {
        message.style.color = "#333";
    } else if (status === "fail") {
        message.style.color = "red";
    }
};

const getNames = arrNames => {
    let names = "";
    arrNames.forEach(name => {
        names += name + ", ";
    });
    names = names.slice(0, names.length - 2);
    return names;
};

const getCoverPhoto = (coverId) => {
    fetch(`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`)
        .then(response => response)
        .catch(err => console.log(err));
};

const handleError = err => {
    console.log(err);
    msg = "Search failed! Please check net connection!!";
    setNotification(msg, "fail");
    toggleNotification("on");
    toggleLoader("off");
};

const handleData = data => {
    if (data.numFound === 0) {
        // Notification message
        msg = "No books found with this name!";
        setNotification(msg, "fail");
        toggleNotification("on");
    } else if (data.numFound > 0) {
        // Notification message
        msg = `Showing ${data.docs.length} of ${data.numFound} entries!`;
        setNotification(msg, "success");
        toggleNotification("on");

        // Book serial counter
        let srlCounter = 0;

        // Loop through each book
        data.docs.forEach(book => {
            const bookCard = document.createElement("div");

            // Book title
            if (!book.title) {
                bookCard.dataset.title = "empty";
            } else {
                bookCard.dataset.title = book.title;
            }

            // Author name
            if (!book.author_name) {
                bookCard.dataset.author_name = "empty";
            } else {
                bookCard.dataset.author_name = getNames(book.author_name);
            }

            // Publisher
            if (!book.publisher) {
                bookCard.dataset.publisher = "empty";
            } else {
                bookCard.dataset.publisher = getNames(book.publisher);
            }

            // ISBN
            if (!book.isbn) {
                bookCard.dataset.isbn = "empty";
            } else {
                bookCard.dataset.isbn = book.isbn[0];
            }

            // Cover photo
            if (!book.cover_i) {
                bookCard.dataset.cover_i = "empty";
            } else {
                bookCard.dataset.cover_i = book.cover_i;
            }

            // card testing
            bookCard.classList.add("book-card");
            bookCard.innerHTML = `
                <h3>${book.title}</h3>
                <p>Written by: <span>${book.author_name}</span></p>
                <p>Published by: <span>${book.publisher}</span></p>
                <p>First published at: <span>${book.first_publish_year}</span></p>`;
            bookCardCont.appendChild(bookCard);
        });

        searchResult.style.display = "block";
        footer.style.position = "relative";
        footer.style.bottom = "0";
    }

    toggleLoader("off");
};

// data fetcher
const getBooks = (searchText) => {
    const bookUrl = `https://openlibrary.org/search.json?q=${searchText}`;
    fetch(bookUrl)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(err => handleError(err));
};

// handle search button click
searchButton.addEventListener("click", (event) => {
    event.preventDefault(); // prevents default form submission
    toggleNotification("off");
    bookCardCont.innerHTML = "";
    coverPhoto.setAttribute("src", "#");
    footer.style.position = "absolute";

    const searchInput = document.getElementById("search-txt");
    const searchString = searchInput.value;
    if (searchString.trim().length === 0) { // if input is empty string
        searchInput.value = "";
    } else {
        toggleLoader("on");
        searchResult.style.display = "none";
        bookCover.style.opacity = "0";
        getBooks(searchString);
    }
});

// handle card click
bookCardCont.addEventListener("click", event => {
    const clickedItem = event.target;
    let thisCard = undefined;
    if (clickedItem.tagName === "H3" || clickedItem.tagName === "P") {
        thisCard = clickedItem.parentElement;
    } else if (clickedItem.tagName === "SPAN") {
        thisCard = clickedItem.parentElement.parentElement;
    } else if (clickedItem.tagName === "DIV") {
        thisCard = clickedItem;
    }

    // Book title
    document.getElementById("book-title").innerText = thisCard.dataset.title;

    // Author name
    document.getElementById("author").innerText = thisCard.dataset.author_name;

    // ISBN
    const isbn = thisCard.dataset.isbn;
    const dispIsbn = document.getElementById("isbn");
    if (isbn === "empty") {
        dispIsbn.innerText = "(ISBN unavailable!)";
    } else {
        dispIsbn.innerText = isbn;
    }

    // Cover photo
    const coverPhotoId = thisCard.dataset.cover_i;
    if (coverPhotoId === "empty") {
        document.getElementById("alt-title").innerText = thisCard.dataset.title;
        coverPhoto.style.display = "none";
        altCover.style.display = "block";
    } else {
        coverPhoto.setAttribute("src", `https://covers.openlibrary.org/b/id/${coverPhotoId}-M.jpg`);
        altCover.style.display = "none";
        coverPhoto.style.display = "block";
    }

    // Publisher
    const bookPublisher = thisCard.dataset.publisher;
    if (bookPublisher === "empty") {
        document.getElementById("publisher").innerText = "(Publisher unavailable!)";
    } else {
        document.getElementById("publisher").innerText = bookPublisher;
    }
    bookCover.style.opacity = "1";
    console.log(thisCard);
});
