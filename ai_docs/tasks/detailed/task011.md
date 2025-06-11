# Parameter Display Precision Adjustments

## Problem
- ε_G (Gate Error Rate) shows insufficient precision for small values (e.g., 0.0001 displays as 0.000)
- η_c (Channel Efficiency) shows excessive precision (3 trailing zeros when only 1 is needed)

## Requirements
- ε_G should display 3-4 trailing zeros depending on the value
- η_c should display only 1 trailing zero

## Technical Details
- Update number formatting logic for parameter displays
- Ensure consistent and appropriate precision across different value ranges
- Maintain readability while showing necessary precision

## Acceptance Criteria
- [ ] ε_G values display with appropriate precision (3-4 decimal places)
- [ ] η_c values display with exactly 1 trailing zero
- [ ] Number formatting is consistent across the application
- [ ] All changes are tested with edge cases 