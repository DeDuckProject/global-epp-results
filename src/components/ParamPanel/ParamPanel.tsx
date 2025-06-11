import React, { useMemo } from 'react';
import { SliderField } from './SliderField';
import { SelectField } from './SelectField';
import { parameterValues } from '@/data/plotMeta';
import { PlotState } from '@/types/PlotState';
import { logger } from '@/utils/logger';
import { getAvailableRules } from '@/utils/getAvailableRules';

interface ParamPanelProps {
  plotState: PlotState;
  activeDependencies: Record<string, boolean>;
  onStateChange: (updates: Partial<PlotState>) => void;
}

export const ParamPanel: React.FC<ParamPanelProps> = ({
  plotState,
  activeDependencies,
  onStateChange
}) => {
  const isActive = (param: string) => activeDependencies[param] ?? false;

  const availableRules = useMemo(() => {
    if (!isActive('rule')) return undefined;
    
    const { rule, ...otherParams } = plotState;
    return getAvailableRules(otherParams);
  }, [plotState, activeDependencies]);

  // If the current rule is not in the set of available rules, log a warning
  // and pick the first available rule as the new state.
  useMemo(() => {
    if (availableRules && !availableRules.has(plotState.rule) && availableRules.size > 0) {
      const newRule = availableRules.values().next().value;
      logger.warn(
        `Selected rule "${plotState.rule}" is not available with current parameters. ` +
        `Switching to "${newRule}".`
      );
      onStateChange({ rule: newRule });
    }
  }, [plotState.rule, availableRules, onStateChange]);

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="font-semibold text-card-foreground mb-4">Parameters</h3>
      <div className="space-y-6">
        <SliderField
          label="η_c (BSA Coupling Efficiency)"
          value={plotState.eta_c}
          values={parameterValues.eta_c}
          onChange={(value) => onStateChange({ eta_c: value })}
          disabled={!isActive('eta_c')}
          decimalPlaces={1}
        />
        
        <SliderField
          label="ε_G (Gate Error Rate)"
          value={plotState.epsilon_G}
          values={parameterValues.epsilon_G}
          onChange={(value) => onStateChange({ epsilon_G: value })}
          disabled={!isActive('epsilon_G')}
          step={0.001}
        />
        
        <SliderField
          label="N (Segment Count)"
          value={plotState.N}
          values={parameterValues.N}
          onChange={(value) => onStateChange({ N: value })}
          disabled={!isActive('N')}
          isInteger
        />
        
        <SliderField
          label="M (Multiplexing Amount)"
          value={plotState.M}
          values={parameterValues.M}
          onChange={(value) => onStateChange({ M: value })}
          disabled={!isActive('M')}
          isInteger
        />
        
        <SelectField
          label="Rule"
          value={plotState.rule}
          options={parameterValues.rule}
          onChange={(value) => onStateChange({ rule: value })}
          disabled={!isActive('rule')}
          availableOptions={availableRules}
        />
      </div>
    </div>
  );
};
