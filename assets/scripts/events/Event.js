
(function(TECH) {
  var Event,
    _this = this;
  Event = (function() {

    Event.COMPLETE = "complete";

    Event.START = "start";

    Event.STOP = "stop";

    Event.prototype.type = null;

    function Event(type) {
      var _this = this;
      this.type = type;
      this.toString = function() {
        return Event.prototype.toString.apply(_this, arguments);
      };
      if (!type) {
        throw new Error("type is たりてない");
      }
    }

    Event.prototype.toString = function() {
      return "Event:: type" + this.type;
    };

    return Event;

  })();
  return TECH.Event = Event;
})(TECH);
