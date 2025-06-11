import React, { useMemo, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { SliderField } from './SliderField';
import { RuleSliderField } from './RuleSliderField';
import { parameterValues } from '@/data/plotMeta';
import { PlotState } from '@/types/PlotState';
import { logger } from '@/utils/logger';
import { getAvailableRules } from '@/utils/getAvailableRules';
import { PrevButton, NextButton } from './EmblaCarouselButtons';

const TWEEN_FACTOR = 4.2;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

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

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start', watchDrag: false });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

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
    <div className="bg-card rounded-lg border p-2 md:p-4 shadow-sm">
      <h3 className="font-semibold text-card-foreground mb-2 md:mb-4">Parameters</h3>
      <div className="md:hidden" data-testid="param-panel-mobile">
        <div className="flex items-center">
          <PrevButton
            aria-label="Previous parameter"
            data-testid="carousel-prev-button"
            onClick={scrollPrev}
          />
          <div className="overflow-hidden flex-1 mx-2" ref={emblaRef}>
            <div className="flex pointer-events-none">
              <div className="flex-[0_0_100%] min-w-0 px-2 pointer-events-auto">
                <SliderField
                  label="η_c (BSA Coupling Efficiency)"
                  value={plotState.eta_c}
                  values={parameterValues.eta_c}
                  onChange={(value) => onStateChange({ eta_c: value })}
                  disabled={!isActive('eta_c')}
                  decimalPlaces={1}
                />
              </div>
              <div className="flex-[0_0_100%] min-w-0 px-2 pointer-events-auto">
                <SliderField
                  label="ε_G (Gate Error Rate)"
                  value={plotState.epsilon_G}
                  values={parameterValues.epsilon_G}
                  onChange={(value) => onStateChange({ epsilon_G: value })}
                  disabled={!isActive('epsilon_G')}
                  step={0.001}
                />
              </div>
              <div className="flex-[0_0_100%] min-w-0 px-2 pointer-events-auto">
                <SliderField
                  label="N (Segment Count)"
                  value={plotState.N}
                  values={parameterValues.N}
                  onChange={(value) => onStateChange({ N: value })}
                  disabled={!isActive('N')}
                  isInteger
                />
              </div>
              <div className="flex-[0_0_100%] min-w-0 px-2 pointer-events-auto">
                <SliderField
                  label="M (Multiplexing Amount)"
                  value={plotState.M}
                  values={parameterValues.M}
                  onChange={(value) => onStateChange({ M: value })}
                  disabled={!isActive('M')}
                  isInteger
                />
              </div>
              <div className="flex-[0_0_100%] min-w-0 px-2 pointer-events-auto">
                <RuleSliderField
                  label="Rule"
                  value={plotState.rule}
                  options={parameterValues.rule}
                  onChange={(value) => onStateChange({ rule: value })}
                  disabled={!isActive('rule')}
                  availableOptions={availableRules}
                />
              </div>
            </div>
          </div>
          <NextButton
            aria-label="Next parameter"
            data-testid="carousel-next-button"
            onClick={scrollNext}
          />
        </div>
      </div>
      <div className="hidden md:block space-y-4 md:space-y-6" data-testid="param-panel-desktop">
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
        
        <RuleSliderField
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
