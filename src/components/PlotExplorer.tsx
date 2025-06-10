
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { PlotTypeTabs } from './PlotTypeTabs';
import { ParamPanel } from './ParamPanel/ParamPanel';
import { PlotCanvas } from './PlotCanvas';
import { Footer } from './Footer';
import { plotTypes, parameterValues, dependencyMatrix } from '@/data/plotMeta';
import { useSearchParams } from 'react-router-dom';

export interface PlotState {
  currentPlotType: string;
  eta_c: number;
  epsilon_g: number;
  n: number;
  m: number;
  rule: string;
}

export const PlotExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [plotState, setPlotState] = useState<PlotState>(() => ({
    currentPlotType: searchParams.get('plot') || plotTypes[0],
    eta_c: Number(searchParams.get('eta_c')) || parameterValues.eta_c[2],
    epsilon_g: Number(searchParams.get('epsilon_g')) || parameterValues.epsilon_g[0],
    n: Number(searchParams.get('n')) || parameterValues.n[2],
    m: Number(searchParams.get('m')) || parameterValues.m[1],
    rule: searchParams.get('rule') || parameterValues.rule[0]
  }));

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('plot', plotState.currentPlotType);
    params.set('eta_c', plotState.eta_c.toString());
    params.set('epsilon_g', plotState.epsilon_g.toString());
    params.set('n', plotState.n.toString());
    params.set('m', plotState.m.toString());
    params.set('rule', plotState.rule);
    setSearchParams(params);
  }, [plotState, setSearchParams]);

  const updatePlotState = (updates: Partial<PlotState>) => {
    setPlotState(prev => ({ ...prev, ...updates }));
  };

  const activeDependencies = dependencyMatrix[plotState.currentPlotType] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <Header />
      
      <div className="flex-1 flex">
        {/* Left sidebar - fixed width */}
        <div className="w-80 min-w-80 bg-background/80 backdrop-blur-sm border-r border-border p-4 space-y-4 overflow-y-auto">
          <PlotTypeTabs 
            plotTypes={plotTypes}
            currentPlotType={plotState.currentPlotType}
            onPlotTypeChange={(plotType) => updatePlotState({ currentPlotType: plotType })}
          />
          
          <ParamPanel 
            plotState={plotState}
            activeDependencies={activeDependencies}
            onStateChange={updatePlotState}
          />
        </div>
        
        {/* Main content - takes remaining space */}
        <div className="flex-1 p-4">
          <PlotCanvas plotState={plotState} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};
