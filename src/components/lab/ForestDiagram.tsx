/** Static architecture diagram: dataset → bootstrap → trees → aggregation → prediction. */
function Tree({ x, y, variant }: { x: number; y: number; variant: number }) {
  const leaves: number[][] = ([
    [[-24, 40], [24, 40]],
    [[-28, 40], [0, 40], [28, 40]],
    [[-20, 40], [20, 40]],
  ] as number[][][])[variant]!;
  const mid = leaves[1]![0]!;
  return (
    <g transform={`translate(${x} ${y})`}>
      {leaves.map(([lx = 0, ly = 0], i) => (
        <line key={i} x1={0} y1={8} x2={lx} y2={ly - 8} stroke="var(--border)" strokeWidth="1.5" />
      ))}
      {variant !== 1 && (
        <>
          <line x1={mid} y1={40} x2={mid - 12} y2={66} stroke="var(--border)" strokeWidth="1.5" />
          <line x1={mid} y1={40} x2={mid + 12} y2={66} stroke="var(--border)" strokeWidth="1.5" />
          <circle cx={mid - 12} cy={70} r={4} fill="var(--accent)" />
          <circle cx={mid + 12} cy={70} r={4} fill="var(--primary)" />
        </>
      )}
      <rect x={-10} y={-4} width={20} height={14} rx={3} fill="var(--card)" stroke="var(--primary)" />
      {leaves.map(([lx = 0, ly = 0], i) => (
        <circle key={i} cx={lx} cy={ly} r={6} fill="var(--card)" stroke={i % 2 ? "var(--accent)" : "var(--primary)"} strokeWidth="1.5" />
      ))}
    </g>
  );
}

function Node({ x, y, w, label, sub }: { x: number; y: number; w: number; label: string; sub?: string }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 18} width={w} height={36} rx={8} fill="var(--secondary)" stroke="var(--border)" />
      <text x={x} y={sub ? y - 2 : y + 4} textAnchor="middle" fontSize="12" fill="var(--foreground)" fontFamily="var(--font-sans)" fontWeight={500}>{label}</text>
      {sub && <text x={x} y={y + 11} textAnchor="middle" fontSize="9" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">{sub}</text>}
    </g>
  );
}

export function ForestDiagram() {
  const cols = [80, 200, 320];
  return (
    <div className="surface relative overflow-hidden p-4">
      <div className="mb-2 flex items-center justify-between px-1 font-mono text-[10px] text-muted-foreground">
        <span>rf_architecture.svg</span>
        <span className="text-primary">B = 3 TREES</span>
      </div>
      <svg viewBox="0 0 400 470" className="h-auto w-full bg-grid rounded-lg" role="img" aria-label="Random Forest architecture diagram">
        <Node x={200} y={34} w={150} label="Input Dataset" sub="n × p" />
        <line x1={200} y1={52} x2={200} y2={82} stroke="var(--border)" strokeWidth="1.5" />
        {cols.map((c, i) => (
          <g key={c}>
            <path d={`M200 82 L${c} 82 L${c} 104`} fill="none" stroke="var(--primary)" strokeWidth="1.2" strokeDasharray="4 4" className="animate-dash" />
            <Node x={c} y={124} w={96} label={`Sample ${i + 1}`} sub="bootstrap" />
            <line x1={c} y1={142} x2={c} y2={170} stroke="var(--border)" strokeWidth="1.5" />
            <Tree x={c} y={178} variant={i} />
            <text x={c} y={272} textAnchor="middle" fontSize="11" fill="var(--muted-foreground)" fontFamily="var(--font-mono)">Tree {i + 1}</text>
            <path d={`M${c} 282 L${c} 312 L200 312`} fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="4 4" className="animate-dash" />
          </g>
        ))}
        <line x1={200} y1={312} x2={200} y2={340} stroke="var(--border)" strokeWidth="1.5" />
        <Node x={200} y={360} w={170} label="Aggregation" sub="vote · average" />
        <line x1={200} y1={378} x2={200} y2={410} stroke="var(--border)" strokeWidth="1.5" />
        <rect x={110} y={410} width={180} height={40} rx={10} fill="color-mix(in oklab, var(--primary) 15%, transparent)" stroke="var(--primary)" />
        <text x={200} y={435} textAnchor="middle" fontSize="13" fill="var(--foreground)" fontWeight={600} fontFamily="var(--font-sans)">Final Prediction ŷ</text>
      </svg>
    </div>
  );
}
