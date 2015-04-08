/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-sortable',

  included: function (app) {
    app.import(app.bowerDirectory + '/Sortable/Sortable.js');
  }
};
