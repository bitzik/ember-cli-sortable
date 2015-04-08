module.exports = {
  description: 'ember-cli-sortable',

  normalizeEntityName: function() {
    // this prevents an error when the entityName is
    // not specified (since that doesn't actually matter
    // to us
  },

  included: function(app) {
    this._super.included(app);

    app.import({
      development: 'bower_components/Sortable/Sortable.js',
      prod: 'bower_components/Sortable/Sortable.min.js',
    });

  },

  afterInstall: function() {
    return this.addBowerPackageToProject('Sortable', '1.1.1');
  }
};
