//Storage control
const StorageCtrl = (function(){
    //public methods
    return {
        storeNote: function(note){
            let notes;
            //check if any item in ls
            if(localStorage.getItem('notes') === null){
                notes = [];
                //push new item
                notes.push(note);
                //set ls
                localStorage.setItem('notes', JSON.stringify(notes));
            } else{
                //get items already in the ls
                notes = JSON.parse(localStorage.getItem('notes'));

                //push new item
                notes.push(note);

                //Re set ls
                localStorage.setItem('notes', JSON.stringify(notes));
            }
        },
        getNotesFromStorage: function(){
            let notes;
            if(localStorage.getItem('notes') === null){
                notes = [];
            }else{
                notes = JSON.parse(localStorage.getItem('notes'));
            }
            return notes;
        },
        updateNoteStorage: function(updatedItem){
            let notes = JSON.parse(localStorage.getItem('notes'));

            notes.forEach(function(note, index){
                if(updatedItem.id === note.id){
                    notes.splice(index, 1, updatedItem);
                }
            });
            localStorage.setItem('notes', JSON.stringify(notes));
        },
        deleteNoteFromStorage: function(id){
            let notes = JSON.parse(localStorage.getItem('notes'));

            notes.forEach(function(note,index){
                if(id === note.id){
                    notes.splice(index, 1);
                }
            });
            localStorage.setItem('notes', JSON.stringify(notes));
        },
        clearNotesFromStorage: function(){
            localStorage.removeItem('notes');
        }
    }
})();

//Item control
const ItemCtrl = (function(){

    //Note Constructor
    const Note = function(id, title, content, color){
        this.id = id;
        this.title = title;
        this.content = content;
        this.color = color;
    }

    //Data Structure
    const data = {
        notes: StorageCtrl.getNotesFromStorage(),
        currentNote: null,
        currentColor: '#a8d5baff'
    }

    //Return
    return {

        //Getting the Notes
        getNotes: function(){
            return data.notes;
        },

        //Adding a new note
        addNote: function(title, content, color){
            let ID;

            if(data.notes.length > 0){
                ID = data.notes[data.notes.length - 1].id + 1;
            } else {
                ID = 0;
            }

            title = title.toUpperCase();
            newNote = new Note(ID, title, content, color);
            data.notes.push(newNote);

            return newNote;
        },

        //Getting a note by it's ID
        getNoteById: function(id){
            let found = null;
            data.notes.forEach(function(note){
                if(note.id == id){
                    found = note;
                }
            });

            return found;
        },

        //Updating a note
        updateNote: function(title, content){
            let found = null;
            data.notes.forEach(function(note){
                if(note.id === data.currentNote.id){
                    note.title = title.toUpperCase();
                    note.content = content;
                    found = note;
                }
            });
            return found;
        },

        //Deleting a note
        deleteNote: function(id){
            const ids = data.notes.map(function(note){
                return note.id;
            });
            const index = ids.indexOf(id);
            data.notes.splice(index, 1);
        },

        //Clear off all the notes
        clearAllNotes: function(){
            data.notes = [];
        },

        //Setting the current note
        setCurrentNote: function(note){
            data.currentNote = note;
        },

        //Getting the current note
        getCurrentNote: function(){
            return data.currentNote;
        },

        //set  note color
        setCurrentColor: function(colorValue){
            switch(colorValue){
                case 0 : 
                data.currentColor = '#a8d5baff';
                break;
                case 1 : 
                data.currentColor = '#d7a9e3ff';
                break;
                case 2 : 
                data.currentColor = '#8bbee8ff';
                break;
                default :
                data.currentColor = '#a8d5baff';
                break;
            }
        },
        getCurrentColor: function(){
            return data.currentColor;
        },

        //Getting the data
        logData: function(){
            return data;
        }
    }

})();

//UI control
const UICtrl = (function(){

    //UI Selectors
    const UISelectors = {
        noteList: '#bottom-body',
        listNotes: '#bottom-body li',
        newBtn: '#new-btn',
        saveBtn: '#save-btn',
        updateBtn: '#update-btn',
        deleteBtn: '#delete-btn',
        backBtn: '#back-btn',
        clearBtn: '#clear-btn',
        noteTitle: '#title',
        noteContent: '#note',
        createdNoteTitle: '.note-title',
        createdNoteContent: '.note-content',
        secondaryEdit: '.secondary-btn',
        greenBtn: '.green-btn',
        pinkBtn: '.pink-btn',
        cyanBtn: '.cyan-btn',
        noteColor: '.color-btn'
    }

    //Return
    return {

        //Populate the notes
        populateNoteList: function(notes){
            document.querySelector(UISelectors.noteList).style.display = 'grid';
            let html = '';
            notes.forEach(function(note){
                html += `
                    <li class="note-item card list-group-item" id="note-${note.id}" style="background-color:${note.color}">
                        <div class="note-title card-header">${note.title}</div>
                        <div class="note-content card-body">${note.content}</div>
                    </li>` ;  
            });
            document.querySelector(UISelectors.noteList).innerHTML = html;
        },

        //Getting the note input
        getNoteInput: function(){
            return {
                title: document.querySelector(UISelectors.noteTitle).value,
                content: document.querySelector(UISelectors.noteContent).value
            }
        },

        //Adding a note into UI
        addNote: function(note){

            document.querySelector(UISelectors.noteList).style.display = 'grid';

            const div = document.createElement('li');
            div.className = 'note-item card list-group-item';
            div.id = `note-${note.id}`;
            div.innerHTML = `
                <div class="note-title card-header">${note.title}</div>
                <div class="note-content card-body">${note.content}</div>`;
            document.querySelector(UISelectors.noteList).insertAdjacentElement('beforeend', div);

            let color = ItemCtrl.getCurrentColor();

            document.querySelector(`#note-${note.id}`).style.backgroundColor = `${color}`;
            ItemCtrl.setCurrentColor(0);
        },

        //Updating a note into UI
        updateNoteList: function(note){
            let listNotes = document.querySelectorAll(UISelectors.listNotes);
            listNotes = Array.from(listNotes);
            listNotes.forEach(function(listNote){
                const noteID = listNote.getAttribute('id');
                if(noteID === `note-${note.id}`){
                    document.querySelector(`#${noteID}`).innerHTML = `
                    <div class="note-title card-header">${note.title}</div>
                    <div class="note-content card-body">${note.content}</div>`;
                }
            });
        },

        //Deleting a note from UI
        deleteNoteList: function(id){
            const noteID = `#note-${id}`;
            const note = document.querySelector(noteID);
            note.remove();
        },

        //Remove all notes from UI
        removeNotes: function(){
            let listNotes = document.querySelectorAll(UISelectors.listNotes);
            listNotes = Array.from(listNotes);
            listNotes.forEach(function(note){
                note.remove();
            });
            this.defaultState();
            this.clearEditState();
        },

        //Initial state of the UI
        defaultState: function(){
            document.querySelector(UISelectors.newBtn).style.display = 'block';
            document.querySelector(UISelectors.saveBtn).style.display = 'none';
            document.querySelector(UISelectors.noteTitle).style.display = 'none';
            document.querySelector(UISelectors.noteContent).style.display = 'none';
            document.querySelector(UISelectors.noteColor).style.display = 'none';
        },

        //Note creating state in UI
        onCreateNew: function(){
            document.querySelector(UISelectors.newBtn).style.display = 'none';
            document.querySelector(UISelectors.saveBtn).style.display = 'block';
            document.querySelector(UISelectors.noteTitle).style.display = 'block';
            document.querySelector(UISelectors.noteContent).style.display = 'block';
            document.querySelector(UISelectors.noteColor).style.display = 'block';
        },

        //Display the inputs of Selected note in UI
        addNoteToForm: function(){
            document.querySelector(UISelectors.noteTitle).value = ItemCtrl.getCurrentNote().title;
            document.querySelector(UISelectors.noteContent).value = ItemCtrl.getCurrentNote().content;
            UICtrl.showEditState();
        },

        //Hide the Notes container from UI
        hideNotes: function(){
            document.querySelector(UISelectors.noteList).style.display = 'none';
        },

        //Clear off the Edit state in UI
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.secondaryEdit).style.display = 'none';
        },

        //Activate the Edit State in UI
        showEditState: function(){
            document.querySelector(UISelectors.newBtn).style.display = 'none';
            document.querySelector(UISelectors.noteTitle).style.display = 'block';
            document.querySelector(UISelectors.noteContent).style.display = 'block';
            document.querySelector(UISelectors.secondaryEdit).style.display = 'inline';
        },

        //Clear the input in UI
        clearInput: function(){
            document.querySelector(UISelectors.noteTitle).value = '';
            document.querySelector(UISelectors.noteContent).value = '';
        },

        //Getting UISelectors for access
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

//App control
const AppCtrl = (function(ItemCtrl, StorageCtrl, UICtrl){

    //Loading the Event Listeners
    const loadEventListeners = function(){
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.newBtn).addEventListener('click', newNoteCreate);
        document.querySelector(UISelectors.saveBtn).addEventListener('click', newNoteSave);
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        });
        document.querySelector(UISelectors.noteList).addEventListener('click', noteEditClick);
        document.querySelector(UISelectors.updateBtn).addEventListener('click', noteUpdateSubmit);
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', noteDeleteSubmit);
        document.querySelector(UISelectors.backBtn).addEventListener('click', noteBackSubmit);
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllNotes);
        document.querySelector(UISelectors.greenBtn).addEventListener('click', greenBtnSelect);
        document.querySelector(UISelectors.pinkBtn).addEventListener('click', pinkBtnSelect);
        document.querySelector(UISelectors.cyanBtn).addEventListener('click', cyanBtnSelect);
    }

    //Creating a new note
    const newNoteCreate = function(e){
        UICtrl.onCreateNew();
    }

    //Saving a new note
    const newNoteSave = function(e){
        const input = UICtrl.getNoteInput();
        const color = ItemCtrl.getCurrentColor();
        if(input.title !== '' && input.content !== ''){
            const newNote = ItemCtrl.addNote(input.title, input.content, color);
            UICtrl.addNote(newNote);
            StorageCtrl.storeNote(newNote);
            UICtrl.defaultState();

            UICtrl.clearInput();
        }
    }

    //Click the note to Edit
    const noteEditClick = function(e){
        if(e.target.classList.contains('note-title') || e.target.classList.contains('note-content')){
            const noteId = e.target.parentNode.id;
            const noteIdArr = noteId.split('-');
            const id = parseInt(noteIdArr[1]);
            const noteToEdit = ItemCtrl.getNoteById(id);
            ItemCtrl.setCurrentNote(noteToEdit);
            UICtrl.addNoteToForm();
        }
        e.preventDefault();
    }

    //Updating the selected note
    const noteUpdateSubmit = function(e){
        const input = UICtrl.getNoteInput();
        const updatedItem = ItemCtrl.updateNote(input.title, input.content);
        UICtrl.updateNoteList(updatedItem);
        StorageCtrl.updateNoteStorage(updatedItem);
        UICtrl.clearEditState();
        UICtrl.defaultState();
        e.preventDefault();
    }

    //Deleting the selected note
    const noteDeleteSubmit = function(e){
        const currentNote = ItemCtrl.getCurrentNote();
        ItemCtrl.deleteNote(currentNote.id);
        UICtrl.deleteNoteList(currentNote.id);
        StorageCtrl.deleteNoteFromStorage(currentNote.id);
        UICtrl.clearEditState();
        UICtrl.defaultState();
        e.preventDefault();
    }

    //Back to normal
    const noteBackSubmit = function(){
        UICtrl.clearEditState();
        UICtrl.defaultState();
    }

    //Clear off all the notes
    const clearAllNotes = function(){
        ItemCtrl.clearAllNotes();
        UICtrl.removeNotes();
        StorageCtrl.clearNotesFromStorage();
        UICtrl.hideNotes();
    }

    //green color
    const greenBtnSelect = function(){
        ItemCtrl.setCurrentColor(0);
    }

    //Pink color
    const pinkBtnSelect = function(){
        ItemCtrl.setCurrentColor(1);
    }

    //Cyan color
    const cyanBtnSelect = function(){
        ItemCtrl.setCurrentColor(2);
    }

    //Return
    return {
        init: function(){

            UICtrl.defaultState();
            UICtrl.clearInput();
            UICtrl.clearEditState();

            const notes = ItemCtrl.getNotes();

            if(notes.length === 0){
                UICtrl.hideNotes();
            } else{
                UICtrl.populateNoteList(notes);
            }
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl, UICtrl);

//App initialization
AppCtrl.init();