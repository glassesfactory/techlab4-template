do(TECH)->
  class Event
    @COMPLETE = "complete"
    @START = "start"
    @STOP = "stop"

    type: null
    constructor:(@type)->
      if not type
        throw new Error("type is たりてない")

    toString:()=>
      return "Event:: type" + @.type
  TECH.Event = Event