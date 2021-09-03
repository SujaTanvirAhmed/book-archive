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

const getBooks = (searchText) => {
    const bookUrl = `https://openlibrary.org/search.json?q=${searchText}`;
    fetch(bookUrl)
        .then(response => response.json())
        .then(data => handleData(data))
        .catch(err => console.log(err));
};

const handleData = data => {
    // toggleLoader("on"); // loading animation starts
    console.log(data.docs);
    let srlCounter = 0;
    data.docs.forEach(book => {
        srlCounter++;
        const trEl = document.createElement("tr");

        if (!book.title) {
            trEl.dataset.title = "empty";
        } else {
            trEl.dataset.title = book.title;
        }

        if (!book.author_name) {
            trEl.dataset.author_name = "empty";
        } else {
            trEl.dataset.author_name = getNames(book.author_name);
        }

        if (!book.publisher) {
            trEl.dataset.publisher = "empty";
        } else {
            trEl.dataset.publisher = getNames(book.publisher);
        }

        if (!book.isbn) {
            trEl.dataset.isbn = "empty";
        } else {
            trEl.dataset.isbn = book.isbn[0];
        }

        if (!book.cover_i) {
            trEl.dataset.cover_i = "empty";
        } else {
            trEl.dataset.cover_i = book.cover_i;
        }

        const trElHtml =
            `<td>${srlCounter}</td>
            <td>${book.title}</td>
            <td>${book.author_name}</td>
            <td>${book.publisher}</td>
            <td>${book.first_publish_year}</td>`;
        trEl.innerHTML = trElHtml;
        bookTableBody.appendChild(trEl);
    });
    toggleLoader("off");
    searchResult.style.display = "block";
};

// handle search button click
searchButton.addEventListener("click", (event) => {
    event.preventDefault();
    bookTableBody.innerHTML = "";
    searchResult.style.display = "none";
    let msg = "Search failed! Connection error or invalid search-string!!";
    // msg = `Showing ${part} of ${whole} entries`;
    const searchString = document.getElementById("search-txt").value;
    if (searchString.trim().length > 0) { // if input given
        toggleLoader("on");
        getBooks(searchString);
        // toggleLoader("off");
    }
});

// handle row click
bookTableBody.addEventListener("click", (event) => {
    document.getElementById("book-title").innerText = event.target.parentElement.dataset.title;
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

    document.getElementById("publisher").innerText = event.target.parentElement.dataset.publisher;

    bookCover.style.opacity = "1";
});

