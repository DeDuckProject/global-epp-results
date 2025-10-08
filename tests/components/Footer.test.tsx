import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Footer } from '@/components/Footer';

describe('Footer', () => {
  it('shows paper citation placeholder', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Citation: Quantum Repeater Protocols \(2025\) — paper DOI TBD/i)
    ).toBeInTheDocument();
  });

  it('links to the project DOI on Zenodo', () => {
    render(<Footer />);
    const doiLink = screen.getByRole('link', { name: /Project DOI: 10\.5281\/zenodo\.17292576/i });
    expect(doiLink).toBeInTheDocument();
    expect(doiLink).toHaveAttribute('href', 'https://doi.org/10.5281/zenodo.17292576');
  });

  it('links to the GitHub repository', () => {
    render(<Footer />);
    const ghLink = screen.getByRole('link', { name: /GitHub/i });
    expect(ghLink).toBeInTheDocument();
    expect(ghLink).toHaveAttribute('href', 'https://github.com/DeDuckProject/global-epp-results');
  });
});


