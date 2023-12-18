// Define variables globally
let noteTitle
let noteText
let noteList
let saveNoteButton
let newNoteButton
let clearFormButton

// Define classes using their file location
if (window.location.pathname === '/notes') {
    noteTitle = document.querySelector('.note-title')
    noteText = document.querySelector('.note-textarea')
    noteList = document.querySelector('.list-group')
    saveNoteButton = document.querySelector('.save-note')
    newNoteButton = document.querySelector('.new-note')
    clearFormButton = document.querySelector('.clear-btn')
}

// Define show
const show = (elem) => {
    elem.style.display = 'inline'
}

// Define hide
const hide = (elem) => {
    elem.style.display = 'none'
}

// Function to hide buttons
const hideButtons = () => {
    hide(saveNoteButton)
    hide(newNoteButton)
    hide(clearFormButton)
}

// Call function in general
hideButtons()

// Add event listener to click on saveNote, newNote, and clearForm buttons and call hideButtons function to hide all buttons
saveNoteButton.addEventListener('click', hideButtons)
newNoteButton.addEventListener('click', hideButtons)
clearFormButton.addEventListener('click', hideButtons)

// Show and hide buttons
const displayButtons = () => {
    const emptyNoteTitle = !noteTitle.value.trim()
    const emptyNoteText = !noteText.value.trim()

    // if noteTitle and noteText are not empty show saveNoteButton else hide
    if (!emptyNoteTitle && !emptyNoteText) {
        show(saveNoteButton)
    } else {
        hide(saveNoteButton)
    }

    // if noteTitle or noteText are not empty show clearFormButton else hide
    if (!emptyNoteTitle || !emptyNoteText) {
        show(clearFormButton)
    } else {
        hide(clearFormButton)
    }
}

// Add an event listner for noteTitle and noteText to listen to displaySaveButton function
if (window.location.pathname === '/notes') {
    noteTitle.addEventListener('keyup', displayButtons)
    noteText.addEventListener('keyup', displayButtons)
}

// Function to make a GET request to fetch notes from the server
const getNotes = () =>
    fetch('/api/notes', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

// Function to make a POST request to save a new note
const saveNote = (note) =>
    fetch('/api/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    })

// Function to make a DELETE request to delete a note
const deleteNote = (id) =>
    fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

// Create HTML Elements to make a note list and append it
const createNoteListItem = (note) => {
    const liEl = document.createElement('li')
    liEl.classList.add('list-group-item')

    const spanEl = document.createElement('span')
    spanEl.classList.add('list-item-title')
    spanEl.innerText = note.title

    // When click on the note display it using noteView function
    liEl.addEventListener('click', () => noteView(note))
    liEl.appendChild(spanEl)

    // Create a delete button
    const deleteButtonEl = document.createElement('i')
    deleteButtonEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
    )

    // When click on the deleteButton to delete note using noteDelete function
    deleteButtonEl.addEventListener('click', () => noteDelete(note.id))
    liEl.appendChild(deleteButtonEl)

    // Return list
    return liEl
}

// Function to update note list
const updateNoteList = () => {
    // Make a GET request to fetch notes from the server
    getNotes()
        // Once the response is received, parse it as JSON
        .then((response) => response.json())
        // After parsing, handle the retrieved notes
        .then((notes) => {
            // Clear the existing content of the noteList element
            noteList.innerHTML = ''
            // Iterate through each note in the received array
            notes.forEach((note) => {
                const listItem = createNoteListItem(note)
                noteList.appendChild(listItem)
            })
        })
        // Handle errors
        .catch((error) => console.error('Error fetching notes:', error))
}

if (window.location.pathname === '/notes') {
    // Add an event listener to save button
    saveNoteButton.addEventListener('click', () => {
        // Create a note object with title and text values
        const note = {
            title: noteTitle.value.trim(),
            text: noteText.value.trim(),
        }
        // Call the saveNote function with the note object
        saveNote(note)
            .then(() => {
                // After saving the note reset input fields
                noteTitle.value = ''
                noteText.value = ''

                updateNoteList()
            })
            .catch((error) => console.error('Error saving note:', error))
    })
    // Call updateNoteList function
    updateNoteList()
}

// Function to view note
const noteView = (note) => {
    hide(clearFormButton)
    show(newNoteButton)

    // Make noteTitle and noteText non editable
    noteTitle.value = note.title
    noteTitle.setAttribute('readonly', true)

    noteText.value = note.text
    noteText.setAttribute('readonly', true)
}

// Function to when click on newNoteButton make input fields editable
const newNote = () => {
    noteTitle.value = ''
    noteText.value = ''

    noteTitle.removeAttribute('readonly')
    noteText.removeAttribute('readonly')

    noteTitle.focus()
}

// Add an event listener to newNoteButton and make it listen to newNote function
newNoteButton.addEventListener('click', newNote)

// Function to delete note using its id
const noteDelete = (noteId) => {
    deleteNote(noteId)
        .then(() => {
            noteTitle.value = ''
            noteText.value = ''

            updateNoteList()
            newNote()

            hide(newNoteButton)
        })
        .catch((error) => console.error('Error deleting note:', error))
}

// Add an event listener to clearFormButton to clear input fields
clearFormButton.addEventListener('click', () => {
    noteTitle.value = ''
    noteText.value = ''
})