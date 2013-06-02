var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(TECH) {
  var ModelEvent,
    _this = this;
  ModelEvent = (function(_super) {

    __extends(ModelEvent, _super);

    ModelEvent.ADDED = "added";

    ModelEvent.UPDATED = "updated";

    ModelEvent.DELETED = "deleted";

    ModelEvent.REMOVED = "removed";

    ModelEvent.FAILD = "faild";

    function ModelEvent(type, id) {
      var _this = this;
      this.type = type;
      this.id = id != null ? id : null;
      this.toString = function() {
        return ModelEvent.prototype.toString.apply(_this, arguments);
      };
    }

    ModelEvent.prototype.toString = function() {
      return "ModelEvent:: type:" + this.type + "id:" + this.id;
    };

    return ModelEvent;

  })(TECH.Event);
  return TECH.ModelEvent = ModelEvent;
})(TECH);
