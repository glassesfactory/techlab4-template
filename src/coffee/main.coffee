require.config {
  shim : {
    'jquery':{
      exports:'jQuery'
    },
    'lodash':{
      exports:'_'
    }
  },
  paths: {
    'jquery' : 'libs/jquery.min'
    'lodash' : 'libs/lodash.min'
    'kazitori' : 'libs/kazitori'
  }
}

require ['jquery', 'lodash', 'kazitori'], ()->
  do(window)->
    window.TECH = {
      'version': 0.2
      'debug': true
      'name': 'TECH LAB4'
      'App': null
    }
  TECH.win = window
  TECH.$win = $(TECH.win)