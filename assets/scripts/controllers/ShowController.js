
(function(TECH) {
  var ShowController,
    _this = this;
  ShowController = (function() {

    ShowController.prototype.$el = null;

    ShowController.prototype.current = null;

    ShowController.prototype.isEdit = false;

    ShowController.prototype.state = false;

    function ShowController() {
      var $el,
        _this = this;
      this.resize = function(event) {
        return ShowController.prototype.resize.apply(_this, arguments);
      };
      this.deleteFaildHandler = function(event) {
        return ShowController.prototype.deleteFaildHandler.apply(_this, arguments);
      };
      this.deletedHandler = function(event) {
        return ShowController.prototype.deletedHandler.apply(_this, arguments);
      };
      this.deleteTweet = function(id) {
        return ShowController.prototype.deleteTweet.apply(_this, arguments);
      };
      this.deleteClickHandler = function(event) {
        return ShowController.prototype.deleteClickHandler.apply(_this, arguments);
      };
      this.editCancelHandler = function(event) {
        return ShowController.prototype.editCancelHandler.apply(_this, arguments);
      };
      this.updateFaildHandler = function(event) {
        return ShowController.prototype.updateFaildHandler.apply(_this, arguments);
      };
      this.updatedHandler = function(event) {
        return ShowController.prototype.updatedHandler.apply(_this, arguments);
      };
      this.editSendHandler = function(event) {
        return ShowController.prototype.editSendHandler.apply(_this, arguments);
      };
      this.editClickHandler = function(event) {
        return ShowController.prototype.editClickHandler.apply(_this, arguments);
      };
      this.closeHandler = function(event) {
        return ShowController.prototype.closeHandler.apply(_this, arguments);
      };
      this._errorHandler = function(error) {
        return ShowController.prototype._errorHandler.apply(_this, arguments);
      };
      this._fetchSuccessHandler = function(data) {
        return ShowController.prototype._fetchSuccessHandler.apply(_this, arguments);
      };
      this.hideAndShow = function(id) {
        return ShowController.prototype.hideAndShow.apply(_this, arguments);
      };
      $el = $('#show');
      if (!$el || $el.length < 1) {
        $('#container').append($('<div id="show" />'));
        $el = $('#show');
      }
      this.$el = $el;
      this.$el.addClass('detail');
      this.resize();
      this.$el.on('click', '.delete', this.deleteClickHandler);
      this.$el.on('click', '.edit', this.editClickHandler);
      $(window).on('resize', this.resize);
    }

    ShowController.prototype.show = function(id) {
      var model, url;
      this.$el.animate({
        left: this.pos + 80
      });
      url = '/' + id;
      this.state = true;
      model = TweetModel.get(id);
      if (model) {
        return this._fetchSuccessHandler(model);
      }
    };

    ShowController.prototype.hide = function() {
      var _this = this;
      this.$el.animate({
        left: this.pos - 205
      }, function() {
        _this.$el.empty();
        return _this.state = false;
      });
    };

    ShowController.prototype.hideAndShow = function(id) {
      var _this = this;
      return this.$el.animate({
        left: this.pos - 225
      }, function() {
        _this.$el.empty();
        return _this.show(id);
      });
    };

    ShowController.prototype._fetchSuccessHandler = function(data) {
      this.current = data;
      this.$el.append(new ShowView(data).el);
      return $('.closeShow').on('click', this.closeHandler);
    };

    ShowController.prototype._errorHandler = function(error) {
      return console.log(error);
    };

    ShowController.prototype.closeHandler = function(event) {
      event.preventDefault();
      return TECH.App.change('/');
    };

    ShowController.prototype.editClickHandler = function(event) {
      var $tweet;
      event.preventDefault();
      if (this.isEdit) {
        return false;
      }
      $tweet = this.$el.find('.tweet');
      $tweet.after(new EditView(this.current).el);
      $tweet.hide();
      $('#editView').on('click', '.cancel', this.editCancelHandler);
      return $('#editView').on('click', '.send', this.editSendHandler);
    };

    ShowController.prototype.editSendHandler = function(event) {
      var action, data, form;
      event.preventDefault();
      form = $('#editView');
      data = form.serializeArray();
      action = form.attr('action');
      TweetModel.on(TECH.ModelEvent.UPDATED, this.updatedHandler).on(TECH.IOErrorEvent.IO_ERROR, this.updateFaildHandler);
      return this.current.update(data);
    };

    ShowController.prototype.updatedHandler = function(event) {
      var $listView, $tweet;
      TweetModel.off(TECH.ModelEvent.UPDATED, this.updateHandler);
      $tweet = this.$el.find('.tweet');
      $tweet.empty().append(this.current.text);
      $tweet.show();
      $('#editView').remove();
      $listView = $('#tweetlist' + this.current.id);
      $listView.find('.tweetBody').empty().append(this.current.text);
      return TECH.Alert.dispAlert('更新しました', 'alert-success');
    };

    ShowController.prototype.updateFaildHandler = function(event) {
      return TECH.Alert.dispAlert('失敗しました。', 'alert-error');
    };

    ShowController.prototype.editCancelHandler = function(event) {
      var $tweet;
      $('#editView').remove();
      $tweet = this.$el.find('.tweet');
      return $tweet.show();
    };

    ShowController.prototype.deleteClickHandler = function(event) {
      var id;
      event.preventDefault();
      id = $(event.currentTarget).data('delete');
      return TECH.Alert.dispModalAlert('消してもいいの', this, this.deleteTweet, [id]);
    };

    ShowController.prototype.deleteTweet = function(id) {
      TweetModel.on(TECH.ModelEvent.DELETED, this.deletedHandler).on(TECH.IOErrorEvent.IO_ERROR, this.deleteFaildHandler);
      return this.current.destroy();
    };

    ShowController.prototype.deletedHandler = function(event) {
      var $listView;
      $listView = $('#tweetlist' + event.id);
      $listView.remove();
      this.current = null;
      TECH.App.change('/');
      return TECH.Alert.dispAlert('削除しました', 'alert-success');
    };

    ShowController.prototype.deleteFaildHandler = function(event) {
      return TECH.Alert.dispAlert("失敗しました。", 'alert-error');
    };

    ShowController.prototype.resize = function(event) {
      this.pos = window.innerWidth / 2;
      if (this.state) {
        return this.$el.css({
          left: this.pos + 80
        });
      } else {
        return this.$el.css({
          left: this.pos - 205
        });
      }
    };

    return ShowController;

  })();
  return TECH.ShowController = ShowController;
})(TECH);
