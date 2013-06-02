
(function(TECH) {
  var IndexController,
    _this = this;
  IndexController = (function() {

    IndexController.prototype.$el = null;

    IndexController.prototype.state = true;

    function IndexController() {
      var _this = this;
      this.resize = function() {
        return IndexController.prototype.resize.apply(_this, arguments);
      };
      this.hide = function() {
        return IndexController.prototype.hide.apply(_this, arguments);
      };
      this.slide = function() {
        return IndexController.prototype.slide.apply(_this, arguments);
      };
      this.newTweetAppend = function(event) {
        return IndexController.prototype.newTweetAppend.apply(_this, arguments);
      };
      this.articleSelectedHandler = function(event) {
        return IndexController.prototype.articleSelectedHandler.apply(_this, arguments);
      };
      this.modelLoaded = function(event) {
        return IndexController.prototype.modelLoaded.apply(_this, arguments);
      };
      this.load = function() {
        return IndexController.prototype.load.apply(_this, arguments);
      };
      this.hasModelLoaded = function() {
        return IndexController.prototype.hasModelLoaded.apply(_this, arguments);
      };
      this.$el = $('#main');
      this.$el.on('click', '.article', this.articleSelectedHandler);
      this.resize();
      TweetModel.on(TECH.ModelEvent.ADDED, this.newTweetAppend);
      TECH.$win.on('resize', this.resize);
    }

    IndexController.prototype.hasModelLoaded = function() {
      return TweetModel.isLoaded();
    };

    IndexController.prototype.load = function() {
      return TweetModel.on(TECH.Event.COMPLETE, this.modelLoaded).on(TECH.IOErrorEvent.IO_ERROR, this.loadFaild).load();
    };

    IndexController.prototype.modelLoaded = function(event) {
      TweetModel.off(TECH.Event.COMPLETE, this.modelLoaded).off(TECH.IOErrorEvent.IO_ERROR, this.loadFailed);
      if (TweetModel.isLoaded()) {
        TECH.App.resume();
        return this.render();
      } else {
        console.warn("do retry");
      }
    };

    IndexController.prototype.render = function() {
      var elem, tweet, tweets, _i, _len;
      elem = '';
      if (TweetModel.collection.length < 1) {
        elem += '<article class="article nullpo">ぬるぽ</article>';
      }
      tweets = TweetModel.collection;
      for (_i = 0, _len = tweets.length; _i < _len; _i++) {
        tweet = tweets[_i];
        elem += new TECH.IndexListView(tweet).el;
      }
      this.$el.append(elem);
      return $('#container').css({
        'height': this.$el.height() + 20
      });
    };

    IndexController.prototype.articleSelectedHandler = function(event) {
      var id, tgt;
      event.preventDefault();
      tgt = event.currentTarget;
      id = $(tgt).attr('id').replace('tweetlist', '');
      if (TECH.App.fragment === '/' + id) {
        TECH.App.change('/');
        return;
      } else if (TECH.App.fragment !== '/') {
        this.hide();
      }
      return TECH.App.change('/' + id);
    };

    IndexController.prototype.newTweetAppend = function(event) {
      var model;
      model = TweetModel.get(event.id);
      return this.$el.prepend(new TECH.IndexListView(model).el);
    };

    IndexController.prototype.slide = function() {
      this.$el.animate({
        left: this.pos - 420
      });
      return this.state = false;
    };

    IndexController.prototype.hide = function() {
      this.$el.animate({
        left: this.pos - 250
      });
      return this.state = true;
    };

    IndexController.prototype.resize = function() {
      var container;
      container = $('#container');
      this.pos = container.offset().left + container.width() / 2;
      if (this.state) {
        return this.$el.css({
          left: this.pos - 250
        });
      } else {
        return this.$el.css({
          left: this.pos - 420
        });
      }
    };

    return IndexController;

  })();
  return TECH.IndexController = IndexController;
})(TECH);
