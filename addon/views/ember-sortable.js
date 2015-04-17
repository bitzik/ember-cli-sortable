/*global Sortable*/
import Ember from 'ember';

const {computed, EnumerableUtils, Logger, on} = Ember;


export default Ember.CollectionView.extend(Ember.TargetActionSupport, {
  /*
    private property, please don't mess with it...
   */
  rubaxaSortable: null,

  disabled: false,

  tagName: 'ul',

  handle: null,

  //from ivy-sortable
  arrayDidChangeAfterElementInserted: function() {
    Ember.run.scheduleOnce('afterRender', this, this._refreshSortable);
  },

  //from ivy-sortable
  arrayWillChangeAfterElementInserted: function() {
  },

  //from ivy-sortable
  destroySortable: Ember.on('willDestroyElement', function() {
    this._contentWillChangeAfterElementInserted();

    Ember.removeBeforeObserver(this, 'content', this, this._contentWillChangeAfterElementInserted);
    this.removeObserver('content', this, this._contentDidChangeAfterElementInserted);

    this.get('rubaxaSortable').destroy();
  }),


  initRubaXaSortable: on('didInsertElement', function() {
    const element = this.$().get(0);
    const opts = {
      onEnd: (evt) => {
        this._updateContent(evt.oldIndex, evt.newIndex);
      }
    };

    Logger.debug('didInsertElement, element is -> ', element);
    Logger.debug('here the handle is : ', this.get('handle'));

    const sortable = Sortable.create(element, opts);
    this.set('rubaxaSortable', sortable);

    //Ember.EnumerableUtils.forEach(['setData','onStart','onEnd','onAdd','onUpdate','onSort','onRemove', 'onFilter'],
    //  this._bindSortableOption, this);

    //Ember.EnumerableUtils.forEach(['group', 'sort', 'disabled', 'store', 'animation', 'handle', 'filter', 'draggable', 'ghostClass', 'scroll', 'scrollSensitivity', 'scrollSpeed'],
    Ember.EnumerableUtils.forEach(['disabled', 'handle', 'ghostClass'],
      this._bindSortableOption, this);
  }),

  _updateContent(oldIndex, newIndex) {
    const content = this.get('content'),
      item = content.objectAt(oldIndex);
    if (newIndex !== undefined && oldIndex !== undefined) {
      content.removeAt(oldIndex);
      content.insertAt(newIndex, item);
      this.sendAction('moved', content, oldIndex, newIndex);
    //} else {
    //  Logger.info('prevented a undefined drag or drop');
    }
  },


  /**
   * Copied from `Ember.Component`. Read the `sendAction` documentation there
   * for more information.
   *
   * @method sendAction
   */
  sendAction: function(action) {
    var actionName;
    var contexts = Array.prototype.slice.call(arguments, 1);

    if (action === undefined) {
      actionName = this.get('action');
      Ember.assert('The default action was triggered on the component ' + this.toString() +
        ', but the action name (' + actionName + ') was not a string.',
        Ember.isNone(actionName) || typeof actionName === 'string');
    } else {
      actionName = this.get(action);
      Ember.assert('The ' + action + ' action was triggered on the component ' +
        this.toString() + ', but the action name (' + actionName +
        ') was not a string.',
        Ember.isNone(actionName) || typeof actionName === 'string');
    }

    // If no action name for that action could be found, just abort.
    if (actionName === undefined) { return; }

    this.triggerAction({
      action: actionName,
      actionContext: contexts
    });
  },

  /**
   * this is required to trigger Actions!
   */
  targetObject: computed('_parentView',function() {
    var parentView = this.get('_parentView');
    return parentView ? parentView.get('controller') : null;
  }),


  /**
   * copied from ivy-sortable
   * https://github.com/IvyApp/ivy-sortable/blob/master/addon/views/ivy-sortable.js
   */
  _bindSortableOption: function(key) {
    this.addObserver(key, this, this._optionDidChange);

    if (key in this) {
      this._optionDidChange(this, key);
    }

    this.on('willDestroyElement', this, function() {
      this.removeObserver(key, this, this._optionDidChange);
    });
  },


  _contentDidChangeAfterElementInserted: function() {
    var content = this.get('content');

    if (content) {
      content.addArrayObserver(this, {
        didChange: 'arrayDidChangeAfterElementInserted',
        willChange: 'arrayWillChangeAfterElementInserted'
      });
    }

    var len = content ? Ember.get(content, 'length') : 0;
    this.arrayDidChangeAfterElementInserted(content, 0, null, len);
  },

  _contentWillChangeAfterElementInserted: function() {
    var content = this.get('content');

    if (content) {
      content.removeArrayObserver(this, {
        didChange: 'arrayDidChangeAfterElementInserted',
        willChange: 'arrayWillChangeAfterElementInserted'
      });
    }

    var len = content ? Ember.get(content, 'length') : 0;
    this.arrayWillChangeAfterElementInserted(content, 0, len);
  },

  _optionDidChange: function(sender, key) {
    this.get('rubaxaSortable').option(key, this.get(key));
    Logger.debug('changedOption ', key, ' for ', this.get(key));
  }

});
