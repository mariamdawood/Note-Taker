const fs = require('fs').promises;
const path = require('path');

// 'uuid' for generating unique identifiers.
const { v1: uuidv1 } = require('uuid');

// Define the file path for db.json file.
const dbFilePath = path.join(__dirname, 'db.json');

// Function to asynchronously read data from the file.
const readDataFromFile = async () => {
    try {
        // Reading data from the file and parsing it as JSON.
        const data = await fs.readFile(dbFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// Function to write the data to the file.
const writeDataToFile = async (data) => {
    await fs.writeFile(dbFilePath, JSON.stringify(data), 'utf8');
};

// Store object containing getNotes, addNote and removeNote to interact with the data.
const store = {
    // Get all notes from the file.
    getNotes: async () => {
        try {
            return await readDataFromFile(); // Call the readDataFromFile function to get notes.
        } catch (error) {
            throw error;
        }
    },

    // Add a new note to the file.
    addNote: async (note) => {
        try {
            const notes = await readDataFromFile(); // Call the readDataFromFile function to get existing notes.
            const newNote = { id: uuidv1(), ...note }; // Create a new note with a unique ID using 'uuid'.
            notes.push(newNote); // Add the new note to the existing notes.
            await writeDataToFile(notes); // Call writeDataToFile to save the updated notes to the file.
            return newNote; // Return the newly added note.
        } catch (error) {
            throw error;
        }
    },

    // Remove a note by ID from the file.
    removeNote: async (id) => {
        try {
            const notes = await readDataFromFile();
            const updatedNotes = notes.filter((note) => note.id !== id); // Filter out the note with the specified ID.
            await writeDataToFile(updatedNotes);
            return true; // Indicate successful removal.
        } catch (error) {
            throw error;
        }
    },
};

module.exports = store;


