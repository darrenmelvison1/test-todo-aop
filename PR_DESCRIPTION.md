# Todo Statistics Component

This PR adds a new statistics feature to the Todo application that displays various metrics about the user's tasks.

## Changes

- Created a new TodoStats component that shows task metrics
- Added a types directory with TodoItem interface
- Integrated the statistics component into the main Todo component
- Implemented toggle functionality to show/hide statistics
- Added a progress bar for completion rate visualization

## Features

The new statistics component displays:
- Total number of tasks
- Completed tasks count
- Active tasks count 
- Completion rate (percentage)
- Average task length (in characters)

The component uses custom styling with inline CSS to achieve the desired visual appearance.

## Testing

The component has been tested with various task states:
- Empty task list (component doesn't display)
- Tasks with different completion states
- Adding, completing, and removing tasks to ensure statistics update properly 