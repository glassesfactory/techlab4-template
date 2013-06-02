
(function(TECH) {
  var NewController,
    _this = this;
  NewController = (function() {

    NewController.prototype.$el = null;

    NewController.prototype.$screen = null;

    function NewController() {
      var _this = this;
      this._removeContainer = function() {
        return NewController.prototype._removeContainer.apply(_this, arguments);
      };
      this._screenClickHandler = function(event) {
        return NewController.prototype._screenClickHandler.apply(_this, arguments);
      };
      this.closeHandler = function(event) {
        return NewController.prototype.closeHandler.apply(_this, arguments);
      };
      this.tweetErrorHandler = function(event) {
        return NewController.prototype.tweetErrorHandler.apply(_this, arguments);
      };
      this.tweetSuccessHandler = function(event) {
        return NewController.prototype.tweetSuccessHandler.apply(_this, arguments);
      };
      this._sendTweetHandler = function(event) {
        return NewController.prototype._sendTweetHandler.apply(_this, arguments);
      };
      this.toggleClickHandler = function(event) {
        return NewController.prototype.toggleClickHandler.apply(_this, arguments);
      };
      $('.new').on('click', this.toggleClickHandler);
    }

    NewController.prototype.toggleClickHandler = function(event) {
      var $body;
      event.preventDefault();
      if (this.$container) {
        return this._removeContainer();
      } else {
        $body = $('body');
        $body.append('<div id="screen" />');
        $body.append('<div id="newContainer" />');
        if (!this.$el) {
          this.$el = new TECH.NewView().el;
        }
        this.$container = $('#newContainer');
        this.$container.append(this.$el);
        this.$container.css({
          left: TECH.win.innerWidth / 2 - 215
        });
        $('form').on('submit', this._sendTweetHandler);
        $('textarea[name=text]').focus();
        $('.close').on('click', this.closeHandler);
        this.$screen = $('#screen');
        return this.$screen.on('click', this._screenClickHandler);
      }
    };

    NewController.prototype._sendTweetHandler = function(event) {
      var data, model;
      event.preventDefault();
      data = $('#newForm').serializeArray();
      model = new TweetModel();
      TweetModel.on(TECH.ModelEvent.ADDED, this.tweetSuccessHandler).on(TECH.IOErrorEvent.IO_ERROR, this.tweetErrorHandler);
      model.save(data);
      return this._removeContainer();
    };

    NewController.prototype.tweetSuccessHandler = function(event) {
      TweetModel.off(TECH.ModelEvent.ADDED, this.tweetSuccessHandler).off(TECH.IOErrorEvent.IO_ERROR, this.tweetErrorHandler);
      return TECH.Alert.dispAlert('作成しました', 'alert-success');
    };

    NewController.prototype.tweetErrorHandler = function(event) {
      console.error("失敗しました。");
      return TECH.Alert.dispAlert('失敗しました。', 'alert-error');
    };

    NewController.prototype.closeHandler = function(event) {
      event.preventDefault();
      return this._removeContainer();
    };

    NewController.prototype._screenClickHandler = function(event) {
      event.preventDefault();
      return this._removeContainer();
    };

    NewController.prototype._removeContainer = function() {
      this.$container.remove();
      this.$screen.remove();
      this.$container = null;
      return this.$screen = null;
    };

    return NewController;

  })();
  return TECH.NewController = NewController;
})(TECH);
