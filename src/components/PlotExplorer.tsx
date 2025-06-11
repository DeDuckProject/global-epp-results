import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { PlotTypeTabs } from './PlotTypeTabs';
import { ParamPanel } from './ParamPanel/ParamPanel';
import { PlotCanvas } from './PlotCanvas';
import { Footer } from './Footer';
import { plotTypes, parameterValues, dependencyMatrix } from '@/data/plotMeta';
import { useSearchParams } from 'react-router-dom';
import { PlotState } from '@/types/PlotState';

export const PlotExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [plotState, setPlotState] = useState<PlotState>(() => ({
    currentPlotType: searchParams.get('plot') || plotTypes[0],
    eta_c: Number(searchParams.get('eta_c')) || parameterValues.eta_c[2],
    epsilon_G: Number(searchParams.get('epsilon_G')) || parameterValues.epsilon_G[0],
    N: Number(searchParams.get('N')) || parameterValues.N[2],
    M: Number(searchParams.get('M')) || parameterValues.M[1],
    rule: searchParams.get('rule') || parameterValues.rule[0]
  }));

  // Update URL when state changes
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('plot', plotState.currentPlotType);
    params.set('eta_c', plotState.eta_c.toString());
    params.set('epsilon_G', plotState.epsilon_G.toString());
    params.set('N', plotState.N.toString());
    params.set('M', plotState.M.toString());
    params.set('rule', plotState.rule);
    setSearchParams(params);
  }, [plotState, setSearchParams]);

  const updatePlotState = (updates: Partial<PlotState>) => {
    setPlotState(prev => ({ ...prev, ...updates }));
  };

  const activeDependencies = dependencyMatrix[plotState.currentPlotType] || {
    eta_c: false,
    epsilon_G: false,
    N: false,
    M: false,
    rule: false
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      <Header />
      
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left sidebar - fixed width on desktop, full-width on mobile */}
        <div className="w-full md:w-80 md:min-w-80 bg-background/80 backdrop-blur-sm border-b md:border-b-0 md:border-r border-border p-2 md:p-4 space-y-2 md:space-y-4 overflow-y-auto">
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
