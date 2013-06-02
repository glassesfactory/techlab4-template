do(TECH)->
  class IOErrorEvent extends TECH.Event
    @IO_ERROR = "io_error"

    constructor:(@type, @msg)->
  TECH.IOErrorEvent = IOErrorEvent