console.log('TQ Redmine Plus loaded');

var $taskboard = $("#taskboard");

// Only enable taskboard enhancement if there is a taskboard.
if ($taskboard) {
  var $tasks = $('.task'),
    taskboarChangeTimer,
    $toolbarLinksTimer,
    userId = 0;

  // Initialize timer if configured (or by default).
  getStorage({redmineTaskboardTimer: true}, function(items) {
    if (!items.redmineTaskboardTimer) {
      return;
    }
    // Place timer placeholder.
    $toolbarLinksTimer = $('<iframe id="tq-timer"></span>').prependTo($('#toolbar').find('.links'));

    // Load a page with the timer in an iframe and enhance on load.
    $toolbarLinksTimer.attr('src', '/').on('load', function() {
      // Get iframe content.
      var $issuePage = $(this).contents(),
        $timer = $issuePage.find('#time-tracker-menu'),
        $startTimer = $timer.find('.icon-start'),
        modifiedTimer;
      
      // Store current users id.
      userId = $issuePage.find('#loggedas a').attr('href').substring(7);
      
      // Change / enhance timer links when there are changes.
      // Every minute this is triggered at least once due to timer updates.
      $timer.on("DOMSubtreeModified", function() {
        // Make sure we don't run this multiple times in a row.
        clearTimeout(modifiedTimer);
        modifiedTimer = setTimeout(function() {
          // Get tasks again and remove active classes.
          $tasks = $('.task').removeClass('tq-active-timer tq-paused-timer tq-start-timer hide-timer-toggle');
          // Get active issue.
          var $timerIcon = $timer.find('a.icon');
          var issueId = $timerIcon.text().substring(1);
          
          // If active issue is found.
          if (issueId > 0) {
            // Add special class to task block.
            var $timerTask = $('#issue_' + issueId);
            var $timerToggle = $timerTask.find('.tq-timer-toggle');
            
            // If timer is running.
            if ($timerIcon.hasClass('icon-clock')) {
              $timerTask.addClass('tq-active-timer');
              $timerToggle.text('active');
            }
            else if ($timerIcon.hasClass('icon-pause')) {
              $timerTask.addClass('tq-paused-timer');
              $timerToggle.text('paused');
            }
            // @todo add pause / stop actions, move click event add here.
            //.off('click.tq-start').on('click.tq-start', 

            // Hide other timer toggles.
            $tasks.not('#issue_' + issueId).addClass('hide-timer-toggle');
          }
          else {
            // Reset tasks timer toggle text.
            $tasks.find('.tq-timer-toggle').text('start');
          }
          
          // Make sure all timer links open in a new tab.
          $timer.find('a').attr('target', '_blank');

          // After clicking start/pause timer update tasks. 
          $timer.find('.icon-start-action, .icon-pause-action').off('click.tq').on('click.tq', function() {
            $timer.trigger('DOMSubtreeModified');
          });
          
          // After clicking stop timer, reset this iframe. 
          // Stop page is opened in new tab.
          $timer.find('.icon-stop-action').off('click.tq').on('click.tq', function() {
            $toolbarLinksTimer.attr('src', '/');
          });
        }, 200);
      }).trigger('DOMSubtreeModified');
      
      // Move the timer to the top of the page in the iFrame.
      $timer.detach().prependTo($issuePage.find('body'));
      
      // Change the loaded page styling and hide not needed elements.
      // .css() doesn't work for some reason.
      $issuePage.find('html').attr('style', 'overflow:hidden;');
      $issuePage.find('body').attr('style', 'background:transparent;');
      $issuePage.find('#wrapper').hide();
      
      // Auto start timer on load.
      if ($startTimer.length) {
        $startTimer[0].click();
      }
    });
  });

  var initTaskboardTasks = function() {
    // Get tasks again (on taskboard).
    $tasks = $('.task');

    $tasks.each(function() {
      var $task = $(this);

      getStorage({redmineTaskboardTimer: true}, function(items) {
          if (items.redmineTaskboardTimer) {
          // Add timer toggle.
          if ($task.find('.tq-timer-toggle').length == 0) {
            // Get tasks issue id.
            var issueID = $task.find('.id .v').text();
            
            // Change timer to use this issue.
            var $timerToggle = $('<a class="tq-timer-toggle" "href="#">start</a>').on('click.tq-start', function() {
                $toolbarLinksTimer.attr('src', '/issues/' + issueID);
                $task.addClass('tq-start-timer');
            });
            $task.find('.id .t').prepend($timerToggle);
          }
        }
      });

      // Attach our own open task click event, make sure we don't attach multiple handlers.
      $task.off('click.tq-task').on('click.tq-task', function() {
        var storyId = $task.closest('tr').find('.story > .story_tooltip > a').text(),
          $taskEditorDialog = $('.task_editor_dialog');

        // Attach click hander to the task submit buttons, to be able to remove
        // our prefilled comment if nou hours are given.
        // This prevents 0.0 hours time log entries.
        $taskEditorDialog.find('button').off('click.tq-task mousedown.tq-task keydown.tq-task').on('click.tq-task mousedown.tq-task keydown.tq-task', function() {
          if ($('input.time_entry_hours').val().length == 0) {
            $('textarea.time_entry_comments').val('');
          }
        });

        // Pre-fil content
        $taskEditorDialog.find('textarea.time_entry_comments').val('#'+storyId+' ');
        // Set log time user.
        getStorage({
          redmineUserId: '',
          redmineTaskboardTimer: true
        },
        function(items) {
          if (items.redmineTaskboardTimer && userId) {
            $('.time_entry_user_id').val(userId);
          }
          else if (items.redmineUserId.length > 0) {
            $('.time_entry_user_id').val(items.redmineUserId);
          }
        });
      });
    });
  };

  // Reinitialize the taskboard tasks when something changes.
  $taskboard.on("DOMSubtreeModified", function() {
    // Make sure we don't run this multiple times in a row.
    clearTimeout(taskboarChangeTimer);
    taskboarChangeTimer = setTimeout(function() {
      initTaskboardTasks();
    }, 200);
  }); 
  
  // Trigger once on load.
  initTaskboardTasks();
}

// Get story ID (parent issue on full issue view).
var storyId = $('#issue_parent_issue_id').val();

// Show more 'Change properties'.
getStorage({
    redmineShowAllProperties: true
  },
  function(items) {
    if (items.redmineShowAllProperties) {
      $('#issue-form').find('#issue_descr_fields').show();
    }
  }
);

// Prefill time entry (on full issue view)
if (deeptest('storyId') && storyId.length > 0) {
  $('#time_entry_comments').val('#'+storyId+' ');
}

// Attach click hander to the issue update submit buttons, to be able to remove
// our prefilled comment if nou hours are given.
$('#issue-form').on('submit', function() {
  if ($('#time_entry_hours').val().length == 0) {
    $('#time_entry_comments').val('');
  }
});
