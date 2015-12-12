var LocalStore = {
  get: function(key, dfault) {
    return (localStorage.getItem(key) || dfault);
  },
  getObject: function(key, dfault) {
    if (!LocalStore.get(key)) { return dfault; }
    return (JSON.parse(LocalStore.get(key)) || dfault);
  },
  getBoolean: function(key, dfault) {
    return (this.get(key) == "true" || dfault)
  },
  set: function(key, value) {
    return localStorage.setItem(key, value);
  },
  setObject: function(key, obj) {
    return this.set(key, JSON.stringify(obj));
  },
  setBoolean: function(key, booleanValue) {
    return this.set(key, booleanValue.toString())
  },
  remove: function(key) {
    return localStorage.removeItem(key);
  },
  clear: function() {
    return localStorage.clear();
  }
}
