
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Quantum Repeater Protocol Simulation Results
          </p>
          <div className="flex justify-center items-center space-x-4 text-xs text-muted-foreground">
            <span>Citation: Quantum Repeater Protocols (2025) — paper DOI TBD</span>
            <span>•</span>
            <a
              href="https://doi.org/10.5281/zenodo.17292576"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Project DOI: 10.5281/zenodo.17292576
            </a>
            <span>•</span>
            <a
              href="https://github.com/DeDuckProject/global-epp-results"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
