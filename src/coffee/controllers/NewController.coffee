do(TECH)->
  class NewController
    $el:null
    $screen: null
    constructor:()->
      $('.new').on 'click', @toggleClickHandler

    toggleClickHandler:(event)=>
      event.preventDefault()
      if @.$container
        @_removeContainer()
      else
        $body = $('body')
        $body.append('<div id="screen" />')
        $body.append('<div id="newContainer" />')
        if not @$el
          @$el = new TECH.NewView().el
        @.$container = $('#newContainer')
        @.$container.append(@$el)
        @.$container.css {left: TECH.win.innerWidth / 2 - 215}
        $('form').on 'submit', @_sendTweetHandler
        $('textarea[name=text]').focus()
        $('.close').on 'click', @closeHandler

        @.$screen = $('#screen')
        @.$screen.on 'click', @_screenClickHandler

    _sendTweetHandler:(event)=>
      event.preventDefault()
      data = $('#newForm').serializeArray()
      model = new TweetModel()
      TweetModel.on(TECH.ModelEvent.ADDED, @tweetSuccessHandler)
      .on(TECH.IOErrorEvent.IO_ERROR, @tweetErrorHandler)
      model.save(data)
      @_removeContainer()

    tweetSuccessHandler:(event)=>
      TweetModel.off(TECH.ModelEvent.ADDED, @tweetSuccessHandler).off(TECH.IOErrorEvent.IO_ERROR, @tweetErrorHandler)
      TECH.Alert.dispAlert '作成しました', 'alert-success'

    tweetErrorHandler:(event)=>
      console.error "失敗しました。"
      TECH.Alert.dispAlert '失敗しました。', 'alert-error'

    closeHandler:(event)=>
      event.preventDefault()
      @_removeContainer()

    _screenClickHandler:(event)=>
      event.preventDefault()
      @_removeContainer()

    _removeContainer:()=>
      @.$container.remove()
      @.$screen.remove()
      @.$container = null
      @.$screen = null
  TECH.NewController = NewController