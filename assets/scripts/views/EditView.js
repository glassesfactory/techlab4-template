var EditView;

EditView = (function() {

  EditView.prototype.el = null;

  EditView.prototype._template = '<form id="editView" action="/<%= id %>" method="PUT"><input type="text" name="text" value="<%= text %>"><button type="button" class="send btn btn-primary btn-mini">OK</button><button type="button" class="cancel btn btn-mini">&times;</button></form>';

  function EditView(data) {
    this.el = _.template(this._template, {
      'id': data.id,
      'text': data.text
    });
  }

  return EditView;

})();
