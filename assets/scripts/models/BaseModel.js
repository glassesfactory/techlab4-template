/*
  Gyosen.models.BaseModel
  の原型。
*/

var BaseModel,
  _this = this,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

BaseModel = (function() {

  BaseModel.url = '';

  BaseModel.loadCB = null;

  BaseModel.collection = [];

  BaseModel.length = 0;

  BaseModel._isLoaded = false;

  BaseModel.dataType = "json";

  BaseModel.contentType = "application/json";

  BaseModel._dispatcher = new EventDispatcher();

  BaseModel.isUnique = false;

  BaseModel.load = function(url, cb) {
    if (url && this.url === '') {
      this.url = url;
    }
    if (cb) {
      this.loadCB = cb;
    }
    $.ajax({
      url: this.url,
      dataType: this.dataType,
      contentType: this.contentType,
      success: this._success,
      error: this._error
    });
    return this;
  };

  BaseModel.queried = false;

  BaseModel.queriedCollection = [];

  BaseModel.isLoaded = function() {
    return BaseModel._isLoaded;
  };

  BaseModel.get = function(id) {
    var model;
    if (this.collection.length < 1) {
      throw new Error('has not entity.');
    }
    model = _.find(this.collection, function(model) {
      return model.id === id;
    });
    if (!model) {
      return null;
    }
    return model;
  };

  BaseModel.on = function(type, listener) {
    this._dispatcher.addEventListener(type, listener);
    return this;
  };

  BaseModel.off = function(type, listener) {
    this._dispatcher.removeEventListener(type, listener);
    return this;
  };

  BaseModel._success = function(data) {
    BaseModel._isLoaded = true;
    BaseModel._appendToCollection(data);
    return BaseModel._dispatcher.dispatchEvent(new TECH.Event(TECH.Event.COMPLETE));
  };

  BaseModel._error = function(error) {
    console.warn(error);
    return this._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR, "load failed"));
  };

  BaseModel._appendToCollection = function(data) {
    var x, _i, _len;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      x = data[_i];
      BaseModel.collection.push(new BaseModel(x));
    }
    if (BaseModel.isUnique) {
      BaseModel.collection = Gyosen.unique(BaseModel.collection);
    }
    BaseModel.length = BaseModel.collection.length;
    if (BaseModel.loadCB != null) {
      BaseModel.loadCB.apply();
    }
  };

  BaseModel.filter = function(checkFunc) {
    var model, result, _i, _len, _ref;
    if (!this.queried) {
      this.queriedCollection = this.collection;
      this.queried = true;
    }
    _ref = this.queriedCollection;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      model = _ref[_i];
      result = checkFunc(model);
      if (result) {
        results.push(result);
      }
    }
    this.queriedCollection = results;
    return this;
  };

  /*
  ====================
    for instance
  ====================
  */


  BaseModel.prototype.id = null;

  BaseModel.prototype.propNames = [];

  function BaseModel(properties) {
    var _this = this;
    this.toMsgPack = function() {
      return BaseModel.prototype.toMsgPack.apply(_this, arguments);
    };
    this.toJSON = function() {
      return BaseModel.prototype.toJSON.apply(_this, arguments);
    };
    this.toFormArray = function() {
      return BaseModel.prototype.toFormArray.apply(_this, arguments);
    };
    this.toDict = function() {
      return BaseModel.prototype.toDict.apply(_this, arguments);
    };
    this.update = function(data) {
      return BaseModel.prototype.update.apply(_this, arguments);
    };
    this.save = function(data) {
      return BaseModel.prototype.save.apply(_this, arguments);
    };
    this.bindData = function(properties) {
      return BaseModel.prototype.bindData.apply(_this, arguments);
    };
    if (properties != null) {
      this.bindData(properties);
    }
    return;
  }

  BaseModel.prototype.bindData = function(properties) {
    var prop, _results;
    _results = [];
    for (prop in properties) {
      this.propNames.push(prop);
      _results.push(this[prop] = properties[prop]);
    }
    return _results;
  };

  BaseModel.prototype.save = function(data) {
    var cls,
      _this = this;
    if (!data) {
      data = this.toFormArray();
    }
    cls = this.constructor;
    $.ajax({
      url: cls.url,
      method: "POST",
      data: data,
      success: function(data) {
        _this.bindData(data);
        cls.collection.unshift(_this);
        return cls._dispatcher.dispatchEvent(new TECH.ModelEvent(TECH.ModelEvent.ADDED, _this.id));
      },
      error: function(error) {
        return cls._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR));
      }
    });
  };

  BaseModel.prototype.update = function(data) {
    var cls,
      _this = this;
    cls = this.constructor;
    $.ajax({
      url: cls.url + this.id,
      method: "PUT",
      data: data,
      success: function(data) {
        _this.bindData(data);
        return cls._dispatcher.dispatchEvent(new TECH.ModelEvent(TECH.ModelEvent.UPDATED, _this.id));
      },
      error: function(error) {
        return cls._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR));
      }
    });
  };

  BaseModel.prototype.destroy = function() {
    var cls,
      _this = this;
    cls = this.constructor;
    $.ajax({
      url: cls.url + this.id,
      method: "DELETE",
      dataType: "json",
      success: function(data) {
        var i, len, model;
        i = 0;
        len = cls.collection.length;
        while (i < len) {
          model = cls.collection[i];
          if (model.id === data.id) {
            break;
          }
          i++;
        }
        cls.collection = cls.collection.splice(i, 1);
        return cls._dispatcher.dispatchEvent(new TECH.ModelEvent(TECH.ModelEvent.DELETED, _this.id));
      },
      error: function(error) {
        return cls._dispatcher.dispatchEvent(new TECH.IOErrorEvent(TECH.IOErrorEvent.IO_ERROR));
      }
    });
  };

  BaseModel.prototype.throwError = function(err) {
    throw err;
  };

  BaseModel.prototype.toDict = function() {
    var name, param, _i, _len, _ref;
    param = {};
    _ref = this.propNames;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      param[name] = this[name];
    }
    return param;
  };

  BaseModel.prototype.toFormArray = function() {
    var name, obj, param, _i, _len, _ref, _results;
    param = [];
    _ref = this.propNames;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      name = _ref[_i];
      obj = {};
      obj["name"] = name;
      obj["value"] = this[name];
      _results.push(param.push(obj));
    }
    return _results;
  };

  BaseModel.prototype.toJSON = function() {
    return JSON.stringify(this.toDict());
  };

  BaseModel.prototype.toMsgPack = function() {
    if (!msgpack && __indexOf.call(window, "msgpack") < 0) {
      throw new Error('msgpack.js not found....');
    }
    return msgpack.pack(this.toDict());
  };

  return BaseModel;

}).call(this);
