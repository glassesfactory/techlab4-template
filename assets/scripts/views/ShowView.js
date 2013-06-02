var ShowView;

ShowView = (function() {

  ShowView.prototype.el = null;

  ShowView.prototype._template = '<header><section class="icon"><a href="#" class="close closeShow" data-dismiss="alert">&times;</a><img src="/assets/images/icon.jpg" width="50"></section><section class="name">username</section></header><section class="tweet"><%= text %></section><footer><span class="ed"><a href="#" class="edit">[edit]</a></span><span class="del"><a href="/<%= id %>" data-delete="<%= id %>" class="delete">[del]</a></span><%= created_at %></footer>';

  function ShowView(data) {
    this.el = _.template(this._template, {
      'id': data.sid,
      'text': data.text,
      'created_at': data.created_at
    });
  }

  return ShowView;

})();
