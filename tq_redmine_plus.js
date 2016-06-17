console.log('TQ Redmine Plus loaded');

var $taskboard = $("#taskboard"),
  $backlogsContainer = $("#backlogs_container");

if ($taskboard) {
  var $tasks = $('.task'),
    $stories = $('.story'),
    taskboarChangeTimer,
    $toolbarLinksTimer,
    userId = 0;
}

// Enable chosen select for project switcher.
$("#toolbar select, #quick-search select").chosen().on('change', function() {
  // Get onchange attribute code and execute it.
  var onchangeCode = $(this).attr('onchange');
  if (onchangeCode.length) {
    eval(onchangeCode);
  }
});

var processBacklogs = function($statusElements) {
  // Add status classes to story list items.
  $statusElements.each(function(index, item) {
    var $itemStatus = $(item),
      status = $itemStatus.text().replace(/[^a-z0-9]/g, function(s) {
        var c = s.charCodeAt(0);
        if (c == 32) return '-';
        if (c >= 65 && c <= 90) return s.toLowerCase();
        return ('000' + c.toString(16)).slice(-4);
      });

    $itemStatus.closest('.model').attr('class', $itemStatus.data('original-classes')).addClass(status);
  });
};

var processBacklogsDelayed = function($backlogs) {
  $backlogs.each(function () {
    var $backlog = $(this),
      $header = $backlog.find('.header'),
      $menuItems = $header.find('.menu .items'),
      $addStory = $menuItems.find('.add_new_story');

    if ($backlog.hasClass('tq-processed')) {
      return;
    }

    $backlog.addClass('tq-processed');

    // Add first two menu items as visible links.
    var $firstTwo = $menuItems.find('li').slice(0, 2).detach(),
      $buttonLinks = $firstTwo.find('a');

    $buttonLinks.eq(1).attr('target', '_blank');

    $buttonLinks.insertAfter($header);

    $addStory.on('mouseup', function() {
      $backlog.find('select.tracker_id').val(12);
    });

  });
};

var processTaskboardTasks = function() {
  // Get tasks again (on taskboard).
  $tasks = $('.task');

  $tasks.each(function() {
    var $task = $(this),
      $timerButtons = $task.find('.tq-timer-button');

    // Add timer control to tasks.
    if ($timerButtons.length == 0) {
      // Get tasks issue id.
      var issueID = $task.find('.id .v').text();

      // Create timer start/pause toggle.
      var $timerToggle = $('<a class="tq-timer-button tq-timer-toggle tq-timer-start" "href="#"></a>').on('click.tq-timer-toggle', function() {
        // Refresh timer status after a click.
        var $timer = $toolbarLinksTimer.contents().find('#time-tracker-menu'),
          $timerIcon = $timer.find('a.icon'),
          timerIsRunning = $timerIcon.hasClass('icon-clock'),
          timerIsPaused = $timerIcon.hasClass('icon-pause');

        if (timerIsPaused) {
          var $startTimer = $timer.find('.icon-start-action');
          $startTimer[0].click();
        }
        else if (timerIsRunning) {
          var $pauseTimer = $timer.find('.icon-pause-action');
          $pauseTimer[0].click();
        }
        else {
          // Change timer to use this issue (point iFrame to the issue page).
          $toolbarLinksTimer.attr('src', '/issues/' + issueID);
          $task.addClass('tq-start-timer');
          // Starting the actual timer will be done on load of the iframe.
        }
      });

      // Create timer stop button.
      var $timerStop = $('<a class="tq-timer-button tq-timer-stop" "href="#"></a>').on('click.tq-timer-stop', function() {
        var $timer = $toolbarLinksTimer.contents().find('#time-tracker-menu'),
          $stopTimer = $timer.find('.icon-stop-action');

        $stopTimer[0].click();
        $timerButtons.remove();
      });

      $task.find('.id .t').prepend($timerToggle, $timerStop);
    }

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


$(document).ready(function() {
  if ($backlogsContainer) {
    var $stories = $backlogsContainer.find('.story'),
      $statusElements = $stories.find('.status_id > .t'),
      originalStoryClasses = $stories.eq(0).attr('class');

    $statusElements.data('original-classes', originalStoryClasses);

    processBacklogs($statusElements);

    $stories.on('DOMSubtreeModified', function (e) {
      // Make sure we don't run this multiple times in a row.
      clearTimeout(taskboarChangeTimer);
      taskboarChangeTimer = setTimeout(function() {
        processBacklogs($(e.currentTarget));
      }, 200);
    });

    // Processing backlogs needs to wait at least a second to wait,
    // otherwise some DOM elements aren't build.
    // This is an experimental value.
    setTimeout(function(){
      var $backlogs = $backlogsContainer.find('.backlog');
      processBacklogsDelayed($backlogs)
    }, 800);
  }

  // Only enable taskboard enhancement if there is a taskboard.
  if ($taskboard) {
    // Use sticky header.
    getStorage({redmineTaskboardStickyToolbar: true}, function(items) {
      if (items.redmineTaskboardStickyToolbar) {
        $('html').addClass('tq-sticky-toolbar');
      }
    });

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
          $originalTimer = $issuePage.find('#time-tracker-menu'),
          $originalStartTimer = $originalTimer.find('.icon-start'),
          modifiedTimer;

        // Store current users id in the global scope.
        userId = $issuePage.find('#loggedas a').attr('href').substring(7);

        // Change / enhance timer links when there are changes.
        // Every minute this is triggered at least once due to timer updates.
        $originalTimer.on("DOMSubtreeModified", function() {
          // Make sure we don't run this multiple times in a row.
          clearTimeout(modifiedTimer);
          modifiedTimer = setTimeout(function() {
            // Get tasks again and remove active classes.
            $tasks = $('.task').removeClass('tq-active-timer tq-paused-timer tq-start-timer hide-timer-toggle');
            // Get timer icon, we can use its Class to detect the timer status.
            var $timerIcon = $originalTimer.find('a.icon'),
              timerIsRunning = $timerIcon.hasClass('icon-clock'),
              timerIsPaused = $timerIcon.hasClass('icon-pause'),
            // Get active issue.
              issueId = $timerIcon.text().substring(1);

            // If active issue is found.
            if (issueId > 0) {
              // Add special class to task block.
              var $timerTask = $('#issue_' + issueId);
              var $timerToggle = $timerTask.find('.tq-timer-toggle');

              // If timer is running.
              if (timerIsRunning) {
                $timerToggle.addClass('tq-timer-pause').removeClass('tq-timer-start');
                $timerTask.addClass('tq-active-timer');
              }
              else if (timerIsPaused) {
                $timerToggle.removeClass('tq-timer-pause').addClass('tq-timer-start');
                $timerTask.addClass('tq-paused-timer');
              }
              else {
                $timerToggle.removeClass('tq-timer-pause').addClass('tq-timer-start');
              }

              // Hide other timer toggles.
              $tasks.not('#issue_' + issueId).addClass('hide-timer-toggle');
            }
            else {
              $tasks.find('.tq-timer-toggle').removeClass('tq-timer-pause').addClass('tq-timer-start')
            }

            // Make sure all timer links open in a new tab.
            $originalTimer.find('a').attr('target', '_blank');

            // After clicking start/pause timer in the bar: update tasks.
            $originalTimer.find('.icon-start-action, .icon-pause-action').off('click.tq').on('click.tq', function() {
              $originalTimer.trigger('DOMSubtreeModified');
            });

            // After clicking stop timer in the bar: reset this iframe and
            // open the stop page in new tab.
            $originalTimer.find('.icon-stop-action').off('click.tq').on('click.tq', function() {
              $toolbarLinksTimer.attr('src', '/');
            });
          }, 200);
        }).trigger('DOMSubtreeModified');

        // Move the timer to the top of the page in the iFrame.
        $originalTimer.detach().prependTo($issuePage.find('body'));

        // Change the loaded page styling and hide not needed elements.
        // .css() doesn't work for some reason.
        $issuePage.find('html').attr('style', 'overflow:hidden;');
        $issuePage.find('body').attr('style', 'background:transparent;');
        $issuePage.find('#wrapper').hide();

        // Auto start timer on load.
        if ($originalStartTimer.length) {
          $originalStartTimer[0].click();
        }
      });
    });

    // Reinitialize the taskboard tasks when something changes.
    $taskboard.on("DOMSubtreeModified", function() {
      // Make sure we don't run this multiple times in a row.
      clearTimeout(taskboarChangeTimer);
      taskboarChangeTimer = setTimeout(function() {
        processTaskboardTasks();
      }, 200);
    });

    // Trigger once on load.
    processTaskboardTasks();
  }
});

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
