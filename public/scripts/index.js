/* global $ noteful api store */
'use strict';

$(document).ready(function () {
  noteful.bindEventListeners();

  api.search({}, response => {
    store.notes = response;
    noteful.render();
  });

  api.update({}, updateResponse => {
    store.currentNotes = updateResponse;
    noteful.render();
  });
});