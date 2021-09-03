const message = document.getElementById("message");
let msg = "";
const loader = document.getElementById("loader");
const searchResult = document.getElementById("search-result");
const searchButton = document.getElementById("search-btn");
const bookTableBody = document.getElementById("book-table-body");
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
            srlCounter++;
            const trEl = document.createElement("tr");

            // Book title
            if (!book.title) {
                trEl.dataset.title = "empty";
            } else {
                trEl.dataset.title = book.title;
            }

            // Author name
            if (!book.author_name) {
                trEl.dataset.author_name = "empty";
            } else {
                trEl.dataset.author_name = getNames(book.author_name);
            }

            // Publisher
            if (!book.publisher) {
                trEl.dataset.publisher = "empty";
            } else {
                trEl.dataset.publisher = getNames(book.publisher);
            }

            // ISBN
            if (!book.isbn) {
                trEl.dataset.isbn = "empty";
            } else {
                trEl.dataset.isbn = book.isbn[0];
            }

            // Cover photo
            if (!book.cover_i) {
                trEl.dataset.cover_i = "empty";
            } else {
                trEl.dataset.cover_i = book.cover_i;
            }

            // Create row of result table
            const trElHtml =
                `<td>${srlCounter}</td>
            <td>${book.title}</td>
            <td>${book.author_name}</td>
            <td>${book.publisher}</td>
            <td>${book.first_publish_year}</td>`;
            trEl.innerHTML = trElHtml;
            bookTableBody.appendChild(trEl);
        });

        searchResult.style.display = "block";
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
    const searchInput = document.getElementById("search-txt");
    const searchString = searchInput.value;
    if (searchString.trim().length === 0) { // if input is empty string
        searchInput.value = "";
    } else {
        toggleLoader("on");
        bookTableBody.innerHTML = "";
        searchResult.style.display = "none";
        getBooks(searchString);
    }
});

// handle row click
bookTableBody.addEventListener("click", (event) => {
    // Book title
    document.getElementById("book-title").innerText = event.target.parentElement.dataset.title;

    // Author name
    document.getElementById("author").innerText = event.target.parentElement.dataset.author_name;

    // ISBN
    const isbn = event.target.parentElement.dataset.isbn;
    const dispIsbn = document.getElementById("isbn");
    if (isbn === "empty") {
        dispIsbn.innerText = "(ISBN unavailable!)";
    } else {
        dispIsbn.innerText = isbn;
    }

    // Cover photo
    const coverPhotoId = event.target.parentElement.dataset.cover_i;
    if (coverPhotoId === "empty") {
        document.getElementById("alt-title").innerText = event.target.parentElement.dataset.title;
        coverPhoto.style.display = "none";
        altCover.style.display = "block";
    } else {
        coverPhoto.setAttribute("src", `https://covers.openlibrary.org/b/id/${coverPhotoId}-M.jpg`);
        altCover.style.display = "none";
        coverPhoto.style.display = "block";
    }

    // Publisher
    const bookPublisher = event.target.parentElement.dataset.publisher;
    if (bookPublisher === "empty") {
        document.getElementById("publisher").innerText = "(Publisher unavailable!)";
    } else {
        document.getElementById("publisher").innerText = bookPublisher;
    }

    bookCover.style.opacity = "1";
});
