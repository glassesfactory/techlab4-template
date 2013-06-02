do(TECH)->
  class ShowController
    $el:null
    current:null
    isEdit:false
    state:false
    constructor:()->
      $el = $('#show')
      if not $el or $el.length < 1
        $('#container').append($('<div id="show" />'))
        $el = $('#show')
      @$el = $el
      @$el.addClass('detail')

      @resize()

      @$el.on 'click', '.delete', @deleteClickHandler
      @$el.on 'click', '.edit', @editClickHandler

      $(window).on 'resize', @resize

    show:(id)->
      @$el.animate {left: @.pos + 80}
      url = '/' + id
      @.state = true
      model = TweetModel.get(id)
      #あー
      if model
        @_fetchSuccessHandler(model)

    hide:()->
      @$el.animate { left: @.pos - 205}, ()=>
        @$el.empty()
        @.state = false
      return

    hideAndShow:(id)=>
      @$el.animate { left: @.pos - 225 }, ()=>
        @$el.empty()
        @show(id)

    _fetchSuccessHandler:(data)=>
      @current = data
      @$el.append(new ShowView(data).el)
      $('.closeShow').on 'click', @closeHandler

    _errorHandler:(error)=>
      console.log error

    closeHandler:(event)=>
      event.preventDefault()
      TECH.App.change('/')

    editClickHandler:(event)=>
      event.preventDefault()
      if @.isEdit
        return false
      $tweet = @$el.find('.tweet')
      $tweet.after(new EditView(@current).el)
      $tweet.hide()

      $('#editView').on 'click', '.cancel', @editCancelHandler
      $('#editView').on 'click', '.send', @editSendHandler

    editSendHandler:(event)=>
      event.preventDefault()
      form = $('#editView')
      data = form.serializeArray()
      action = form.attr('action')
      TweetModel.on(TECH.ModelEvent.UPDATED, @updatedHandler).on(TECH.IOErrorEvent.IO_ERROR, @updateFaildHandler)
      @current.update(data)

    updatedHandler:(event)=>
      TweetModel.off(TECH.ModelEvent.UPDATED, @updateHandler)
      $tweet = @$el.find('.tweet')
      $tweet.empty().append(@current.text)
      $tweet.show()
      $('#editView').remove()
      #一覧も変更
      #うーむ
      $listView = $('#tweetlist' + @current.id)
      $listView.find('.tweetBody').empty().append(@current.text)
      TECH.Alert.dispAlert '更新しました', 'alert-success'

    updateFaildHandler:(event)=>
      TECH.Alert.dispAlert '失敗しました。', 'alert-error'

    editCancelHandler:(event)=>
      $('#editView').remove()
      $tweet = @$el.find('.tweet')
      $tweet.show()

    deleteClickHandler:(event)=>
      event.preventDefault()
      id = $(event.currentTarget).data('delete')
      TECH.Alert.dispModalAlert '消してもいいの', @, @deleteTweet, [id]

    deleteTweet:(id)=>
      TweetModel.on(TECH.ModelEvent.DELETED, @deletedHandler)
      .on(TECH.IOErrorEvent.IO_ERROR, @deleteFaildHandler )
      @current.destroy()

    deletedHandler:(event)=>
      $listView = $('#tweetlist' + event.id)
      $listView.remove()
      @current = null
      TECH.App.change '/'
      TECH.Alert.dispAlert '削除しました', 'alert-success'

    deleteFaildHandler:(event)=>
      TECH.Alert.dispAlert "失敗しました。", 'alert-error'

    resize:(event)=>
      @.pos = window.innerWidth / 2
      if @.state
        @$el.css {left: @.pos + 80}
      else
        @$el.css {left: @.pos - 205}

  TECH.ShowController = ShowController