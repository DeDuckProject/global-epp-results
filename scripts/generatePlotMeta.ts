import * as fs from 'fs';
import * as path from 'path';
import * as prettier from 'prettier';
import glob from 'fast-glob';

// Types
export interface PlotParams {
  eta_c?: number;
  epsilon_G?: number;
  N?: number;
  M?: number;
  rule?: string;
}

export interface PlotMeta {
  plotType: string;
  params: PlotParams;
  relPath: string;
}

// Constants
const PLOTS_ROOT = 'comparison_plots';
const OUTPUT_FILE = 'src/data/plotMeta.ts';

// Plots to exclude
const EXCLUDED_PLOTS = ['distance_ratio', 'heatmap_dist'];

// Parameter values
type EtaC = 0.3 | 0.5 | 0.9 | 1.0;
type EpsilonG = 0.0001 | 0.001;
type N = 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;
type M = 512 | 1024 | 2048;
type Rule = "SKR" | "F_th 0.95" | "F_th 0.97" | "Manual";

export const PARAMETER_VALUES = {
  eta_c: [0.3, 0.5, 0.9, 1.0] as EtaC[],
  epsilon_G: [0.0001, 0.001] as EpsilonG[],
  N: [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096] as N[],
  M: [512, 1024, 2048] as M[],
  rule: ["SKR", "F_th 0.95", "F_th 0.97", "Manual"] as Rule[]
};

// Plot type mapping based on directory and filename patterns
// Order is preserved for UI display
const PLOT_TYPE_MAPPING: Record<string, string> = {
  '3d_visualization': '3D global-schedule',
  'best_strategies': 'Best strategies 2D',
  'skr_vs_fth': 'SKR vs F_th',
  'grid_plateau': 'Plateau grid',
  'threshold': 'Threshold heatmap',
  'max_distance': 'η_c comparisons',
  'consolidated_threshold': 'Threshold heatmap',
  'manual_advantage': 'η_c comparisons'
};

// Dependency matrix from requirements
export const DEPENDENCY_MATRIX: Record<string, Record<keyof PlotParams, boolean>> = {
  '3D global-schedule': { eta_c: true, epsilon_G: true, N: true, M: true, rule: true },
  'Best strategies 2D': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
  'SKR vs F_th': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
  'Plateau grid': { eta_c: false, epsilon_G: false, N: false, M: false, rule: false },
  'Threshold heatmap': { eta_c: false, epsilon_G: false, N: false, M: true, rule: false },
  'η_c comparisons': { eta_c: false, epsilon_G: true, N: true, M: true, rule: true } // TODO decide if to remove later (see task014.md)
};

export function parseEtaC(dirname: string): EtaC | undefined {
  const match = dirname.match(/^etac(\d+\.?\d*)$/);
  if (!match) return undefined;
  const value = parseFloat(match[1]);
  // Find the exact value in the allowed values
  return PARAMETER_VALUES.eta_c.find(v => Math.abs(v - value) < 1e-10);
}

export function parseEpsilonG(dirname: string): EpsilonG | undefined {
  const match = dirname.match(/^epsg(\d+\.?\d*)$/);
  if (!match) return undefined;
  const value = parseFloat(match[1]);
  // Find the exact value in the allowed values
  return PARAMETER_VALUES.epsilon_G.find(v => Math.abs(v - value) < 1e-10);
}

export function parseN(token: string): N | undefined {
  const match = token.match(/^N(\d+)$/);
  if (!match) return undefined;
  const value = parseInt(match[1], 10);
  // Find the exact value in the allowed values
  return PARAMETER_VALUES.N.find(v => v === value);
}

export function parseM(token: string): M | undefined {
  const match = token.match(/^M(\d+)$/);
  if (!match) return undefined;
  const value = parseInt(match[1], 10);
  // Find the exact value in the allowed values
  return PARAMETER_VALUES.M.find(v => v === value);
}

export function parseRule(token: string): Rule | undefined {
  if (token === 'SKR') return 'SKR';
  const match = token.match(/^F_th_(\d+\.\d+)$/);
  if (!match) return undefined;
  const value = `F_th ${match[1]}`;
  // Find the exact value in the allowed values
  return PARAMETER_VALUES.rule.find(v => v === value);
}

export function getPlotType(filename: string): string | undefined {
  for (const [key, value] of Object.entries(PLOT_TYPE_MAPPING)) {
    if (filename.includes(key)) return value;
  }
  return undefined;
}

export function parseFileMeta(filePath: string): PlotMeta {
  const relPath = filePath.replace(/\\/g, '/');
  const dirname = path.dirname(relPath).split('/')[1];
  const basename = path.basename(filePath, path.extname(filePath));
  const tokens = basename.split('_');
  
  const params: PlotParams = {};
  
  // Parse directory-based parameters
  if (dirname?.startsWith('etac')) {
    const [etacPart, epsgPart] = dirname.split('_');
    params.eta_c = parseEtaC(etacPart);
    params.epsilon_G = parseEpsilonG(epsgPart);
  }
  
  // Parse filename-based parameters
  tokens.forEach(token => {
    const n = parseN(token);
    const m = parseM(token);
    const rule = parseRule(token);
    
    if (n) params.N = n;
    if (m) params.M = m;
    if (rule) params.rule = rule;
  });
  
  const plotType = getPlotType(basename);
  if (!plotType) {
    throw new Error(`Could not determine plot type for file: ${filePath}`);
  }
  
  return { plotType, params, relPath };
}

async function generatePlotMeta() {
  try {
    // Find all plot files
    const files = await glob(`${PLOTS_ROOT}/**/*.{svg,png}`, { ignore: ['**/.DS_Store'] });
    
    // Filter out excluded plots
    const filteredFiles = files.filter(file => !EXCLUDED_PLOTS.some(excluded => file.includes(excluded)));
    
    // Parse metadata for each file
    const plotMeta: PlotMeta[] = [];
    
    for (const file of filteredFiles) {
      try {
        const meta = parseFileMeta(file);
        plotMeta.push(meta);
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
        process.exit(1);
      }
    }
    
    // Get unique plot types in the order they appear in PLOT_TYPE_MAPPING
    const uniquePlotTypes = Object.values(PLOT_TYPE_MAPPING)
      .filter((type, index, self) => self.indexOf(type) === index);
    
    // Generate TypeScript code
    const code = `// Auto-generated by generatePlotMeta.ts
// DO NOT EDIT DIRECTLY

export interface PlotParams {
  eta_c?: number;
  epsilon_G?: number;
  N?: number;
  M?: number;
  rule?: string;
}

export interface PlotMeta {
  plotType: string;
  params: PlotParams;
  relPath: string;
}

export const plotTypes = ${JSON.stringify(uniquePlotTypes, null, 2)};

export const plotMeta: PlotMeta[] = ${JSON.stringify(plotMeta, null, 2)};

export const parameterValues = ${JSON.stringify(PARAMETER_VALUES, null, 2)};

export const dependencyMatrix = ${JSON.stringify(DEPENDENCY_MATRIX, null, 2)};
`;
    
    // Format with prettier
    const formattedCode = await prettier.format(code, { parser: 'typescript' });
    
    // Ensure output directory exists
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(OUTPUT_FILE, formattedCode);
    console.log(`Successfully generated ${OUTPUT_FILE}`);
    
  } catch (err) {
    console.error('Error generating plot metadata:', err);
    process.exit(1);
  }
}

// Only run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePlotMeta();
}
