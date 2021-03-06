import Ember from 'ember';

const {Logger} = Ember;

export default Ember.Controller.extend({
  firstList: Ember.A([
    "this", "is", "just", "a", "simple", "list"
  ]),
  secondList: Ember.A([
    'yma o yyyyy', 'what', 'the', 'heck', 'is', 'that', 'asdqwe'
  ]),

  actions: {
    firstListMoved(item, oldIndex, newIndex) {
      Logger.debug('item -> ', item);
      Logger.debug('index: ', oldIndex, ' => ', newIndex);
    },
    moved() {
      Logger.debug('moved !!!');
    }
  }
});
