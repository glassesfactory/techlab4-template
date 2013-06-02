do(TECH)->
  class IndexController
    $el:null
    state:true
    constructor:()->
      @.$el = $('#main')
      @.$el.on 'click', '.article', @articleSelectedHandler
      @resize()

      TweetModel.on(TECH.ModelEvent.ADDED, @newTweetAppend)
      TECH.$win.on 'resize', @resize

    hasModelLoaded:()=>
      return TweetModel.isLoaded()

    load:()=>
      TweetModel.on(TECH.Event.COMPLETE, @modelLoaded).on(TECH.IOErrorEvent.IO_ERROR, @loadFaild).load()

    modelLoaded:(event)=>
      TweetModel.off(TECH.Event.COMPLETE, @modelLoaded).off(TECH.IOErrorEvent.IO_ERROR, @loadFailed)
      if TweetModel.isLoaded()
        TECH.App.resume()
        @render()
      else
        #本来ならリトライ処理とかエラー表示かますとかしましょう。
        console.warn "do retry"
        return

    render:()->
      elem = ''
      if TweetModel.collection.length < 1
        elem += '<article class="article nullpo">ぬるぽ</article>'
      tweets = TweetModel.collection
      for tweet in tweets
        elem += new TECH.IndexListView(tweet).el
      @.$el.append(elem)
      $('#container').css { 'height': @$el.height() + 20}

    articleSelectedHandler:(event)=>
      event.preventDefault()
      tgt = event.currentTarget
      id = $(tgt).attr('id').replace('tweetlist', '')
      if TECH.App.fragment is '/' + id
        TECH.App.change('/')
        return
      else if TECH.App.fragment isnt '/'
        @hide()
      TECH.App.change('/' + id)

    newTweetAppend:(event)=>
      model = TweetModel.get(event.id)
      @.$el.prepend(new TECH.IndexListView(model).el)

    slide:()=>
      @$el.animate {left: @.pos - 420}
      @.state = false

    hide:()=>
      @$el.animate {left: @.pos - 250 }
      @.state = true

    resize:()=>
      container = $('#container')
      @.pos = container.offset().left + container.width() / 2
      if @.state
        @.$el.css {left: @.pos - 250}
      else
        @$el.css {left: @.pos - 420}
  TECH.IndexController = IndexController