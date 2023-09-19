// import variables
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// variables object literal
const props = {
    search: {
        dataHeaderSearch: document.querySelector('[data-header-search]'),
        searchCancelButton: document.querySelector('[data-search-cancel]'),
        dataSearchGenres: document.querySelector('[data-search-genres]'),
        dataSearchAuthors: document.querySelector('[data-search-authors]'),
        dataSearchOverlay: document.querySelector('[data-search-overlay]'),
        dataSearchTitle: document.querySelector('[data-search-title]'),
        dataSearchForm: document.querySelector('[data-search-form]'),
        searchButton: document.querySelector('[form="search"]'),
    },

    settings: {
        dataHeaderSettings: document.querySelector('[data-header-settings]'),
        settingsCancelButton: document.querySelector('[data-settings-cancel]'),
        dataSettingsTheme: document.querySelector('[data-settings-theme]'),
        dataSettingsOverlay: document.querySelector('[data-settings-overlay]'),
        settingSaveButton: document.querySelector('[form="settings"]')
    },

    mainListing: {
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
    },

    library: {
        books,
        authors,
        genres,
        BOOKS_PER_PAGE,
    }
}

// global scope variableS
let PAGE = 1;
let REMAINING_BOOKS = props.library.books.length - props.library.BOOKS_PER_PAGE * PAGE;
let BOOK_SLICE_START_INDEX = 0;

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

// functions

/**
 * handler fires when the page is first loaded. It renders the system theme settings
 */
const defaultTheme = () =>{
    const windowSettings = window.matchMedia("(prefers-color-scheme: dark)").matches ? 'night' : 'day';
    props.settings.dataSettingsTheme.value = windowSettings;
    document.documentElement.style.setProperty('--color-light', css[windowSettings].light);
    document.documentElement.style.setProperty('--color-dark', css[windowSettings].dark);
    };

/**
 * Handler displays the books desired as contained in the handler array
 * argument. The handler loops through the argument displaying and assigning
 * applicable properties to each book as passes through it. Handler returns an
 * object that is used for searching purposes.
 * 
 * @param {Array} books 
 * @returns {object} 
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
        props.mainListing.dataListItems.appendChild(pageFregment)
    }
    return props.mainListing.dataListItems;
};

/**
 * The handler calculates and updates the number of hidden books and displays it
 * in the optional 'show more' button each time it is clicked. It takes the
 * event as its argument and returns void.
 * 
 * @param {Event} event
 * @return {void} 
 */
const findRemainingBooks = (event) => {
    const { library: {
        books: { },
        BOOKS_PER_PAGE: { }
    }
    } = props;
    BOOK_SLICE_START_INDEX += BOOKS_PER_PAGE;
    PAGE++;
    bookPreview(books.slice(BOOK_SLICE_START_INDEX, BOOKS_PER_PAGE * PAGE))
    REMAINING_BOOKS = books.length - BOOKS_PER_PAGE * PAGE;
    props.mainListing.dataListButton.innerHTML = REMAINING_BOOKS <= 0 ? `Show more (0)` : `Show more (${REMAINING_BOOKS})`;
    if (REMAINING_BOOKS <= 0) dataListButton.disabled = true;
};

/**
 * Hendler fires when a book is clicked, it pops-up with overlay for a clear and
 * more datailed preview. It take the event as its argument, and uses it to find
 * the id of the specific book clicked for futher processing. Handler returns
 * nothing.
 * 
 * @param {Event} event
 * @returns {void}
 */
const reviewBook = (event) => {
    const { library: {
        authors: { },
        books: { }
    }
    } = props;

    props.mainListing.dataListActive.show();

    const bookId = event.target.closest('.preview').id;
    let activeBook = [];
    for (const aBook of books) {
        if (bookId === aBook.id) {
            activeBook = aBook;
            break
        };
    }
    props.mainListing.dataListImage.src = activeBook.image
    props.mainListing.dataListBlur.src = activeBook.image;
    props.mainListing.dataListTitle.innerHTML = activeBook.title;
    props.mainListing.dataListSubtitle.innerHTML = `${authors[activeBook.author]} (${(activeBook.published).slice(0, 4)})`
    props.mainListing.dataListDescription.innerHTML = activeBook.description;
}


/**
 * Handler fires when the close button of the detailed review pop-up modal is clicked.
 * reponsible for closing the pop-up modal. Takes the default event argument and
 * returns nothing
 *
 * @param {Event} event 
 * @returns {void}
 */

const closeReviewBook = (event) => {
    props.mainListing.dataListActive.close();
}

/** 
 * Handler fires when the header search icon button is clicked to activate the
 * search overlay
 * 
 * @param {Event} event
 * @returns {void}
 */
const showSearchOverlay = (event) => {
    props.search.dataSearchOverlay.show();
};


/**
 * anonimous function used to populate the genre field
 */
(function () {
    const { library:
        { genres }
    } = props;
    const genreFregmant = document.createDocumentFragment();
    const genreValuesArray = ['All Genres'].concat(Object.values(genres));

    genreValuesArray.forEach((currentGenreValue) => {
        const selectOption = document.createElement('option');
        selectOption.value = currentGenreValue;
        selectOption.innerText = currentGenreValue;
        genreFregmant.appendChild(selectOption);
    })
    props.search.dataSearchGenres.appendChild(genreFregmant);
})();

/**Much more like the above anonumous function except that this code-block is for authors */
(function () {
    const { library:
        { authors },
    } = props;
    const authorFregment = document.createDocumentFragment();
    const authorValueArray = ['All Authors'].concat(Object.values(authors));
    authorValueArray.forEach((currentAuthorValue) => {
        const authorSelectOption = document.createElement('option');
        authorSelectOption.value = currentAuthorValue;
        authorSelectOption.innerText = currentAuthorValue;
        authorFregment.appendChild(authorSelectOption)
    });
    props.search.dataSearchAuthors.appendChild(authorFregment)
})();

/**
 * Handler fires to deactivate the search overlay
 * @param {} event 
 */
const closeSearchOverlay = (event) => {
    props.search.dataSearchOverlay.close();
};

/**
 * Handler fires when the search submit form button is clicked. The handler uses
 * the filter buitin function to loop through the provided books array. It
 * retrieves the values of the properties being searched for through the data
 * attributes. As it loops through the books in the found in the array, it
 * compares each book with the property values being searched for. Once done, it
 * then returns the books matching the searched property values while hiding the
 * non-matching ones. If there is no match found, the handler displays the
 * relevant message
 * 
 * @param {Event} event
 * @returns {void}
 */
function searchSubmit(event) {
    event.preventDefault();
    const searchTitle = props.search.dataSearchTitle.value.toLowerCase();
    const searchGenre = props.search.dataSearchGenres.value;
    const searchAuthor = props.search.dataSearchAuthors.value;
    const { library:
        { books,
            genres
        }
    } = props;


    const searchedBooks = books.filter((book) => {
        let genreArray = [];
        for (let i = 0; i < book.genres.length; i++) {
            let genreExtract = '';
            for (const genreItem of book.genres) {
                genreExtract = genres[genreItem];
            }
            genreArray.push(genreExtract);
        }

        const matchTitles = book.title.toLowerCase().includes(searchTitle);
        const matchGenre = searchGenre === 'All Genres' || genreArray.includes(searchGenre);
        const matchAuthor = searchAuthor === 'All Authors' || authors[book.author].includes(searchAuthor);

        return matchTitles && matchGenre && matchAuthor;
    })
    
    const allBooks = bookPreview(books);
    const bookButtons = allBooks.querySelectorAll('button');
    
    bookButtons.forEach((currentButton) => {
        currentButton.classList.replace('preview', 'preview_hidden');
    })
    props.mainListing.dataListButton.style.display = 'none';

    if (searchedBooks.length>0) {
        bookPreview(searchedBooks);
        props.mainListing.dataListMessage.style.display = 'none';
    } else {
        props.mainListing.dataListMessage.style.display = 'block';
    }

    props.search.dataSearchOverlay.close();
    props.search.dataSearchForm.reset();
};

/**
 * Handler fires each time the settings button icon is clicked to activate the
 * settings overlay
 * 
 * @param {void}
 * @returns {void}
*/
const showSettingsOverlay = (event) => {
    props.settings.dataSettingsOverlay.show();
}

/**
 * Handler fires when the theme settings option is selected. It changes or
 * maintaines the theme settings
 * 
 * @param {*} event 
*/
const saveSettings = (event) => {
    event.preventDefault();
    const themeVariable = props.settings.dataSettingsTheme.value;

    if (themeVariable === 'day') {
        document.documentElement.style.setProperty('--color-light', css[themeVariable].light);
        document.documentElement.style.setProperty('--color-dark', css[themeVariable].dark);
    }
    if (themeVariable === 'night') {
        document.documentElement.style.setProperty('--color-light', css[themeVariable].light);
        document.documentElement.style.setProperty('--color-dark', css[themeVariable].dark);
    }
    props.settings.dataSettingsOverlay.close();
};

/**
 * Handler fires to deactivate the settings overlay
 * @param {*} event
 * @returns {void}
*/
const closeSettingsOverlay = (event) => {
    props.settings.dataSettingsOverlay.close();
};

// logic

defaultTheme();

bookPreview(props.library.books.slice(BOOK_SLICE_START_INDEX, props.library.BOOKS_PER_PAGE));

props.mainListing.dataListButton.innerHTML = `Show more ${REMAINING_BOOKS}`;

props.mainListing.dataListButton.addEventListener('click', findRemainingBooks);

props.mainListing.dataListItems.addEventListener('click', reviewBook);

props.mainListing.activeCloseOverlay.addEventListener('click', closeReviewBook);

props.search.dataHeaderSearch.addEventListener('click', showSearchOverlay);

props.search.searchCancelButton.addEventListener('click', closeSearchOverlay);

props.search.searchButton.addEventListener('click', searchSubmit);

props.settings.dataHeaderSettings.addEventListener('click', showSettingsOverlay);

props.settings.settingSaveButton.addEventListener('click', saveSettings);

props.settings.settingsCancelButton.addEventListener('click', closeSettingsOverlay);