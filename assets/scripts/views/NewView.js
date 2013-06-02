
(function(TECH) {
  var NewView;
  NewView = (function() {
    var _templ;

    NewView.prototype.el = null;

    _templ = '<div><header><h2>New Tweet</h2><a href="#" class="close" data-dismiss="alert">&times;</a></header><form id="newForm" class="form" action="/create" method="POST"><div class="controls"><textarea name="text"></textarea></div><div><button id="sendTweet" type="submit" class="btn btn-primary">送信</button></div></form></div>';

    function NewView() {
      this.el = _templ;
    }

    return NewView;

  })();
  return TECH.NewView = NewView;
})(TECH);
