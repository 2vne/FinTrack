export default function LineChart({ data }) {
  if (!data || data.length === 0) return null;

  const padding = { top: 20, right: 30, bottom: 40, left: 55 };
  const width = 700;
  const height = 280;
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const allValues = data.flatMap((d) => [d.income, d.expense]);
  const maxVal = Math.max(...allValues) * 1.15;
  const minVal = 0;

  const xStep = chartW / (data.length - 1);

  const getX = (i) => padding.left + i * xStep;
  const getY = (val) => padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;

  const incomePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(d.income)}`).join(' ');
  const expensePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${getX(i)},${getY(d.expense)}`).join(' ');

  const incomeArea = `${incomePath} L${getX(data.length - 1)},${padding.top + chartH} L${getX(0)},${padding.top + chartH} Z`;
  const expenseArea = `${expensePath} L${getX(data.length - 1)},${padding.top + chartH} L${getX(0)},${padding.top + chartH} Z`;

  const gridLines = [];
  const numGridLines = 5;
  for (let i = 0; i <= numGridLines; i++) {
    const val = minVal + ((maxVal - minVal) / numGridLines) * i;
    const y = getY(val);
    gridLines.push({ y, label: `₹${Math.round(val / 1000)}k` });
  }

  return (
    <div className="line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid lines */}
        {gridLines.map((line, i) => (
          <g key={i}>
            <line x1={padding.left} y1={line.y} x2={width - padding.right} y2={line.y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
            <text x={padding.left - 8} y={line.y + 4} textAnchor="end" fill="var(--text-secondary)" fontSize="10" fontWeight="500">{line.label}</text>
          </g>
        ))}

        {/* Area fills */}
        <path d={incomeArea} fill="url(#incomeGradient)" />
        <path d={expenseArea} fill="url(#expenseGradient)" />

        {/* Lines */}
        <path d={incomePath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'url(#glow)' }} />
        <path d={expensePath} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots and labels */}
        {data.map((d, i) => (
          <g key={i}>
            <circle cx={getX(i)} cy={getY(d.income)} r="3" fill="#10b981" />
            <circle cx={getX(i)} cy={getY(d.expense)} r="3" fill="#ef4444" />
            <text x={getX(i)} y={height - 5} textAnchor="middle" fill="var(--text-secondary)" fontSize="11" fontWeight="600">{d.month}</text>
          </g>
        ))}

        {/* Legend */}
        <g transform={`translate(${width - 150}, 10)`}>
          <circle cx="0" cy="0" r="4" fill="#10b981" />
          <text x="10" y="4" fill="var(--text-secondary)" fontSize="11" fontWeight="600">Income</text>
          <circle cx="70" cy="0" r="4" fill="#ef4444" />
          <text x="80" y="4" fill="var(--text-secondary)" fontSize="11" fontWeight="600">Expense</text>
        </g>
      </svg>
    </div>
  );
}
