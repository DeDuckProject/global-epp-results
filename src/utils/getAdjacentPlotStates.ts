import { PlotState } from '@/types/PlotState';
import { parameterValues } from '@/data/plotMeta';
import { getAvailableRules } from './getAvailableRules';

/**
 * Get adjacent values for a numeric parameter from its ordered array
 */
function getAdjacentValues<T>(values: T[], currentValue: T): T[] {
  const currentIndex = values.indexOf(currentValue);
  if (currentIndex === -1) return [];

  const adjacentValues: T[] = [];
  if (currentIndex > 0) adjacentValues.push(values[currentIndex - 1]);
  if (currentIndex < values.length - 1) adjacentValues.push(values[currentIndex + 1]);
  return adjacentValues;
}

/**
 * Returns a set of plot states that are "adjacent" to the current state,
 * where each returned state differs from the input state by exactly one parameter.
 */
export function getAdjacentPlotStates(currentState: PlotState): Set<PlotState> {
  const adjacentStates = new Set<PlotState>();

  // Handle numeric parameters
  const numericParams: (keyof Pick<PlotState, 'eta_c' | 'epsilon_G' | 'N' | 'M'>)[] = ['eta_c', 'epsilon_G', 'N', 'M'];
  
  numericParams.forEach(param => {
    const values = parameterValues[param];
    const adjacentValues = getAdjacentValues(values, currentState[param]);
    
    adjacentValues.forEach(value => {
      adjacentStates.add({
        ...currentState,
        [param]: value
      });
    });
  });

  // Handle rules - get two alternative rules if available
  const availableRules = getAvailableRules(currentState);
  if (availableRules.size > 1) {
    const otherRules = Array.from(availableRules)
      .filter(rule => rule !== currentState.rule)
      .slice(0, 2);

    otherRules.forEach(rule => {
      adjacentStates.add({
        ...currentState,
        rule
      });
    });
  }

  return adjacentStates;
} 