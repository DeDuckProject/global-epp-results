
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
            Repeater-Protocol Simulation Explorer
          </h1>
          <p className="text-muted-foreground text-lg">
            Interactive visualization of quantum repeater protocol simulation results
          </p>
        </div>
      </div>
    </header>
  );
};
