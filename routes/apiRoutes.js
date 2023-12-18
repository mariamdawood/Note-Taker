const router = require('express').Router();
const store = require('../db/store');

// Route to get all notes
router.get('/notes', (req, res) => {
    store
        .getNotes()
        .then((notes) => {
            return res.json(notes);
        })
        .catch((err) => res.status(500).json(err));
});

// Route to add a new note
router.post('/notes', (req, res) => {
    const { title, text } = req.body;

    if (!title || !text) {
        return res.status(400).json({ error: 'Title and text are required fields' });
    }

    const newNote = { title, text };

    store.addNote(newNote)
        .then(() => {
            res.json(newNote);
        })
        .catch((err) => {
            res.status(500).json({ error: 'Failed to add note' });
        });
});

// Route to delete a note by ID
router.delete('/notes/:id', (req, res) => {
    store
        .removeNote(req.params.id)
        .then(() => res.json({ ok: true }))
        .catch((err) => res.status(500).json(err));
});

module.exports = router;

