var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

(function(TECH) {
  var IOErrorEvent;
  IOErrorEvent = (function(_super) {

    __extends(IOErrorEvent, _super);

    IOErrorEvent.IO_ERROR = "io_error";

    function IOErrorEvent(type, msg) {
      this.type = type;
      this.msg = msg;
    }

    return IOErrorEvent;

  })(TECH.Event);
  return TECH.IOErrorEvent = IOErrorEvent;
})(TECH);
