# Redmine Plus

This Chrome and Firefox plugins adds magic to Redmine. It particulary enhances the taskboard.

## Compatibility

The following software has been tested to work (partially).

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
- Full issue view
    - Always show all fields in the "Change properties " fieldset (no more clicking on "more").
    - On update, prefill the parent (story) ID in the log comment field.
- Timer stop
    - Prefill the parent (story) ID in the log comment field.

## Install

### Firefox

- Download the latest extension file (.xpi) via the Download tabs.
- Drag the downloaded file onto Firefox.
- Accept the install.
- Refresh Redmine if open.

### Chrome

- Download the latest extension file (.crx) via the Download tabs.
- Open the extensions tab ( More Tools -> Extensions).
- Drag the downloaded file onto this tab.
- Click "Add extension".
- Refresh Redmine if open.
