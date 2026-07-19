function CharacterHead({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={7} fill="#FFE0B2" />
      <circle cx={cx - 2.5} cy={cy - 1} r={1} fill="#5D4037" />
      <circle cx={cx + 2.5} cy={cy - 1} r={1} fill="#5D4037" />
      <circle cx={cx} cy={cy + 1.5} r={1.5} fill="#E8A87C" opacity={0.5} />
      <path d={`M${cx - 2} ${cy + 3.5} Q${cx} ${cy + 5.5} ${cx + 2} ${cy + 3.5}`} stroke="#5D4037" strokeWidth={0.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

function CharacterBody({ x, y, color = '#73BF44' }) {
  return (
    <g>
      <rect x={x - 6} y={y} width={12} height={16} rx={4} fill={color} />
      <rect x={x - 6} y={y + 15} width={12} height={3} rx={1.5} fill="#5D4037" opacity={0.15} />
    </g>
  )
}

function CharacterArm({ fromX, fromY, toX, toY, side = 'right' }) {
  const elbowX = fromX + (toX - fromX) * 0.6 + (side === 'right' ? -2 : 2)
  const elbowY = fromY + (toY - fromY) * 0.5 - 3
  return (
    <path
      d={`M${fromX} ${fromY} Q${elbowX} ${elbowY} ${toX} ${toY}`}
      stroke="#FFE0B2" strokeWidth={3} fill="none" strokeLinecap="round"
    />
  )
}

function Character({ x, y, scale = 1, bodyColor = '#73BF44', armRight, armLeft, hairColor = '#5D4037' }) {
  const s = scale
  return (
    <g transform={`translate(${x}, ${y}) scale(${s})`}>
      {/* Legs */}
      <rect x={-3.5} y={19} width={3.5} height={8} rx={1.75} fill="#5D4037" opacity={0.15} />
      <rect x={0} y={19} width={3.5} height={8} rx={1.75} fill="#5D4037" opacity={0.15} />
      {/* Body */}
      <CharacterBody x={0} y={6} color={bodyColor} />
      {/* Arms */}
      {armRight && <CharacterArm fromX={6} fromY={10} toX={armRight.x} toY={armRight.y} side="right" />}
      {armLeft && <CharacterArm fromX={-6} fromY={10} toX={armLeft.x} toY={armLeft.y} side="left" />}
      {/* Head */}
      <circle cx={0} cy={3} r={7} fill="#FFE0B2" />
      <ellipse cx={0} cy={-1} rx={7.5} ry={5} fill={hairColor} />
      <circle cx={-2.5} cy={2} r={1.1} fill="#5D4037" />
      <circle cx={2.5} cy={2} r={1.1} fill="#5D4037" />
      <ellipse cx={0} cy={4.5} rx={1.8} ry={1.5} fill="#E8A87C" opacity={0.5} />
      <path d="M-2 6.5 Q0 8.5 2 6.5" stroke="#5D4037" strokeWidth={0.6} fill="none" strokeLinecap="round" />
    </g>
  )
}

export function IllustrationFarming({ large }) {
  const w = large ? 260 : 160
  const h = large ? 200 : 140
  const s = large ? 1 : 0.65
  return (
    <svg width={w} height={h} viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Sky */}
      <rect width="260" height="200" rx="20" fill="#E8F5E9" />
      {/* Sun */}
      <circle cx="210" cy="40" r="24" fill="#FDE68A" opacity="0.8" />
      <circle cx="210" cy="40" r="18" fill="#FCD34D" />
      <line x1="210" y1="12" x2="210" y2="4" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="238" y1="40" x2="246" y2="40" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="182" y1="40" x2="174" y2="40" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="234" y1="26" x2="240" y2="20" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <line x1="186" y1="26" x2="180" y2="20" stroke="#FCD34D" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      {/* Clouds */}
      <ellipse cx="60" cy="38" rx="28" ry="10" fill="white" opacity="0.7" />
      <ellipse cx="75" cy="34" rx="18" ry="8" fill="white" opacity="0.9" />
      <ellipse cx="48" cy="34" rx="14" ry="7" fill="white" opacity="0.8" />
      {/* Ground */}
      <ellipse cx="130" cy="185" rx="140" ry="30" fill="#C8E6C9" opacity="0.5" />
      <rect x="0" y="170" width="260" height="30" fill="#A5D6A7" opacity="0.3" rx="10" />
      {/* Crops */}
      <g opacity="0.8">
        {[30, 55, 80, 105, 150, 175, 200, 225].map((x, i) => (
          <g key={i} transform={`translate(${x}, 0)`}>
            <line x1={0} y1="155" x2={0} y2="130" stroke="#66BB6A" strokeWidth="2.5" strokeLinecap="round" />
            <ellipse cx={0} cy="126" rx="5" ry="7" fill="#81C784" />
            <ellipse cx={-3} cy="140" rx="4" ry="3" fill="#81C784" opacity="0.7" />
            <ellipse cx={3} cy="138" rx="3.5" ry="3" fill="#81C784" opacity="0.6" />
          </g>
        ))}
      </g>
      {/* Fence */}
      <line x1="18" y1="145" x2="18" y2="170" stroke="#A1887F" strokeWidth="2" />
      <line x1="55" y1="145" x2="55" y2="170" stroke="#A1887F" strokeWidth="2" />
      <line x1="95" y1="145" x2="95" y2="170" stroke="#A1887F" strokeWidth="2" />
      <line x1="12" y1="150" x2="100" y2="150" stroke="#A1887F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="160" x2="100" y2="160" stroke="#A1887F" strokeWidth="2.5" strokeLinecap="round" />
      {/* Character - farmer */}
      <g transform={`translate(130, 110) scale(${s})`}>
        <rect x={-4} y={19} width={4} height={9} rx={2} fill="#5D4037" opacity="0.15" />
        <rect x={0} y={19} width={4} height={9} rx={2} fill="#5D4037" opacity="0.15" />
        <rect x={-7} y={6} width={14} height={17} rx={4.5} fill="#FF8A65" />
        <rect x={-7} y={22} width={14} height={3} rx={1.5} fill="#5D4037" opacity="0.12" />
        <path d="M-7 10 Q-14 14 -16 20" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M7 10 Q14 8 20 6" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={3} r={8} fill="#FFE0B2" />
        <ellipse cx={0} cy={-1} rx={8.5} ry={5.5} fill="#5D4037" />
        <circle cx={-2.8} cy={2} r={1.2} fill="#5D4037" />
        <circle cx={2.8} cy={2} r={1.2} fill="#5D4037" />
        <ellipse cx={0} cy={5} rx={2} ry={1.6} fill="#E8A87C" opacity={0.5} />
        <path d="M-2.5 7 Q0 9.5 2.5 7" stroke="#5D4037" strokeWidth={0.7} fill="none" strokeLinecap="round" />
        {/* Hat */}
        <ellipse cx={0} cy={-5} rx={12} ry={3.5} fill="#D4E157" />
        <rect x={-6} y={-11} width={12} height={7} rx={3} fill="#D4E157" />
        <rect x={-10} y={-5} width={20} height={1.5} rx={1} fill="#C0CA33" opacity={0.5} />
      </g>
      {/* Growing plant in hand area */}
      <g transform={`translate(165, 148) scale(${s * 0.8})`}>
        <line x1={0} y1={12} x2={0} y2={0} stroke="#66BB6A" strokeWidth={2} strokeLinecap="round" />
        <ellipse cx={0} cy={-3} rx={5} ry={6} fill="#81C784" />
        <ellipse cx={-2} cy={5} rx={3} ry={2.5} fill="#81C784" opacity={0.7} />
      </g>
    </svg>
  )
}

export function IllustrationSearch({ large }) {
  const w = large ? 260 : 160
  const h = large ? 200 : 140
  const s = large ? 1 : 0.65
  return (
    <svg width={w} height={h} viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="260" height="200" rx="20" fill="#E8F5E9" />
      {/* Shelf */}
      <rect x="30" y="155" width="200" height="6" rx="3" fill="#A1887F" opacity="0.4" />
      {/* Products on shelf */}
      <rect x="50" y="125" width="24" height="28" rx="4" fill="#81C784" />
      <rect x="50" y="125" width="24" height="8" rx="4" fill="#66BB6A" />
      <rect x="82" y="130" width="22" height="23" rx="4" fill="#FFB74D" />
      <rect x="82" y="130" width="22" height="7" rx="4" fill="#FFA726" />
      <rect x="114" y="128" width="26" height="25" rx="4" fill="#4DD0E1" />
      <rect x="114" y="128" width="26" height="7" rx="4" fill="#26C6DA" />
      <rect x="150" y="132" width="20" height="21" rx="4" fill="#BA68C8" />
      <rect x="150" y="132" width="20" height="6" rx="4" fill="#AB47BC" />
      {/* Leaves on products */}
      <ellipse cx="62" cy="122" rx="4" ry="3" fill="#66BB6A" transform="rotate(20, 62, 122)" />
      <ellipse cx="93" cy="127" rx="3.5" ry="2.5" fill="#FFB74D" transform="rotate(-15, 93, 127)" opacity="0.7" />
      {/* Character with magnifying glass */}
      <g transform={`translate(140, 102) scale(${s})`}>
        <rect x={-4} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={0} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={-7.5} y={7} width={15} height={18} rx={5} fill="#FF8A65" />
        <rect x={-7.5} y={24} width={15} height={3} rx={1.5} fill="#5D4037" opacity="0.12" />
        <path d="M8 12 Q18 18 22 28" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M-8 12 Q-16 10 -20 8" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={4} r={8.5} fill="#FFE0B2" />
        <ellipse cx={0} cy={0} rx={9} ry={6} fill="#5D4037" />
        <circle cx={-3} cy={3} r={1.2} fill="#5D4037" />
        <circle cx={3} cy={3} r={1.2} fill="#5D4037" />
        <ellipse cx={0} cy={6} rx={2} ry={1.6} fill="#E8A87C" opacity={0.5} />
        <path d="M-2.5 8.5 Q0 11 2.5 8.5" stroke="#5D4037" strokeWidth={0.7} fill="none" strokeLinecap="round" />
      </g>
      {/* Magnifying glass (held by the right arm) */}
      <g transform={`translate(178, 126) scale(${s * 0.85})`}>
        <circle cx={0} cy={0} r={14} fill="white" stroke="#73BF44" strokeWidth={3} opacity={0.85} />
        <circle cx={0} cy={0} r={8} stroke="#C8E6C9" strokeWidth={1.5} opacity={0.6} />
        <line x1={10} y1={10} x2={20} y2={20} stroke="#73BF44" strokeWidth={3.5} strokeLinecap="round" />
        {/* Leaf inside magnifier */}
        <ellipse cx={0} cy={0} rx={5} ry={7} fill="#81C784" opacity={0.6} />
      </g>
      {/* Sparkles */}
      <g opacity="0.5">
        <circle cx="200" cy="90" r="2" fill="#FCD34D" />
        <circle cx="215" cy="100" r="1.5" fill="#FCD34D" />
        <circle cx="195" cy="105" r="1.5" fill="#FCD34D" />
      </g>
    </svg>
  )
}

export function IllustrationCreate({ large }) {
  const w = large ? 260 : 160
  const h = large ? 200 : 140
  const s = large ? 1 : 0.65
  return (
    <svg width={w} height={h} viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="260" height="200" rx="20" fill="#E8F5E9" />
      {/* Large document */}
      <g transform={`translate(70, 45)`}>
        <rect x="0" y="0" width="90" height="115" rx="8" fill="white" stroke="#73BF44" strokeWidth="2" />
        <rect x="15" y="55" width="60" height="4" rx="2" fill="#C8E6C9" />
        <rect x="15" y="65" width="50" height="4" rx="2" fill="#E8F5E9" />
        <rect x="15" y="75" width="55" height="4" rx="2" fill="#C8E6C9" />
        <rect x="15" y="85" width="45" height="4" rx="2" fill="#E8F5E9" />
        <rect x="15" y="25" width="40" height="4" rx="2" fill="#C8E6C9" />
        <rect x="15" y="35" width="55" height="4" rx="2" fill="#E8F5E9" />
        <rect x="15" y="45" width="35" height="4" rx="2" fill="#C8E6C9" />
        {/* Plus icon */}
        <circle cx="45" cy="18" r="10" fill="#73BF44" />
        <line x1="45" y1="12" x2="45" y2="24" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="39" y1="18" x2="51" y2="18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Character */}
      <g transform={`translate(180, 95) scale(${s})`}>
        <rect x={-4.5} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={0} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={-8} y={7} width={16} height={18} rx={5} fill="#4DD0E1" />
        <rect x={-8} y={24} width={16} height={3} rx={1.5} fill="#5D4037" opacity="0.12" />
        {/* Left arm holding pen */}
        <path d="M-8 12 Q-20 8 -28 6" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {/* Right arm pointing at document */}
        <path d="M8 12 Q18 14 24 18" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={4} r={8.5} fill="#FFE0B2" />
        <ellipse cx={0} cy={0} rx={9} ry={6} fill="#6D4C41" />
        <circle cx={-3} cy={3} r={1.2} fill="#5D4037" />
        <circle cx={3} cy={3} r={1.2} fill="#5D4037" />
        <ellipse cx={0} cy={6} rx={2} ry={1.6} fill="#E8A87C" opacity={0.5} />
        <path d="M-2.5 8.5 Q0 11 2.5 8.5" stroke="#5D4037" strokeWidth={0.7} fill="none" strokeLinecap="round" />
      </g>
      {/* Pencil */}
      <g transform={`translate(30, 48) rotate(-20, 0, 0)`}>
        <rect x="0" y="0" width="6" height="40" rx="1" fill="#FDD835" />
        <polygon points="0,40 6,40 3,48" fill="#FFE0B2" />
        <polygon points="2.5,44 3.5,44 3,48" fill="#5D4037" />
      </g>
      {/* Sparkles */}
      <g opacity="0.6">
        <circle cx="58" cy="30" r="2" fill="#FCD34D" />
        <circle cx="65" cy="38" r="1.5" fill="#FCD34D" />
        <circle cx="52" cy="22" r="1.5" fill="#FCD34D" />
      </g>
    </svg>
  )
}

export function IllustrationDashboard({ large }) {
  const w = large ? 260 : 160
  const h = large ? 200 : 140
  const s = large ? 1 : 0.65
  return (
    <svg width={w} height={h} viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="260" height="200" rx="20" fill="#E8F5E9" />
      {/* Large screen */}
      <g transform="translate(45, 40)">
        <rect x="0" y="0" width="130" height="85" rx="8" fill="white" stroke="#73BF44" strokeWidth="2.5" />
        {/* Screen header */}
        <rect x="0" y="0" width="130" height="18" rx="8" fill="#E8F5E9" />
        <circle cx="10" cy="9" r="3" fill="#FF7043" />
        <circle cx="20" cy="9" r="3" fill="#FDD835" />
        <circle cx="30" cy="9" r="3" fill="#66BB6A" />
        {/* Charts */}
        <rect x="12" y="26" width="50" height="50" rx="4" fill="#F1F8E9" />
        <rect x="14" y="50" width="10" height="24" rx="2" fill="#81C784" />
        <rect x="28" y="36" width="10" height="38" rx="2" fill="#66BB6A" />
        <rect x="42" y="42" width="10" height="32" rx="2" fill="#4CAF50" />
        {/* Right side panel */}
        <rect x="70" y="26" width="50" height="22" rx="4" fill="#F1F8E9" />
        <rect x="76" y="32" width="38" height="4" rx="2" fill="#C8E6C9" />
        <rect x="76" y="39" width="30" height="3" rx="1.5" fill="#E8F5E9" />
        <rect x="70" y="54" width="50" height="22" rx="4" fill="#F1F8E9" />
        <rect x="76" y="60" width="28" height="4" rx="2" fill="#C8E6C9" />
        <rect x="76" y="67" width="22" height="3" rx="1.5" fill="#E8F5E9" />
        {/* Upward arrow */}
        <path d="M95 50 L100 44 L105 50" stroke="#66BB6A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Character */}
      <g transform={`translate(196, 92) scale(${s})`}>
        <rect x={-4.5} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={0} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={-8} y={7} width={16} height={18} rx={5} fill="#BA68C8" />
        <rect x={-8} y={24} width={16} height={3} rx={1.5} fill="#5D4037" opacity="0.12" />
        {/* Arms pointing at screen */}
        <path d="M-8 12 Q-18 10 -24 8" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M8 12 Q18 14 22 18" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={4} r={8.5} fill="#FFE0B2" />
        <ellipse cx={0} cy={0} rx={9} ry={6} fill="#5D4037" />
        <circle cx={-3} cy={3} r={1.2} fill="#5D4037" />
        <circle cx={3} cy={3} r={1.2} fill="#5D4037" />
        <ellipse cx={0} cy={6} rx={2} ry={1.6} fill="#E8A87C" opacity={0.5} />
        <path d="M-2.5 8.5 Q0 11 2.5 8.5" stroke="#5D4037" strokeWidth={0.7} fill="none" strokeLinecap="round" />
      </g>
      {/* Decorative dots */}
      <g opacity="0.4">
        <circle cx="35" cy="155" r="3" fill="#81C784" />
        <circle cx="50" cy="165" r="2" fill="#A5D6A7" />
        <circle cx="220" cy="160" r="2.5" fill="#81C784" />
        <circle cx="205" cy="170" r="2" fill="#A5D6A7" />
      </g>
    </svg>
  )
}

export function IllustrationService({ large }) {
  const w = large ? 260 : 160
  const h = large ? 200 : 140
  const s = large ? 1 : 0.65
  return (
    <svg width={w} height={h} viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="260" height="200" rx="20" fill="#E8F5E9" />
      {/* Gear/wrench elements */}
      <g transform="translate(60, 55)">
        <circle cx="0" cy="0" r="28" fill="white" stroke="#73BF44" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="14" fill="#E8F5E9" />
        <circle cx="0" cy="0" r="6" fill="#73BF44" />
        {/* Gear teeth */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect
            key={angle}
            x={-3}
            y={-34}
            width={6}
            height={10}
            rx={2}
            fill="#73BF44"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
      {/* Small gear */}
      <g transform="translate(98, 92)">
        <circle cx="0" cy="0" r="14" fill="white" stroke="#81C784" strokeWidth="2" />
        <circle cx="0" cy="0" r="5" fill="#81C784" />
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <rect
            key={angle}
            x={-2}
            y={-18}
            width={4}
            height={6}
            rx={1.5}
            fill="#81C784"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
      {/* Wrench */}
      <g transform="translate(35, 105) rotate(-30, 0, 0)">
        <rect x="0" y="0" width="8" height="35" rx="3" fill="#73BF44" />
        <rect x="-5" y="32" width="18" height="10" rx="4" fill="#73BF44" />
        <rect x="-5" y="32" width="6" height="10" rx="2" fill="#5DA832" />
      </g>
      {/* Character */}
      <g transform={`translate(168, 95) scale(${s})`}>
        <rect x={-4.5} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={0} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={-8} y={7} width={16} height={18} rx={5} fill="#FF8A65" />
        <rect x={-8} y={24} width={16} height={3} rx={1.5} fill="#5D4037" opacity="0.12" />
        {/* Arms gesturing */}
        <path d="M-8 12 Q-18 8 -24 4" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M8 12 Q18 16 24 20" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={4} r={8.5} fill="#FFE0B2" />
        <ellipse cx={0} cy={0} rx={9} ry={6} fill="#6D4C41" />
        <circle cx={-3} cy={3} r={1.2} fill="#5D4037" />
        <circle cx={3} cy={3} r={1.2} fill="#5D4037" />
        <ellipse cx={0} cy={6} rx={2} ry={1.6} fill="#E8A87C" opacity={0.5} />
        <path d="M-2.5 8.5 Q0 11 2.5 8.5" stroke="#5D4037" strokeWidth={0.7} fill="none" strokeLinecap="round" />
      </g>
      {/* Checkmark badge */}
      <g transform="translate(210, 48)">
        <circle cx="0" cy="0" r="16" fill="#73BF44" opacity="0.15" />
        <circle cx="0" cy="0" r="12" fill="#73BF44" />
        <path d="M-4 0 L-1 3 L5 -3" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* Decorative dots */}
      <circle cx="220" cy="170" r="2.5" fill="#C8E6C9" />
      <circle cx="235" cy="162" r="2" fill="#A5D6A7" />
    </svg>
  )
}

export function IllustrationProduct({ large }) {
  const w = large ? 260 : 160
  const h = large ? 200 : 140
  const s = large ? 1 : 0.65
  return (
    <svg width={w} height={h} viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="260" height="200" rx="20" fill="#E8F5E9" />
      {/* Large box */}
      <g transform="translate(55, 50)">
        <rect x="0" y="10" width="80" height="65" rx="6" fill="white" stroke="#73BF44" strokeWidth="2.5" />
        {/* Box lid */}
        <rect x="-2" y="4" width="84" height="12" rx="4" fill="#73BF44" />
        {/* Tape strip */}
        <rect x="35" y="4" width="10" height="12" rx="1" fill="#5DA832" opacity="0.5" />
        {/* Leaf on box */}
        <ellipse cx="40" cy="0" rx="6" ry="5" fill="#81C784" transform="rotate(15, 40, 0)" />
        <line x1="40" y1="2" x2="40" y2="10" stroke="#66BB6A" strokeWidth="1.5" />
      </g>
      {/* Small box 1 */}
      <g transform="translate(148, 75)">
        <rect x="0" y="0" width="35" height="30" rx="4" fill="white" stroke="#81C784" strokeWidth="2" />
        <rect x="0" y="0" width="35" height="7" rx="3" fill="#81C784" />
        <rect x="14" y="0" width="7" height="7" rx="1" fill="#66BB6A" opacity="0.5" />
      </g>
      {/* Small box 2 - stacked */}
      <g transform="translate(148, 45)">
        <rect x="0" y="0" width="30" height="28" rx="4" fill="white" stroke="#A5D6A7" strokeWidth="2" />
        <rect x="0" y="0" width="30" height="6" rx="3" fill="#A5D6A7" />
      </g>
      {/* Character */}
      <g transform={`translate(198, 95) scale(${s})`}>
        <rect x={-4.5} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={0} y={20} width={4.5} height={9} rx={2.25} fill="#5D4037" opacity="0.12" />
        <rect x={-8} y={7} width={16} height={18} rx={5} fill="#66BB6A" />
        <rect x={-8} y={24} width={16} height={3} rx={1.5} fill="#5D4037" opacity="0.12" />
        {/* Arms */}
        <path d="M-8 12 Q-16 16 -20 22" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M8 12 Q16 10 22 12" stroke="#FFE0B2" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={4} r={8.5} fill="#FFE0B2" />
        <ellipse cx={0} cy={0} rx={9} ry={6} fill="#5D4037" />
        <circle cx={-3} cy={3} r={1.2} fill="#5D4037" />
        <circle cx={3} cy={3} r={1.2} fill="#5D4037" />
        <ellipse cx={0} cy={6} rx={2} ry={1.6} fill="#E8A87C" opacity={0.5} />
        <path d="M-2.5 8.5 Q0 11 2.5 8.5" stroke="#5D4037" strokeWidth={0.7} fill="none" strokeLinecap="round" />
      </g>
      {/* Floating leaf */}
      <g opacity="0.6">
        <ellipse cx="32" cy="165" rx="4" ry="3" fill="#81C784" transform="rotate(-20, 32, 165)" />
        <line x1="28" y1="167" x2="36" y2="163" stroke="#66BB6A" strokeWidth="1" />
        <ellipse cx="225" cy="155" rx="3.5" ry="2.5" fill="#A5D6A7" transform="rotate(10, 225, 155)" />
      </g>
    </svg>
  )
}
