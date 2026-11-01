import { cn } from "@/lib/utils";

interface LessonVisualProps {
  slug: string;
  className?: string;
}

export function LessonVisual({ slug, className }: LessonVisualProps) {
  switch (slug) {
    case "ensemble-learning":
      return (
        <div className={cn("surface relative overflow-hidden p-6", className)}>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>ensemble_consensus.svg</span>
            <span className="text-primary">Wisdom of Crowds</span>
          </div>
          <svg viewBox="0 0 600 240" className="w-full h-auto bg-grid rounded-xl">
            {/* Input sample */}
            <rect x="30" y="90" width="90" height="60" rx="8" fill="var(--secondary)" stroke="var(--border)" />
            <text x="75" y="118" textAnchor="middle" fill="var(--foreground)" fontSize="12" fontWeight="600">Sample X</text>
            <text x="75" y="136" textAnchor="middle" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">True: Class A</text>

            {/* Arrows to models */}
            <path d="M 120 110 L 200 45" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <path d="M 120 120 L 200 120" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
            <path d="M 120 130 L 200 195" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />

            {/* Estimators */}
            <g transform="translate(200, 20)">
              <rect width="130" height="50" rx="8" fill="var(--card)" stroke="var(--border)" />
              <text x="65" y="24" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="500">Model 1 (Tree)</text>
              <text x="65" y="40" textAnchor="middle" fill="var(--success)" fontSize="10" fontFamily="var(--font-mono)">Votes: Class A (✓)</text>
            </g>
            <g transform="translate(200, 95)">
              <rect width="130" height="50" rx="8" fill="var(--card)" stroke="var(--border)" />
              <text x="65" y="24" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="500">Model 2 (Tree)</text>
              <text x="65" y="40" textAnchor="middle" fill="var(--destructive)" fontSize="10" fontFamily="var(--font-mono)">Votes: Class B (✗)</text>
            </g>
            <g transform="translate(200, 170)">
              <rect width="130" height="50" rx="8" fill="var(--card)" stroke="var(--border)" />
              <text x="65" y="24" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="500">Model 3 (Tree)</text>
              <text x="65" y="40" textAnchor="middle" fill="var(--success)" fontSize="10" fontFamily="var(--font-mono)">Votes: Class A (✓)</text>
            </g>

            {/* Arrows to Aggregator */}
            <path d="M 330 45 L 400 110" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            <path d="M 330 120 L 400 120" stroke="var(--accent)" strokeWidth="1.5" fill="none" />
            <path d="M 330 195 L 400 130" stroke="var(--accent)" strokeWidth="1.5" fill="none" />

            {/* Voting Box */}
            <rect x="400" y="85" width="80" height="70" rx="8" fill="var(--secondary)" stroke="var(--primary)" />
            <text x="440" y="112" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="600">Majority</text>
            <text x="440" y="128" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="600">Voting</text>
            <text x="440" y="144" textAnchor="middle" fill="var(--primary)" fontSize="9" fontFamily="var(--font-mono)">2 vs 1</text>

            {/* Arrow to result */}
            <path d="M 480 120 L 520 120" stroke="var(--accent)" strokeWidth="2" fill="none" />

            {/* Final Output */}
            <rect x="520" y="95" width="70" height="50" rx="8" fill="color-mix(in oklab, var(--success) 20%, transparent)" stroke="var(--success)" />
            <text x="555" y="120" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="bold">Class A</text>
            <text x="555" y="136" textAnchor="middle" fill="var(--success)" fontSize="9">Correct</text>
          </svg>
        </div>
      );

    case "decision-trees":
      return (
        <div className={cn("surface relative overflow-hidden p-6", className)}>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>cart_binary_split.svg</span>
            <span className="text-primary">Recursive Binary Partition</span>
          </div>
          <svg viewBox="0 0 600 250" className="w-full h-auto bg-grid rounded-xl">
            {/* Root node */}
            <rect x="230" y="15" width="140" height="48" rx="8" fill="var(--secondary)" stroke="var(--primary)" strokeWidth="1.5" />
            <text x="300" y="36" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="600">Feature X₁ ≤ 2.5?</text>
            <text x="300" y="52" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9" fontFamily="var(--font-mono)">Gini = 0.500 | N = 100</text>

            {/* Branches */}
            <path d="M 270 63 L 160 105" stroke="var(--border)" strokeWidth="1.5" fill="none" />
            <text x="200" y="80" fill="var(--accent)" fontSize="10" fontFamily="var(--font-mono)">Yes</text>
            <path d="M 330 63 L 440 105" stroke="var(--border)" strokeWidth="1.5" fill="none" />
            <text x="390" y="80" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">No</text>

            {/* Left Leaf (Pure) */}
            <rect x="90" y="105" width="140" height="48" rx="8" fill="color-mix(in oklab, var(--success) 15%, transparent)" stroke="var(--success)" />
            <text x="160" y="126" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="600">Leaf 1: Class 0</text>
            <text x="160" y="142" textAnchor="middle" fill="var(--success)" fontSize="9" fontFamily="var(--font-mono)">Gini = 0.000 | N = 40 (Pure)</text>

            {/* Right Node (Split further) */}
            <rect x="370" y="105" width="140" height="48" rx="8" fill="var(--secondary)" stroke="var(--border)" />
            <text x="440" y="126" textAnchor="middle" fill="var(--foreground)" fontSize="11" fontWeight="600">Feature X₂ ≤ 4.8?</text>
            <text x="440" y="142" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9" fontFamily="var(--font-mono)">Gini = 0.375 | N = 60</text>

            {/* Sub-branches */}
            <path d="M 405 153 L 340 195" stroke="var(--border)" strokeWidth="1.5" fill="none" />
            <text x="365" y="175" fill="var(--accent)" fontSize="10" fontFamily="var(--font-mono)">Yes</text>
            <path d="M 475 153 L 530 195" stroke="var(--border)" strokeWidth="1.5" fill="none" />
            <text x="510" y="175" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">No</text>

            {/* Leaves */}
            <rect x="270" y="195" width="130" height="44" rx="8" fill="var(--card)" stroke="var(--border)" />
            <text x="335" y="214" textAnchor="middle" fill="var(--foreground)" fontSize="10" fontWeight="600">Leaf 2: Class 1</text>
            <text x="335" y="229" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="var(--font-mono)">Gini = 0.095 | N = 38</text>

            <rect x="465" y="195" width="130" height="44" rx="8" fill="var(--card)" stroke="var(--border)" />
            <text x="530" y="214" textAnchor="middle" fill="var(--foreground)" fontSize="10" fontWeight="600">Leaf 3: Class 0</text>
            <text x="530" y="229" textAnchor="middle" fill="var(--muted-foreground)" fontSize="8" fontFamily="var(--font-mono)">Gini = 0.165 | N = 22</text>
          </svg>
        </div>
      );

    case "bootstrap-sampling":
      return (
        <div className={cn("surface relative overflow-hidden p-6", className)}>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>bootstrap_sampling_mechanism.svg</span>
            <span className="text-primary">With Replacement (N = 6)</span>
          </div>
          <svg viewBox="0 0 600 230" className="w-full h-auto bg-grid rounded-xl">
            {/* Original Dataset */}
            <text x="30" y="30" fill="var(--muted-foreground)" fontSize="11" fontWeight="600">Original Training Set (N = 6):</text>
            {[1, 2, 3, 4, 5, 6].map((num, i) => (
              <g key={num} transform={`translate(${30 + i * 55}, 45)`}>
                <rect width="45" height="45" rx="8" fill="var(--secondary)" stroke="var(--border)" />
                <text x="22" y="28" textAnchor="middle" fill="var(--foreground)" fontSize="14" fontWeight="600">d{num}</text>
              </g>
            ))}

            {/* Arrows */}
            <path d="M 180 100 L 140 135" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 200 100 L 300 135" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Bootstrap sample */}
            <text x="30" y="130" fill="var(--accent)" fontSize="11" fontWeight="600">Bootstrap Sample (~63.2% unique):</text>
            {[1, 2, 2, 4, 5, 5].map((num, i) => (
              <g key={i} transform={`translate(${30 + i * 55}, 145)`}>
                <rect width="45" height="45" rx="8" fill="color-mix(in oklab, var(--primary) 15%, transparent)" stroke="var(--primary)" />
                <text x="22" y="28" textAnchor="middle" fill="var(--foreground)" fontSize="14" fontWeight="600">d{num}</text>
                {(i === 2 || i === 5) && (
                  <circle cx="36" cy="12" r="5" fill="var(--warning)" />
                )}
              </g>
            ))}

            {/* OOB Box */}
            <g transform="translate(400, 115)">
              <rect width="170" height="85" rx="10" fill="color-mix(in oklab, var(--warning) 10%, transparent)" stroke="var(--warning)" strokeDasharray="4 4" />
              <text x="85" y="24" textAnchor="middle" fill="var(--warning)" fontSize="11" fontWeight="bold">Out-of-Bag (OOB) Set</text>
              <text x="85" y="42" textAnchor="middle" fill="var(--foreground)" fontSize="13" fontWeight="600">d3, d6 (33.3%)</text>
              <text x="85" y="65" textAnchor="middle" fill="var(--muted-foreground)" fontSize="9">Used for validation without test data</text>
            </g>
          </svg>
        </div>
      );

    case "bias-variance":
      return (
        <div className={cn("surface relative overflow-hidden p-6", className)}>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>bias_variance_decomposition.svg</span>
            <span className="text-primary">Error Curves vs Model Complexity</span>
          </div>
          <svg viewBox="0 0 600 240" className="w-full h-auto bg-grid rounded-xl">
            {/* Axes */}
            <line x1="60" y1="200" x2="550" y2="200" stroke="var(--border)" strokeWidth="1.5" />
            <line x1="60" y1="30" x2="60" y2="200" stroke="var(--border)" strokeWidth="1.5" />
            <text x="300" y="225" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11">Tree Depth / Model Capacity →</text>
            <text x="25" y="110" textAnchor="middle" fill="var(--muted-foreground)" fontSize="11" transform="rotate(-90 25 110)">Expected Error</text>

            {/* Curves */}
            {/* Bias squared (decreasing) */}
            <path d="M 70 50 Q 180 150 540 185" fill="none" stroke="var(--accent)" strokeWidth="2.5" />
            <text x="480" y="175" fill="var(--accent)" fontSize="11" fontWeight="600">Bias²</text>

            {/* Variance (increasing) */}
            <path d="M 70 190 Q 300 170 540 50" fill="none" stroke="var(--destructive)" strokeWidth="2.5" />
            <text x="470" y="60" fill="var(--destructive)" fontSize="11" fontWeight="600">Variance</text>

            {/* Irreducible noise floor */}
            <line x1="60" y1="185" x2="550" y2="185" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 3" />
            <text x="130" y="180" fill="var(--muted-foreground)" fontSize="9">Irreducible Noise σ²</text>

            {/* Total Error U curve */}
            <path d="M 70 70 Q 260 145 540 70" fill="none" stroke="var(--primary)" strokeWidth="3" />
            <text x="300" y="105" textAnchor="middle" fill="var(--primary)" fontSize="12" fontWeight="bold">Total Error (Single Tree)</text>

            {/* RF Ensemble Variance reduction line */}
            <path d="M 70 70 Q 260 135 540 120" fill="none" stroke="var(--success)" strokeWidth="2.5" strokeDasharray="5 3" />
            <text x="420" y="125" fill="var(--success)" fontSize="10" fontWeight="bold">Random Forest Total Error (Variance Reduced!)</text>

            {/* Optimal sweet spot */}
            <circle cx="260" cy="115" r="4" fill="var(--primary)" />
            <line x1="260" y1="115" x2="260" y2="200" stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" />
            <text x="260" y="215" textAnchor="middle" fill="var(--primary)" fontSize="9">Optimal Complexity</text>
          </svg>
        </div>
      );

    case "feature-importance":
      return (
        <div className={cn("surface relative overflow-hidden p-6", className)}>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>feature_importance_comparison.svg</span>
            <span className="text-primary">MDI vs Permutation Importance</span>
          </div>
          <svg viewBox="0 0 600 230" className="w-full h-auto bg-grid rounded-xl">
            {/* Legend */}
            <rect x="360" y="20" width="12" height="12" fill="var(--primary)" rx="2" />
            <text x="380" y="30" fill="var(--foreground)" fontSize="10">Mean Decrease Impurity (MDI)</text>
            <rect x="360" y="40" width="12" height="12" fill="var(--accent)" rx="2" />
            <text x="380" y="50" fill="var(--foreground)" fontSize="10">Permutation Importance</text>

            {/* Features */}
            {[
              { name: "Worst Perimeter", mdi: 240, perm: 220 },
              { name: "Worst Concave Points", mdi: 210, perm: 200 },
              { name: "Worst Radius", mdi: 180, perm: 175 },
              { name: "Mean Concave Points", mdi: 140, perm: 130 },
              { name: "High-Cardinality Noise", mdi: 110, perm: 10 },
            ].map((f, i) => (
              <g key={f.name} transform={`translate(20, ${60 + i * 32})`}>
                <text x="150" y="14" textAnchor="end" fill="var(--foreground)" fontSize="11">{f.name}</text>
                {/* MDI bar */}
                <rect x="165" y="2" width={f.mdi} height="10" rx="3" fill="var(--primary)" />
                {/* Perm bar */}
                <rect x="165" y="14" width={f.perm} height="10" rx="3" fill="var(--accent)" />
                {i === 4 && (
                  <text x={175 + f.mdi} y="10" fill="var(--warning)" fontSize="9" fontWeight="600">← MDI Cardin. Bias!</text>
                )}
              </g>
            ))}
          </svg>
        </div>
      );

    case "imbalanced-data":
    case "class-weighting":
    case "smote":
      return (
        <div className={cn("surface relative overflow-hidden p-6", className)}>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>smote_and_borderline_interpolation.svg</span>
            <span className="text-primary">SMOTE & Borderline Boundary Partition</span>
          </div>
          <svg viewBox="0 0 600 260" className="w-full h-auto bg-grid rounded-xl">
            {/* Background Zones for Borderline-SMOTE */}
            <rect x="20" y="20" width="220" height="220" rx="12" fill="color-mix(in oklab, var(--destructive) 8%, transparent)" stroke="var(--destructive)" strokeDasharray="3 3" />
            <text x="35" y="42" fill="var(--destructive)" fontSize="10" fontWeight="bold">Majority Territory (Class 0: 95%)</text>

            <rect x="250" y="20" width="160" height="220" rx="12" fill="color-mix(in oklab, var(--warning) 10%, transparent)" stroke="var(--warning)" strokeDasharray="3 3" />
            <text x="260" y="42" fill="var(--warning)" fontSize="10" fontWeight="bold">DANGER Zone (Borderline)</text>
            <text x="260" y="56" fill="var(--muted-foreground)" fontSize="8">SMOTE synthesizes here</text>

            <rect x="420" y="20" width="160" height="220" rx="12" fill="color-mix(in oklab, var(--success) 8%, transparent)" stroke="var(--success)" strokeDasharray="3 3" />
            <text x="435" y="42" fill="var(--success)" fontSize="10" fontWeight="bold">SAFE Zone (Minority Core)</text>

            {/* Majority Samples (Class 0) */}
            {[
              [50, 70], [90, 110], [60, 150], [130, 80], [110, 180], [170, 130],
              [70, 210], [140, 220], [190, 70], [210, 170], [270, 80], [260, 190],
              [290, 130]
            ].map(([cx, cy], i) => (
              <circle key={`maj-${i}`} cx={cx} cy={cy} r="5" fill="var(--muted-foreground)" opacity="0.6" />
            ))}

            {/* Safe Minority Samples */}
            {[
              [460, 80], [490, 120], [530, 90], [470, 170], [520, 180], [550, 140]
            ].map(([cx, cy], i) => (
              <circle key={`safe-${i}`} cx={cx} cy={cy} r="6" fill="var(--accent)" />
            ))}

            {/* Danger Minority Samples with SMOTE Interpolation */}
            {/* Seed minority sample x_i */}
            <circle cx="310" cy="170" r="7" fill="var(--primary)" stroke="var(--foreground)" strokeWidth="1.5" />
            <text x="310" y="195" textAnchor="middle" fill="var(--foreground)" fontSize="10" fontWeight="bold">x_i (Seed)</text>

            {/* Nearest Neighbor minority sample x_zi */}
            <circle cx="360" cy="95" r="7" fill="var(--primary)" stroke="var(--foreground)" strokeWidth="1.5" />
            <text x="360" y="85" textAnchor="middle" fill="var(--foreground)" fontSize="10" fontWeight="bold">x_zi (k-NN)</text>

            {/* Interpolation Vector Segment */}
            <line x1="310" y1="170" x2="360" y2="95" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 3" />

            {/* Synthetic Sample x_new = x_i + λ*(x_zi - x_i) with λ = 0.55 */}
            <g transform="translate(337.5, 128.75)">
              <circle cx="0" cy="0" r="10" fill="color-mix(in oklab, var(--success) 35%, transparent)" stroke="var(--success)" strokeWidth="2" />
              <circle cx="0" cy="0" r="5" fill="var(--success)" />
              <text x="14" y="4" fill="var(--success)" fontSize="10" fontWeight="bold">x_new (λ = 0.55)</text>
            </g>

            {/* Mathematical annotation callout */}
            <g transform="translate(190, 205)">
              <rect width="220" height="36" rx="6" fill="var(--card)" stroke="var(--border)" />
              <text x="110" y="16" textAnchor="middle" fill="var(--foreground)" fontSize="9" fontWeight="600">x_new = x_i + λ · (x_zi - x_i)</text>
              <text x="110" y="28" textAnchor="middle" fill="var(--accent)" fontSize="8" fontFamily="var(--font-mono)">Linear convex segment interpolation</text>
            </g>

            {/* Isolated Noise minority sample */}
            <circle cx="80" cy="90" r="5" fill="var(--destructive)" stroke="var(--destructive)" />
            <text x="80" y="78" textAnchor="middle" fill="var(--destructive)" fontSize="8">NOISE (Pruned by Tomek/ENN)</text>
          </svg>
        </div>
      );

    default:
      return (
        <div className={cn("surface relative overflow-hidden p-6", className)}>
          <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground font-mono">
            <span>random_forest_concept.svg</span>
            <span className="text-primary">Ensemble Architecture</span>
          </div>
          <svg viewBox="0 0 600 200" className="w-full h-auto bg-grid rounded-xl">
            <g transform="translate(40, 70)">
              <rect width="110" height="60" rx="8" fill="var(--secondary)" stroke="var(--border)" />
              <text x="55" y="28" textAnchor="middle" fill="var(--foreground)" fontSize="12" fontWeight="600">Dataset</text>
              <text x="55" y="46" textAnchor="middle" fill="var(--muted-foreground)" fontSize="10" fontFamily="var(--font-mono)">N × p Matrix</text>
            </g>
            <path d="M 150 100 L 220 50" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 150 100 L 220 100" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M 150 100 L 220 150" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3 3" />
            <g transform="translate(220, 25)">
              <rect width="130" height="45" rx="6" fill="var(--card)" stroke="var(--primary)" />
              <text x="65" y="26" textAnchor="middle" fill="var(--foreground)" fontSize="11">Tree 1 (Bootstrap 1)</text>
            </g>
            <g transform="translate(220, 78)">
              <rect width="130" height="45" rx="6" fill="var(--card)" stroke="var(--primary)" />
              <text x="65" y="26" textAnchor="middle" fill="var(--foreground)" fontSize="11">Tree 2 (Bootstrap 2)</text>
            </g>
            <g transform="translate(220, 130)">
              <rect width="130" height="45" rx="6" fill="var(--card)" stroke="var(--primary)" />
              <text x="65" y="26" textAnchor="middle" fill="var(--foreground)" fontSize="11">Tree B (Bootstrap B)</text>
            </g>
            <path d="M 350 50 L 420 95" stroke="var(--accent)" strokeWidth="1.5" />
            <path d="M 350 100 L 420 100" stroke="var(--accent)" strokeWidth="1.5" />
            <path d="M 350 150 L 420 105" stroke="var(--accent)" strokeWidth="1.5" />
            <g transform="translate(420, 75)">
              <rect width="140" height="50" rx="8" fill="color-mix(in oklab, var(--primary) 15%, transparent)" stroke="var(--primary)" />
              <text x="70" y="25" textAnchor="middle" fill="var(--foreground)" fontSize="12" fontWeight="600">Aggregation</text>
              <text x="70" y="42" textAnchor="middle" fill="var(--accent)" fontSize="10" fontFamily="var(--font-mono)">Vote · Mean</text>
            </g>
          </svg>
        </div>
      );
  }
}
