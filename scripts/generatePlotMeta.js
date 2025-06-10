"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEPENDENCY_MATRIX = exports.PLOT_TYPE_MAPPING = void 0;
exports.parseEtaC = parseEtaC;
exports.parseEpsilonG = parseEpsilonG;
exports.parseN = parseN;
exports.parseM = parseM;
exports.parseRule = parseRule;
exports.getPlotType = getPlotType;
exports.parseFileMeta = parseFileMeta;
var fs = require("fs");
var path = require("path");
var prettier = require("prettier");
var fast_glob_1 = require("fast-glob");
// Constants
var PLOTS_ROOT = 'comparison_plots';
var OUTPUT_FILE = 'src/data/plotMeta.ts';
// Plot type mapping based on directory and filename patterns
exports.PLOT_TYPE_MAPPING = {
    '3d_visualization': '3D global-schedule',
    'best_strategies': 'Best strategies 2D',
    'skr_vs_fth': 'SKR vs F_th',
    'distance_ratio': 'Distance-ratio',
    'heatmap_dist': 'Advantage heatmaps',
    'grid_plateau': 'Plateau grid',
    'threshold': 'Threshold heatmap',
    'max_distance': 'η_c comparisons',
    'consolidated_threshold': 'Threshold heatmap',
    'manual_advantage': 'η_c comparisons'
};
// Dependency matrix from requirements
exports.DEPENDENCY_MATRIX = {
    '3D global-schedule': { eta_c: true, epsilon_G: true, N: true, M: true, rule: true },
    'Best strategies 2D': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
    'SKR vs F_th': { eta_c: true, epsilon_G: true, N: true, M: true, rule: false },
    'Distance-ratio': { eta_c: false, epsilon_G: false, N: true, M: true, rule: false },
    'Advantage heatmaps': { eta_c: true, epsilon_G: true, N: false, M: false, rule: true },
    'Plateau grid': { eta_c: false, epsilon_G: false, N: false, M: false, rule: false },
    'Threshold heatmap': { eta_c: false, epsilon_G: false, N: false, M: true, rule: false },
    'η_c comparisons': { eta_c: false, epsilon_G: true, N: true, M: true, rule: true }
};
function parseEtaC(dirname) {
    var match = dirname.match(/^etac(\d+\.?\d*)$/);
    return match ? parseFloat(match[1]) : undefined;
}
function parseEpsilonG(dirname) {
    var match = dirname.match(/^epsg(\d+\.?\d*)$/);
    return match ? parseFloat(match[1]) : undefined;
}
function parseN(token) {
    var match = token.match(/^N(\d+)$/);
    return match ? parseInt(match[1], 10) : undefined;
}
function parseM(token) {
    var match = token.match(/^M(\d+)$/);
    return match ? parseInt(match[1], 10) : undefined;
}
function parseRule(token) {
    if (token === 'SKR')
        return token;
    var match = token.match(/^F_th_(\d+\.?\d*)$/);
    return match ? "F_th ".concat(match[1]) : undefined;
}
function getPlotType(filename) {
    for (var _i = 0, _a = Object.entries(exports.PLOT_TYPE_MAPPING); _i < _a.length; _i++) {
        var _b = _a[_i], key = _b[0], value = _b[1];
        if (filename.includes(key))
            return value;
    }
    return undefined;
}
function parseFileMeta(filePath) {
    var relPath = filePath.replace(/\\/g, '/');
    var dirname = path.dirname(relPath).split('/')[1];
    var basename = path.basename(filePath, path.extname(filePath));
    var tokens = basename.split('_');
    var params = {};
    // Parse directory-based parameters
    if (dirname === null || dirname === void 0 ? void 0 : dirname.startsWith('etac')) {
        var _a = dirname.split('_'), etacPart = _a[0], epsgPart = _a[1];
        params.eta_c = parseEtaC(etacPart);
        params.epsilon_G = parseEpsilonG(epsgPart);
    }
    // Parse filename-based parameters
    tokens.forEach(function (token) {
        var n = parseN(token);
        var m = parseM(token);
        var rule = parseRule(token);
        if (n)
            params.N = n;
        if (m)
            params.M = m;
        if (rule)
            params.rule = rule;
    });
    var plotType = getPlotType(basename);
    if (!plotType) {
        throw new Error("Could not determine plot type for file: ".concat(filePath));
    }
    return { plotType: plotType, params: params, relPath: relPath };
}
function generatePlotMeta() {
    return __awaiter(this, void 0, void 0, function () {
        var files, plotMeta, uniqueParams_1, _i, files_1, file, meta, code, formattedCode, outDir, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, (0, fast_glob_1.default)("".concat(PLOTS_ROOT, "/**/*.{svg,png}"), { ignore: ['**/.DS_Store'] })];
                case 1:
                    files = _a.sent();
                    plotMeta = [];
                    uniqueParams_1 = {
                        eta_c: new Set(),
                        epsilon_G: new Set(),
                        N: new Set(),
                        M: new Set(),
                        rule: new Set()
                    };
                    for (_i = 0, files_1 = files; _i < files_1.length; _i++) {
                        file = files_1[_i];
                        try {
                            meta = parseFileMeta(file);
                            plotMeta.push(meta);
                            // Collect unique parameter values
                            Object.entries(meta.params).forEach(function (_a) {
                                var key = _a[0], value = _a[1];
                                if (value !== undefined) {
                                    uniqueParams_1[key].add(value);
                                }
                            });
                        }
                        catch (err) {
                            console.error("Error processing file ".concat(file, ":"), err);
                            process.exit(1);
                        }
                    }
                    code = "// Auto-generated by generatePlotMeta.ts\n// DO NOT EDIT DIRECTLY\n\nexport interface PlotParams {\n  eta_c?: number;\n  epsilon_G?: number;\n  N?: number;\n  M?: number;\n  rule?: string;\n}\n\nexport interface PlotMeta {\n  plotType: string;\n  params: PlotParams;\n  relPath: string;\n}\n\nexport const plotMeta: PlotMeta[] = ".concat(JSON.stringify(plotMeta, null, 2), ";\n\nexport const etaCValues = ").concat(JSON.stringify(Array.from(uniqueParams_1.eta_c).sort(function (a, b) { return Number(a) - Number(b); })), ";\nexport const epsilonGValues = ").concat(JSON.stringify(Array.from(uniqueParams_1.epsilon_G).sort(function (a, b) { return Number(a) - Number(b); })), ";\nexport const NValues = ").concat(JSON.stringify(Array.from(uniqueParams_1.N).sort(function (a, b) { return Number(a) - Number(b); })), ";\nexport const MValues = ").concat(JSON.stringify(Array.from(uniqueParams_1.M).sort(function (a, b) { return Number(a) - Number(b); })), ";\nexport const ruleValues = ").concat(JSON.stringify(Array.from(uniqueParams_1.rule)), ";\n\nexport const dependencyMatrix = ").concat(JSON.stringify(exports.DEPENDENCY_MATRIX, null, 2), ";\n");
                    return [4 /*yield*/, prettier.format(code, { parser: 'typescript' })];
                case 2:
                    formattedCode = _a.sent();
                    outDir = path.dirname(OUTPUT_FILE);
                    if (!fs.existsSync(outDir)) {
                        fs.mkdirSync(outDir, { recursive: true });
                    }
                    // Write the file
                    fs.writeFileSync(OUTPUT_FILE, formattedCode);
                    console.log("Successfully generated ".concat(OUTPUT_FILE));
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error('Error generating plot metadata:', err_1);
                    process.exit(1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Only run if this is the main module
if (import.meta.url === "file://".concat(process.argv[1])) {
    generatePlotMeta();
}
