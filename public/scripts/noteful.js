/* global $ store api*/
'use strict';

const noteful = (function () {

  function render() {

    const notesList = generateNotesList(store.notes, store.currentNote);
    $('.js-notes-list').html(notesList);

    const editForm = $('.js-note-edit-form');
    editForm.find('.js-note-title-entry').val(store.currentNote.title);
    editForm.find('.js-note-content-entry').val(store.currentNote.content);
  }

  /**
   * GENERATE HTML FUNCTIONS
   */
  function generateNotesList(list, currentNote) {
    const listItems = list.map(item => `
    <li data-id="${item.id}" class="js-note-element ${currentNote.id === item.id ? 'active' : ''}">
      <a href="#" class="name js-note-show-link">${item.title}</a>
      <button class="removeBtn js-note-delete-button">X</button>
    </li>`);
    return listItems.join('');
  }

  /**
   * HELPERS
   */
  function getNoteIdFromElement(item) {
    const id = $(item).closest('.js-note-element').data('id');
    return id;
  }

  /**
   * EVENT LISTENERS AND HANDLERS
   */
  function handleNoteItemClick() {
    $('.js-notes-list').on('click', '.js-note-show-link', event => {
      event.preventDefault();

      const noteId = getNoteIdFromElement(event.currentTarget);

      api.details(noteId)
        .then(response => {
          store.currentNote = response;
          return render();
        });

    });
  }

  function handleNoteStartNewSubmit() {
    $('.js-start-new-note-form').on('submit', event => {
      event.preventDefault();
      store.currentNote = false;
      render();
    });
  }

  function handleNoteSearchSubmit() {
    $('.js-notes-search-form').on('submit', event => {
      event.preventDefault();

      const searchTerm = $('.js-note-search-entry').val();
      store.currentSearchTerm =  searchTerm ? { searchTerm } : {};
      
      api.search(store.currentSearchTerm)
        .then(response => {
          store.notes = response;
          render();
        });
    });
  }

  function handleNoteFormSubmit() {
    $('.js-note-edit-form').on('submit', function (event) {
      event.preventDefault();

      const editForm = $(event.currentTarget);

      const noteObj = {
        id: store.currentNote.id,
        title: editForm.find('.js-note-title-entry').val(),
        content: editForm.find('.js-note-content-entry').val()
      };

      if (store.currentNote.id) {

        // api.update(store.currentNote.id, noteObj, updateResponse => {
        //   store.currentNote = updateResponse;

        //   api.search(store.currentSearchTerm, updateResponse => {
        //     store.notes = updateResponse;
        //     render();
        //   });

        api.update(store.currentNote.id, noteObj)
          .then(updateResponse => {
            store.currentNote = updateResponse;
            return api.search(store.currentSearchTerm);
          })
          .then(updateResponse => {
            store.notes = updateResponse;
            render();
          });
          

      } else {

        // // api.create(noteObj, updateResponse => {
        // //   store.currentNote = updateResponse;

        //   api.search(store.currentSearchTerm, updateResponse => {
        //     store.notes = updateResponse;
        //     render();
        // //   });

        // });

        api.create(noteObj)
          .then(updateResponse => {
            store.currentNote = updateResponse;
            return api.search(store.currentSearchTerm);
          })
          .then(updateResponse => {
            store.notes = updateResponse;
            render();
          });
      }

    });
  }

  function handleNoteDeleteClick() {
    console.log('hello world');
    // this function will be responsible for when users want to delete a shopping list
    $('.js-notes-list').on('click', '.js-note-delete-button', event => {
      console.log('handleNoteDeleteClicked ran');
      // grab current element's location, place into constant
      const noteID = getNoteIdFromElement(event.currentTarget);

      console.log(noteID);

      api.delete(noteID)
        .then(response => {
          store.currentNote = response;
          return api.search(store.currentSearchTerm);
        }).then(response => {
          store.notes = response;
          render();
        });
    });
  }

  function bindEventListeners() {
    handleNoteItemClick();
    handleNoteSearchSubmit();
    handleNoteFormSubmit();
    handleNoteStartNewSubmit();
    handleNoteDeleteClick();
  }

  // This object contains the only exposed methods from this module:
  return {
    render: render,
    bindEventListeners: bindEventListeners,
  };

}());
