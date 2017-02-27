// Vanilla JS only.

// Generic function to create nice css class names for a given string.
function createCssClass(text) {
  return text.replace(/[^a-z0-9]/g, function(s) {
    var c = s.charCodeAt(0);
    if (c == 32) return '-';
    if (c >= 65 && c <= 90) return s.toLowerCase();
    return ('000' + c.toString(16)).slice(-4);
  });
}

// Test if (sub)object exists.
function deeptest(string) {
  var s = string.split('.');
  if (s.length == 1) {
    if (typeof this[string] == 'undefined') {
      return false;
    }
    return string;
  }
  var obj = this[s.shift()];
  while(obj && s.length - 1) obj = obj[s.shift()];
  return obj;
}

// Compatibility function for getting settings.
function getStorage(items, callback) {
  // Try to get the settings from the sync area if available.
  if (deeptest('chrome.storage.sync.get')) {
    chrome.storage.sync.get(items, callback);
  }
  // Otherwise try to use the local storage area.
  else if (deeptest('chrome.storage.local.get')) {
    chrome.storage.local.get(items, callback);
  }
  // Fallback to the defaults passed in.
  else {
    callback.call(this, items);
  }
}

// Compatibility function for setting settings.
function setStorage(items, callback) {
  // Try to set the settings from the sync area if available.
  if (deeptest('chrome.storage.sync.set')) {
    chrome.storage.sync.set(items, callback);
  }
  // Otherwise try to use the local storage area.
  else if (deeptest('chrome.storage.local.set')) {
    chrome.storage.local.set(items, callback);
  }
  // Fallback, no saving.
  else {
    callback.call(false);
  }
}
