# Plot Issues Resolution

## Problem
Multiple issues with plot functionality and data:

1. 3D Global Schedule Plot
- Not responding to rule changes
- Shows F_th 0.97 regardless of rule controller changes

2. Threshold Heatmap
- Missing proper M value specification in consolidated_threshold_N_heatmap filename
- consolidated_threshold_M_heatmap file not needed

3. eta_c Comparison Plot
- Rule controller not affecting view
- Missing critical data (e.g., epsilon_G values)

## Technical Details
### 3D Global Schedule Plot
- Investigate rule change handler connection
- Verify data update pipeline
- Ensure F_th values update properly

### Threshold Heatmap
- Remove consolidated_threshold_M_heatmap handling
- Update filename convention to include M value
- Implement proper file selection logic

### eta_c Comparison
- Fix rule controller connection
- Document missing data requirements
- Plan data structure updates

## Acceptance Criteria
- [ ] 3D plot responds correctly to rule changes
- [ ] Threshold heatmap uses correct file naming convention
- [ ] eta_c comparison updates with rule changes
- [ ] All required data points are properly documented
- [ ] Missing data requirements are specified

## Blockers
- Missing M value in threshold heatmap filenames
- Missing data for eta_c comparison plots
- Need to determine handling of epsilon_G data 