document.addEventListener('DOMContentLoaded', () => {
    // --- Get HTML Elements ---
    const createNoteBtn = document.getElementById('create-note-btn');
    const noteEditor = document.getElementById('note-editor');
    const noteInput = document.getElementById('note-input');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const notesContainer = document.getElementById('notes-container');
    const noNotesMessage = document.querySelector('.no-notes-message');

    // --- Local Storage Functions ---
    const getNotes = () => {
        return JSON.parse(localStorage.getItem('permanent_notes') || '[]');
    };

    const saveNotes = (notes) => {
        localStorage.setItem('permanent_notes', JSON.stringify(notes));
    };

    // --- Core Functions ---
    const displayNotes = () => {
        const notes = getNotes();
        notesContainer.innerHTML = ''; // Clear the container

        if (notes.length === 0) {
            noNotesMessage.classList.remove('hidden');
        } else {
            noNotesMessage.classList.add('hidden');
            notes.forEach((note, index) => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note');

                noteElement.innerHTML = `
                    <div class="note-content">
                        <p>${note.content}</p>
                        <div class="timestamp">Saved: ${note.timestamp}</div>
                    </div>
                    <button class="delete-btn" data-index="${index}">✖</button>
                `;
                notesContainer.prepend(noteElement); // Add new notes to the top
            });
        }
    };

    const deleteNote = (indexToDelete) => {
        let notes = getNotes();
        // Remove the note at the specified index
        notes.splice(indexToDelete, 1);
        saveNotes(notes);
        displayNotes();
    };

    // --- Event Listeners ---
    createNoteBtn.addEventListener('click', () => {
        noteEditor.classList.remove('hidden'); // Show the editor
        createNoteBtn.classList.add('hidden'); // Hide the "Create" button
        noteInput.focus();
    });

    cancelBtn.addEventListener('click', () => {
        noteEditor.classList.add('hidden'); // Hide the editor
        createNoteBtn.classList.remove('hidden'); // Show the "Create" button
        noteInput.value = ''; // Clear the textarea
    });

    saveBtn.addEventListener('click', () => {
        const content = noteInput.value.trim();
        if (content) {
            const notes = getNotes();
            const newNote = {
                content: content,
                timestamp: new Date().toLocaleString()
            };
            notes.push(newNote);
            saveNotes(notes);
            
            noteInput.value = ''; // Clear the input
            noteEditor.classList.add('hidden'); // Hide the editor
            createNoteBtn.classList.remove('hidden'); // Show the "Create" button
            displayNotes(); // Refresh the displayed notes
        }
    });

    // Event listener for delete buttons (uses event delegation)
    notesContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('delete-btn')) {
            const noteIndex = event.target.getAttribute('data-index');
            deleteNote(noteIndex);
        }
    });

    // --- Initial Load ---
    displayNotes();
});