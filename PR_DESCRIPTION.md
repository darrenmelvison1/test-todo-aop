# Add Import/Export Functionality for Todo Items

## Description
This PR adds the ability for users to export their todos to JSON files and import them back later. This feature enhances the app's usability by allowing users to backup their todos and transfer them between devices.

## Features
- Export all todos to a JSON file
- Import todos from previously exported JSON files
- Simple UI with dedicated export and import buttons
- Validation of imported files to ensure data integrity

## Implementation Details
- Added utility functions for serializing and deserializing todo data
- Implemented file download mechanism for exporting
- Created a file input system for importing JSON data
- Added validation to ensure imported data matches the expected structure

## Testing
- Exported todos with various states (completed/not completed)
- Successfully imported previously exported todo files
- Validated error handling for invalid import files
- Tested with empty todo lists and various file sizes

This enhancement improves user experience by providing data portability while maintaining a clean and intuitive interface. 