# Parameter Label Updates

## Status
Completed

## Problem
Current parameter labels are unclear or imprecise:
- N (Network Size) needs to be updated
- M label is incomplete
- η_c label needs more specific terminology

## Required Label Changes
- N (Network Size) → N (Segment Count)
- M (...) → M (Multiplexing Amount)
- η_c (Channel Efficiency) → η_c (BSA Coupling Efficiency)

## Technical Details
- Update label text in UI components
- Ensure consistent label display across all views
- Maintain proper formatting of special characters (η_c)

## Acceptance Criteria
- [x] All labels are updated with new text
- [x] Special characters render correctly
- [x] Labels are consistent across all views and components
- [x] UI layout remains intact after label changes 