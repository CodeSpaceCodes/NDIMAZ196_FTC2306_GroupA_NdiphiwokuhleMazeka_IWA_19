import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'


const props = {
    // search data-attributes
    dataHeaderSearch: document.querySelector('[data-header-search]'),
    searchCancelButton: document.querySelector('[data-search-cancel]'),
    dataSearchGenres: document.querySelector('[data-search-genres]'),
    dataSearchAuthors: document.querySelector('[data-search-authors]'),
    dataSearchOverlay: document.querySelector('[data-search-overlay]'),
    dataSearchTitle: document.querySelector('[data-search-title]'),
    dataSearchForm: document.querySelector('[data-search-form]'),
    searchButton: document.querySelector('[form="search"]'),

    // settings data-attributes
    dataHeaderSettings: document.querySelector('[data-header-settings]'),
    settingsCancelButton: document.querySelector('[data-settings-cancel]'),
    dataSettingsTheme: document.querySelector('[data-settings-theme]'),
    dataSettingsOverlay: document.querySelector('[data-settings-overlay]'),


    // main list data-attributes
    dataListItems: document.querySelector('[data-list-items]'),
    dataListButton: document.querySelector('[data-list-button]'),
    dataListMessage: document.querySelector('[data-list-message]'),
    dataListActive: document.querySelector('[data-list-active]'),
    dataListBlur: document.querySelector('[data-list-blur]'),
    dataListImage: document.querySelector('[data-list-image]'),
    dataListTitle: document.querySelector('[data-list-title]'),
    dataListSubtitle: document.querySelector('[data-list-subtitle]'),
    dataListDescription: document.querySelector('[data-list-description]'),
    activeCloseOverlay: document.querySelector('[data-list-close]')
}

// search data-attributes
const dataHeaderSearch = document.querySelector('[data-header-search]');
const searchCancelButton = document.querySelector('[data-search-cancel]');
const dataSearchGenres = document.querySelector('[data-search-genres]');
const dataSearchAuthors = document.querySelector('[data-search-authors]');
const dataSearchOverlay = document.querySelector('[data-search-overlay]');
const dataSearchTitle = document.querySelector('[data-search-title]');
const dataSearchForm = document.querySelector('[data-search-form]');
const searchButton = document.querySelector('[form="search"]');

// settings data-attributes
const dataHeaderSettings = document.querySelector('[data-header-settings]');
const settingsCancelButton = document.querySelector('[data-settings-cancel]');
const dataSettingsTheme = document.querySelector('[data-settings-theme]');
const dataSettingsOverlay = document.querySelector('[data-settings-overlay]');
const settingSaveButton = document.querySelector('[form="settings"]');

// main list data-attributes
const dataListItems = document.querySelector('[data-list-items]');
const dataListButton = document.querySelector('[data-list-button]');
const dataListMessage = document.querySelector('[data-list-message]');
const dataListActive = document.querySelector('[data-list-active]');
const dataListBlur = document.querySelector('[data-list-blur]');
const dataListImage = document.querySelector('[data-list-image]');
const dataListTitle = document.querySelector('[data-list-title]');
const dataListSubtitle = document.querySelector('[data-list-subtitle]');
const dataListDescription = document.querySelector('[data-list-description]');
const activeCloseOverlay = document.querySelector('[data-list-close]')


let matches = books;
let page = 1;
let remainingBooks = books.length - BOOKS_PER_PAGE * page;
let BookSliceStarttIndex = 0


/**
 * A function that loops over the books library array together with the authors
 * object. It retrieves the each book, it author, and title for display.
 * 
 * @param {Array} books 
 * @returns {void}
 */
const bookPreview = (takeBook) => {
    const pageFregment = document.createDocumentFragment()
    for (const book of takeBook) {
        const picture = book.image;
        const title = book.title
        const author = authors[book.author]
        const id = book.id

        const bookList = document.createElement('button')
        bookList.classList = 'preview';
        bookList.setAttribute('id', `${id}`);

        bookList.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${picture}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${author}</div>
            </div>`;

        pageFregment.appendChild(bookList);
        dataListItems.appendChild(pageFregment)
    }
    return dataListItems;
}


bookPreview(books.slice(BookSliceStarttIndex, BOOKS_PER_PAGE))  //<--- displays books


dataListButton.innerHTML = `Show more ${remainingBooks}`;
// show next page and the number of the remaining books
/**
 * The show more button event-listener with a handler that takes the event as the argument.
 * The hanlder increments the counter of the being on display hence deducting
 * the books hidden in the library.
 * 
 * @param {Event} event
 * @return {void} 
 */
dataListButton.addEventListener('click', (event) => {
    BookSliceStarttIndex += BOOKS_PER_PAGE;
    page++;
    bookPreview(books.slice(BookSliceStarttIndex, BOOKS_PER_PAGE * page))
    remainingBooks = books.length - BOOKS_PER_PAGE * page;
    console.log(remainingBooks)
    dataListButton.innerHTML = remainingBooks <= 0 ? `Show more (0)` : `Show more (${remainingBooks})`
    if (remainingBooks <= 0) dataListButton.disabled = true;
})


/**
 * Event-listener associated with each book in the library. When the book is
 * clicked, it pops-up with overlay for clear and more datailed preview.
 * 
 * @param {Event} event
 * 
 * @returns {void}
 */
dataListItems.addEventListener('click', function (event) {
    dataListActive.show();

    const bookId = event.target.closest('.preview').id;
    let activeBook = [];
    for (const aBook of books) {
        if (bookId === aBook.id) {
            activeBook = aBook;
            break
        };
    }
    dataListImage.src = activeBook.image
    dataListBlur.src = activeBook.image;
    dataListTitle.innerHTML = activeBook.title;
    dataListSubtitle.innerHTML = `${authors[activeBook.author]} (${(activeBook.published).slice(0, 4)})`
    dataListDescription.innerHTML = activeBook.description;


    /**
     * book pop-up modal close button event-listener with a handler that is
     * reponsible for closing the pop-up modal
     * 
     * @param {Event} event 
     * @returns {void}
     */
    activeCloseOverlay.addEventListener('click', function (event) {
        dataListActive.close();
    })
})




/** This is mainly for the search button
 * Search button event-listener with nested event-listeners. The handler shows
 * the overlay with the content. 
 * 
 * @param {Event} event
 * @returns {void}
 */
dataHeaderSearch.addEventListener('click', function (event) {
    dataSearchOverlay.show()
});

/**
 * genre field event-listener used to show or populate the genre field
 */
(function () {
    const genreFregmant = document.createDocumentFragment()
    //dataSearchOverlay.show();
    const genreValuesArray = ['All Genres'].concat(Object.values(genres));
    // console.log(genreValuesArray);
    genreValuesArray.forEach((currentGenreValue) => {
        const selectOption = document.createElement('option');
        selectOption.value = currentGenreValue;
        selectOption.innerText = currentGenreValue;
        genreFregmant.appendChild(selectOption);
    })
    dataSearchGenres.appendChild(genreFregmant);
})();

/**Much more like the above except that this code-block is for authors */
(function () {
    const authorFregment = document.createDocumentFragment();
    const authorValueArray = ['All Authors'].concat(Object.values(authors));
    authorValueArray.forEach((currentAuthorValue) => {
        const authorSelectOption = document.createElement('option');
        authorSelectOption.value = currentAuthorValue;
        authorSelectOption.innerText = currentAuthorValue;
        authorFregment.appendChild(authorSelectOption)
    });
    dataSearchAuthors.appendChild(authorFregment)
})();
/* This is an event listener for cancelling the search and closing the search pop-up modal*/
searchCancelButton.addEventListener('click', function () {
    dataSearchOverlay.close()
});
/**This is where the search functionality starts taking place, begining with
 * clicking the 'search' button nested in the search overlay. This search button
 * has an event listener. The handler takes the argument as the event.
 * 
 * @param {Event} event
 * 
 * */
function searchSubmit(event) {
    event.preventDefault();     // prevent mistake submission
    const searchTitle = dataSearchTitle.value.toLowerCase();  //value of the tittle searched
    const searchGenre = dataSearchGenres.value; // value of the selected genre
    const searchAuthor = dataSearchAuthors.value;   // value of the selected author
    console.log("Search")


    const searchedBooks = books.filter((book) => {
        let genreArray = [];
        for (let i = 0; i < book.genres.length; i++) {
            let genreItem1 = '';
            for (const genreItem of book.genres) {
                genreItem1 = genres[genreItem];
            }
            genreArray.push(genreItem1);
        }
        //const bookAuthor = authors[book.author];


        const matchTitles = book.title.toLowerCase().includes(searchTitle);
        const matchGenre = searchGenre === 'All Genres' || genreArray.includes(searchGenre);
        const matchAuthor = searchAuthor === 'All Authors' || authors[book.author].includes(searchAuthor);

        return matchTitles && matchGenre && matchAuthor;
    })
    //console.log(searchedBooks);
    const allBooks = bookPreview(books);
    const bookButtons = allBooks.querySelectorAll('button');
    console.log(bookButtons);
    bookButtons.forEach((currentButton) => {
        currentButton.classList.replace('preview', 'preview_hidden');
    })
    dataListButton.style.display = 'none';

    if (searchedBooks) {
        bookPreview(searchedBooks);
        dataListMessage.style.display = 'none';
    }

    dataSearchOverlay.close();
    dataSearchForm.reset();
}
searchButton.addEventListener('click', searchSubmit)

const css = {
    day: {
        dark: '10, 10, 20',
        light: '255, 255, 255',
    },
    night: {
        dark: '255, 255, 255',
        light: '10, 10, 20',
    },
};



/**This is mainly for the settings button. The button has an event-listener with
 * an event as the argument of the handler. The handler begins by showing the
 * search overlay.
 * 
 * @param {void}
 */

const windowSettings = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'night' : 'day';
dataSettingsTheme.value = windowSettings;
document.documentElement.style.setProperty('--color-light', css[windowSettings].light);
document.documentElement.style.setProperty('--color-dark', css[windowSettings].dark);

dataHeaderSettings.addEventListener('click', function (event) {
    dataSettingsOverlay.show();
})
    settingSaveButton.addEventListener('click', (event)=>{
    event.preventDefault();
    const themeVariable = dataSettingsTheme.value;

    if (themeVariable === 'day') {
        document.documentElement.style.setProperty('--color-light', css[themeVariable].light)
        document.documentElement.style.setProperty('--color-dark', css[themeVariable].dark)
    }
    if (themeVariable === 'night') {
        document.documentElement.style.setProperty('--color-light', css[themeVariable].light)
        document.documentElement.style.setProperty('--color-dark', css[themeVariable].dark)

    }
    dataSettingsOverlay.close()
});

settingsCancelButton.addEventListener('click', function () {
    dataSettingsOverlay.close();
});
