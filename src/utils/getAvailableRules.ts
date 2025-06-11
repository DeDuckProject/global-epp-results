import { PlotState } from '@/types/PlotState';
import { plotMeta } from '@/data/plotMeta';
import { isEqual } from 'lodash-es';

/**
 * Computes the set of available rules for a given plot state.
 * @param plotState - The current state of the plot explorer.
 * @returns A Set containing the available rule strings.
 */
export function getAvailableRules(plotState: Omit<PlotState, 'rule'>): Set<string> {
  const rules = new Set<string>();

  for (const entry of plotMeta) {
    if (entry.plotType !== plotState.currentPlotType) {
      continue;
    }

    // Check if all relevant parameters from the entry match the current plot state
    const paramsToCheck = { ...entry.params };
    delete paramsToCheck.rule; // Don't match against the rule itself

    let allParamsMatch = true;
    for (const key in paramsToCheck) {
      if (plotState[key] !== paramsToCheck[key]) {
        allParamsMatch = false;
        break;
      }
    }

    if (allParamsMatch && entry.params.rule) {
      rules.add(entry.params.rule);
    }
  }

  return rules;
} 