/*global Sortable*/
import Ember from 'ember';

const {computed, EnumerableUtils, Logger, on} = Ember;

export default Ember.CollectionView.extend({
  /*
    private property, please don't mess with it...
   */
  rubaxaSortable: null,

  disabled: false,

  tagName: 'ul',

  initRubaXaSortable: on('didInsertElement', function() {
    const element = this.$().get(0);
    Logger.debug('didInsertElement, element is -> ', element);

    EnumerableUtils.forEach(['start', 'stop'], function (callback) {
      Logger.debug('what is that? ', callback);
    }, this);

    const sortable = Sortable.create(element, {
      onEnd: (evt) => {
        this._updateContent(evt.oldIndex, evt.newIndex);
      }
    });
    this.set('rubaxaSortable', sortable);
  }),

  _updateContent(oldIndex, newIndex) {
    const content = this.get('content'),
      item = content.objectAt(oldIndex);

    content.removeAt(oldIndex);
    content.insertAt(newIndex, item);
  }


});
