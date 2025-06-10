
import React from 'react';
import { SliderField } from './SliderField';
import { SelectField } from './SelectField';
import { parameterValues } from '@/data/plotMeta';
import { PlotState } from '@/components/PlotExplorer';

interface ParamPanelProps {
  plotState: PlotState;
  activeDependencies: string[];
  onStateChange: (updates: Partial<PlotState>) => void;
}

export const ParamPanel: React.FC<ParamPanelProps> = ({
  plotState,
  activeDependencies,
  onStateChange
}) => {
  const isActive = (param: string) => activeDependencies.includes(param);

  return (
    <div className="bg-card rounded-lg border p-4 shadow-sm">
      <h3 className="font-semibold text-card-foreground mb-4">Parameters</h3>
      <div className="space-y-6">
        <SliderField
          label="η_c (Channel Efficiency)"
          value={plotState.eta_c}
          values={parameterValues.eta_c}
          onChange={(value) => onStateChange({ eta_c: value })}
          disabled={!isActive('eta_c')}
        />
        
        <SliderField
          label="ε_G (Gate Error Rate)"
          value={plotState.epsilon_g}
          values={parameterValues.epsilon_g}
          onChange={(value) => onStateChange({ epsilon_g: value })}
          disabled={!isActive('epsilon_g')}
          step={0.001}
        />
        
        <SliderField
          label="N (Network Size)"
          value={plotState.n}
          values={parameterValues.n}
          onChange={(value) => onStateChange({ n: value })}
          disabled={!isActive('n')}
          isInteger
        />
        
        <SliderField
          label="M (Memory Time)"
          value={plotState.m}
          values={parameterValues.m}
          onChange={(value) => onStateChange({ m: value })}
          disabled={!isActive('m')}
          isInteger
        />
        
        <SelectField
          label="Rule"
          value={plotState.rule}
          options={parameterValues.rule}
          onChange={(value) => onStateChange({ rule: value })}
          disabled={!isActive('rule')}
        />
      </div>
    </div>
  );
};
