# Redmine Plus

This Chrome and Firefox plugins adds magic to Redmine. 
It particularly enhances the backlog and taskboard of the Redmine Backlogs plugin.

## Compatibility

The following Redmine and plugin versions are tested:
- Redmine 2.6.10
- Redmine Backlogs v1.0.6
- Time logger 0.5.4
- Redmine Timesheet Plugin 0.7.0

The following software has been tested to work (at least partially):
- Chrome 50+
- Firefox 48+

## Functionality 

- Select lists enhanced with the Chosen plugin (project switcher)
- Master backlog enhancement
    - Stories are styled differently based on their status.
    - Quick links to add a new story and go to the taskboard (new tab).
    - Creating a new story will actually create a new story and not a deliverable.
- Taskboard enhancement
    - Prefill "Time Entry Comments" of a task with the parent issue id (story)
    - Prefill "Time Entry User" of a task with the logged in user (no more accidentally booking time for someone else)
    - Show and navigate the timer in the navigation bar.
    - Directly start/stop/pause timer from a task.
    - Visually show the timer status for the active task.
    - Sticky toolbar.
    - Colored rows based on the story status.
    - Bring back easy new task creation by clicking in a "new" cell.
    - Allow submitting a new task or task changes by pressing "Ctrl + Enter"
- Full issue view
    - Always show all fields in the "Change properties " fieldset (no more clicking on "more").
    - On update, prefill the parent (story) ID in the log comment field.
- Timer stop
    - Prefill the parent (story) ID in the log comment field.
