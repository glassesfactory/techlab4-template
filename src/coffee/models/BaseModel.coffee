###
  Gyosen.models.BaseModel
  の原型。
###
class BaseModel
  @url: ''
  #ロードした後のコールバック
  @loadCB: null

  #コレクション
  #あまり直接操作することは非推奨だけど触れたほうがいいっちゃいいような
  @collection: []
  #格納しているモデルの数
  @length:0

  @_isLoaded: false
  @dataType: "json"
  @contentType: "application/json"
  @_dispatcher: new EventDispatcher()
  @isUnique: false

  #サーバーからデータを読み込む
  @load:(url, cb)->
    if url and @.url is ''
      @.url = url
    if cb
      @.loadCB = cb
    #data type の判定いるかなー
    #msgpack だった時とか
    # jquery に依存してるじゃないですか…
    $.ajax(
      url: @.url
      dataType: @.dataType
      contentType: @.contentType
      success: @._success
      error: @._error
    )
    return @
  #プライベートにしたほうがいいねぇ
  @queried: false
  @queriedCollection: []

  #モデルが読み込み済みかどうか
  @isLoaded:()=>
    return @_isLoaded

  #get entity.
  @get:(id)->
    if @.collection.length < 1
      throw new Error('has not entity.')
    #todo: _ に依存させない
    model = _.find(@.collection, (model)->
      return model.id is id
      )
    if not model
      #リトライするかどうか
      return null
    return model

  @on:(type, listener)->
    @._dispatcher.addEventListener(type, listener)
    return @

  @off:(type, listener)->
    @._dispatcher.removeEventListener(type, listener)
    return @

  @_success:(data)=>
    @._isLoaded = true
    @_appendToCollection(data)
    @._dispatcher.dispatchEvent(new TECH.Event(TECH.Event.COMPLETE))

  @_error:(error)->
    console.warn error
    @._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR, "load failed"))

  @_appendToCollection:(data)=>
    for x in data
      @.collection.push new @(x)
    #コレクション内のモデルをユニークにするかどうか
    if @.isUnique
      #どこに書くかな
      @.collection = Gyosen.unique(@.collection)
    @.length = @.collection.length
    if @.loadCB?
      @.loadCB.apply()
    return

  @filter:(checkFunc)->
    if not @queried
      @queriedCollection = @collection
      @queried = true
    for model in @queriedCollection
      result = checkFunc(model)
      if result
        results.push result
    @queriedCollection = results
    return @

  ###
  ====================
    for instance
  ====================
  ###

  id:null

  propNames:[]

  constructor:(properties)->
    if properties?
      @bindData(properties)
    return

  bindData:(properties)=>
    for prop of properties
      @.propNames.push prop
      @[prop] = properties[prop]

  #データを保存する
  save:(data)=>
    if not data
      data = @.toFormArray()

    cls = @constructor

    $.ajax({
      url: cls.url
      method: "POST"
      data:data
      success:(data)=>
        @bindData(data)
        #んー
        cls.collection.unshift @
        cls._dispatcher.dispatchEvent(new TECH.ModelEvent(TECH.ModelEvent.ADDED, @.id))
      error: (error)->
        cls._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR))
      })
    return

  update:(data)=>
    # @throwError(new Error("not implements"))
    cls = @constructor
    $.ajax({
      url: cls.url + @.id
      method: "PUT"
      data: data
      success:(data)=>
        @bindData(data)
        cls._dispatcher.dispatchEvent(new TECH.ModelEvent(TECH.ModelEvent.UPDATED, @.id))
      error: (error)->
        cls._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR))
      })
    return

  destroy:()->
    cls = @constructor
    $.ajax({
      url: cls.url + @.id
      method: "DELETE"
      dataType: "json"
      success:(data)=>
        #なんかなかったっけ
        i = 0
        len = cls.collection.length
        while i < len
          model = cls.collection[i]
          if model.id is data.id
            break
          i++
        cls.collection = cls.collection.splice(i, 1)
        cls._dispatcher.dispatchEvent(new TECH.ModelEvent(TECH.ModelEvent.DELETED, @.id))
      error: (error)->
        cls._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR))
      })
    return

  throwError:(err)->
    throw err

  #モデルを Dict (Objectハッシュマップ) にして返す
  toDict:()=>
    param = {}
    for name in @propNames
      param[name] = @[name]
    return param

  #なまえ…
  toFormArray:()=>
    param = []
    for name in @propNames
      obj = {}
      obj["name"] = name
      obj["value"] = @[name]
      param.push(obj)

  #モデルを JSON にして返す
  toJSON:()=>
    return JSON.stringify(@toDict())

  #モデルを msgpack にして返す
  toMsgPack:()=>
    if not msgpack and "msgpack" not in window
      throw new Error('msgpack.js not found....')
    return msgpack.pack(@toDict())