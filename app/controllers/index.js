import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['game', 'navbar'],

  username: Ember.computed.alias('controllers.navbar.username'),

  Card: Ember.Object.extend({
    name: '',
    url: '',
    atk: Ember.computed('stargazers_count', function(key, val) {
      var count = this.get('stargazers_count') || 1;

      if (count > 1000) {
        return 4;
      }

      if (count > 500) {
        return 3;
      }

      if (count > 100) {
        return 2;
      }

      return 1;
    }),
    def: Ember.computed('forks_count', function(key, val) {
      var count = this.get('forks_count') || 1;

      if (count > 1000) {
        return 4;
      }

      if (count > 500) {
        return 3;
      }

      if (count > 100) {
        return 2;
      }

      return 1;
    }),
    language: Ember.computed(function(key, val) {
      return val || '????';
    }),
  }),

  // All the cards you have available
  library: [],

  // The current card
  current: null,

  actions: {
    showCurrent: function(data) {
      this.set('current', data);
    },

    addToDeck: function(data, maxLength) {
      if (this.get('deck').length >= maxLength) {
        return alert('A deck is 5 cards, please remove one first');
      }

      this.get('deck').pushObject(data);
      this.get('library').removeObject(data);

      var deck = this.get('deck');

      // Save the deck.
      localStorage.deck = JSON.stringify(deck.toArray().map(function(i) {
        return i.id;
      }));
    },

    removeFromDeck: function(data) {
      this.get('deck').removeObject(data);
      this.get('library').pushObject(data);
    }
  },

  // Cards in your deck
  deck: Ember.computed.alias('controllers.game.deck'),

  // If we are waiting for a game
  waitingForGame: false,

  activeGames: 0,

});
