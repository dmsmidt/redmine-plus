// Saves options to chrome.storage
function save_options() {
  var redmineTaskboardTimer = document.getElementsByName('redmine-taskboard-use-timer')[0].checked;
  var redmineTaskboardStickyToolbar = document.getElementsByName('redmine-taskboard-sticky-toolbar')[0].checked;
  var redmineShowAllProperties = document.getElementsByName('redmine-show-all-properties')[0].checked;
  var redmineUserId = document.getElementsByName('redmine-user-id')[0].value;
  
  setStorage({
    redmineTaskboardTimer: redmineTaskboardTimer,
    redmineTaskboardStickyToolbar: redmineTaskboardStickyToolbar,
    redmineUserId: redmineUserId,
    redmineShowAllProperties: redmineShowAllProperties
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved!';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

// Restores state using the preferences stored in chrome.storage.
function restore_options() {
  getStorage({
    redmineTaskboardTimer: true,
    redmineTaskboardStickyToolbar: true,
    redmineUserId: '',
    redmineShowAllProperties: true
  }, function(items) {
    if (items.redmineTaskboardTimer) {
      document.getElementsByName('redmine-taskboard-use-timer')[0].checked = true;
    }
    if (items.redmineTaskboardStickyToolbar) {
      document.getElementsByName('redmine-taskboard-sticky-toolbar')[0].checked = true;
    }
    if (items.redmineShowAllProperties) {
      document.getElementsByName('redmine-show-all-properties')[0].checked = true;
    }
    document.getElementsByName('redmine-user-id')[0].value = items.redmineUserId;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
