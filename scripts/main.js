(function () {
  var configFilePath = "./data/config.json";
  loadJSON(configFilePath, function (configString) {
    try {
      var config = JSON.parse(configString);
      var menuItems = [];

      document.onkeydown = checkKey;

      function checkKey(e) {
        e = e || window.event;

        if (e.keyCode == '38') {
          if (!store.state.startGame && !store.state.showGame) {
            store.commit('previousSelection');
          }
        }
        else if (e.keyCode == '40') {
          if (!store.state.startGame && !store.state.showGame) {
            store.commit('nextSelection');
          }
        }
        else if (e.keyCode == '13') {
          if (!store.state.startGame) {
            store.commit('startGame');
          }
        }
        else if (e.keyCode == '27') {
          if (store.state.startGame) {
            store.commit('closeGame');
          }
        }
      }

      for (var i = 0; i < config.games.length; i++) {
        config.games[i].index = i;
        config.games[i].isSelected = function (selectedValue) {
          return this.index == selectedValue;
        }
      }

      var store = new Vuex.Store({
        state: {
          startGame: false,
          showGame: false,
          fade: false,
          selectedMenuIndex: 0,
          gameCount: config.games.length,
          games: config.games,
          timeout: {},
        },
        mutations: {
          nextSelection: function () {
            this.state.selectedMenuIndex = this.state.selectedMenuIndex >= this.state.gameCount - 1 ? 0 : this.state.selectedMenuIndex + 1;
          },
          previousSelection: function () {
            this.state.selectedMenuIndex = this.state.selectedMenuIndex <= 0 ? this.state.gameCount - 1 : this.state.selectedMenuIndex - 1;
          },
          startGame: function () {
            var that = this;
            this.state.showGame = false;
            this.state.startGame = true;

            clearTimeout(that.state.timeout);

            that.state.timeout = setTimeout(function () {
              that.state.showGame = true;

              that.state.timeout = setTimeout(function () {
                that.state.fade = true;

                var iframe = document.querySelector('iframe');
                iframe.contentWindow.document.addEventListener('keydown', checkKey);
                iframe.focus();

              }, 100);
            }, 1000);
          },
          closeGame: function () {
            var that = this;
            that.state.fade = false;

            clearTimeout(that.state.timeout);

            var iframe = document.querySelector('iframe');
            iframe.contentWindow.document.removeEventListener('keydown', checkKey);
            document.body.focus();

            that.state.timeout = setTimeout(function () {
              that.state.startGame = false;
              that.state.timeout = setTimeout(function () {
                that.state.showGame = false;
              }, 1000);
            }, 1000);
          }
        }
      });


      Vue.component('game-menu', {
        template: `
              <ul>
                <li class="game" v-for="game in games">
                  <a href="#" v-bind:class="{ selected: game.index == selectedIndex }"><span v-if="game.index == selectedIndex" class="selected-game-icon"></span>{{ game.title}}</a>
                </li>
              </ul>
        `,
        computed: {
          games() {
            return store.state.games;
          },
          selectedIndex() {
            return store.state.selectedMenuIndex;
          }
        }
      });

      Vue.component('game-screen', {
        template: `
          <section class="game-screen" v-bind:class="{active:startGame, fade:fade}">
            <iframe v-if="showGame" :src="gameUrl"></iframe>
          </section>
        `,
        computed: {
          gameUrl() {
            return store.state.games[store.state.selectedMenuIndex].path;
          },
          startGame() {
            return store.state.startGame;
          },
          showGame() {
            return store.state.showGame;
          },
          fade() {
            return store.state.fade;
          }

        }
      });

      new Vue({
        el: '#app',
        store,
        data: {
          message: 'Hello Vue.js!'
        }
      });

    }
    catch (e) {
      console.log(e.message);
    }
  });
})();

function loadJSON(path, callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open('GET', path, true); // Replace 'my_data' with the path to your file
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}


