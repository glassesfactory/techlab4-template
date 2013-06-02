do(TECH)->
  class ModelEvent extends TECH.Event
    #うーん
    @ADDED = "added"
    @UPDATED = "updated"
    @DELETED = "deleted"
    @REMOVED = "removed"
    @FAILD = "faild"
    constructor:(@type, @id=null)->

    toString:()=>
      return "ModelEvent:: type:" + @.type + "id:" + @.id
  TECH.ModelEvent = ModelEvent