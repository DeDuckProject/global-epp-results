import { PlotState } from '@/types/PlotState';
import { plotMeta } from '@/data/plotMeta';

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
    const params = entry.params;
    let allParamsMatch = true;

    if (params.eta_c !== undefined && params.eta_c !== plotState.eta_c) {
      allParamsMatch = false;
    }
    if (params.epsilon_G !== undefined && params.epsilon_G !== plotState.epsilon_G) {
      allParamsMatch = false;
    }
    if (params.N !== undefined && params.N !== plotState.N) {
      allParamsMatch = false;
    }
    if (params.M !== undefined && params.M !== plotState.M) {
      allParamsMatch = false;
    }

    if (allParamsMatch && entry.params.rule) {
      rules.add(entry.params.rule);
    }
  }

  return rules;
} 