// Illustrated login-carousel scenes (hand-drawn SVG, no image files needed)

export function TruckScene() {
  return (
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A delivery truck driving past green hills" className="scene">
      <defs><linearGradient id="s1-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fde68a"/><stop offset="1" stopColor="#d1fae5"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#s1-sky)"/>
      <circle cx="318" cy="70" r="38" fill="#fbbf24" opacity=".3"/>
      <circle cx="318" cy="70" r="25" fill="#f59e0b"/>
      <g className="cloud-a" opacity=".95"><ellipse cx="86" cy="62" rx="36" ry="12" fill="#fff"/><ellipse cx="112" cy="53" rx="24" ry="13" fill="#fff"/><ellipse cx="62" cy="55" rx="18" ry="10" fill="#fff"/></g>
      <g className="cloud-b" opacity=".9"><ellipse cx="238" cy="104" rx="28" ry="9" fill="#fff"/><ellipse cx="256" cy="97" rx="17" ry="10" fill="#fff"/></g>
      <path d="M0 205 Q70 140 150 190 T300 180 T400 195 V300 H0Z" fill="#6ee7b7"/>
      <path d="M0 232 Q90 180 190 220 T400 214 V300 H0Z" fill="#34d399"/>
      <rect y="242" width="400" height="58" fill="#374151"/>
      <rect y="242" width="400" height="5" fill="#4b5563"/>
      <line x1="0" y1="274" x2="400" y2="274" stroke="#fde68a" strokeWidth="4" strokeDasharray="20 14" strokeLinecap="round"/>
      <g className="bob">
      <ellipse cx="170" cy="253" rx="110" ry="6" fill="#111827" opacity=".25"/>
      <rect x="56" y="146" width="156" height="84" rx="10" fill="#fff"/>
      <rect x="56" y="192" width="156" height="14" fill="#10b981"/>
      <rect x="104" y="158" width="52" height="40" rx="7" fill="#d1fae5"/>
      <path d="M118 178 l9 9 l17 -19" fill="none" stroke="#059669" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M212 172 h38 q12 0 20 12 l14 22 v24 h-72 z" fill="#059669"/>
      <path d="M224 182 h24 q6 0 10 7 l8 14 h-42 z" fill="#bae6fd"/>
      <rect x="266" y="212" width="18" height="6" rx="3" fill="#6ee7b7"/>
      <circle cx="98" cy="232" r="18" fill="#1f2937"/><circle cx="98" cy="232" r="7" fill="#9ca3af"/>
      <circle cx="246" cy="232" r="18" fill="#1f2937"/><circle cx="246" cy="232" r="7" fill="#9ca3af"/>
      </g>
      </svg>
  );
}

export function RiderScene() {
  return (
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A courier on a scooter delivering a parcel" className="scene">
      <defs><linearGradient id="s2-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#a7f3d0"/><stop offset="1" stopColor="#ecfeff"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#s2-sky)"/>
      <g className="cloud-a" opacity=".9"><ellipse cx="70" cy="50" rx="30" ry="10" fill="#fff"/><ellipse cx="92" cy="43" rx="20" ry="11" fill="#fff"/></g>
      <g fill="#99f6e4"><rect x="10" y="120" width="46" height="120" rx="4"/><rect x="64" y="90" width="38" height="150" rx="4"/><rect x="262" y="110" width="44" height="130" rx="4"/><rect x="314" y="80" width="36" height="160" rx="4"/><rect x="356" y="130" width="40" height="110" rx="4"/></g>
      <g fill="#2dd4bf"><rect x="104" y="140" width="52" height="100" rx="4"/><rect x="164" y="104" width="44" height="136" rx="4"/><rect x="214" y="150" width="40" height="90" rx="4"/></g>
      <g fill="#ecfeff" opacity=".85"><rect x="114" y="154" width="8" height="10" rx="2"/><rect x="132" y="154" width="8" height="10" rx="2"/><rect x="114" y="176" width="8" height="10" rx="2"/><rect x="132" y="176" width="8" height="10" rx="2"/><rect x="174" y="118" width="8" height="10" rx="2"/><rect x="192" y="118" width="8" height="10" rx="2"/><rect x="174" y="142" width="8" height="10" rx="2"/><rect x="192" y="142" width="8" height="10" rx="2"/><rect x="222" y="164" width="8" height="10" rx="2"/><rect x="238" y="164" width="8" height="10" rx="2"/></g>
      <rect y="238" width="400" height="8" fill="#cbd5e1"/>
      <rect y="246" width="400" height="54" fill="#475569"/>
      <line x1="0" y1="274" x2="400" y2="274" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="18 14" strokeLinecap="round"/>
      <g className="bob">
      <ellipse cx="206" cy="250" rx="86" ry="5" fill="#0f172a" opacity=".25"/>
      <circle cx="150" cy="228" r="19" fill="#1f2937"/><circle cx="150" cy="228" r="8" fill="#cbd5e1"/>
      <circle cx="262" cy="228" r="19" fill="#1f2937"/><circle cx="262" cy="228" r="8" fill="#cbd5e1"/>
      <path d="M132 222 C134 200 160 196 182 200 L182 214 C168 212 160 218 160 228 Z" fill="#14b8a6"/>
      <rect x="178" y="206" width="62" height="11" rx="5.5" fill="#0f766e"/>
      <path d="M246 224 L236 168" stroke="#0f766e" strokeWidth="9" strokeLinecap="round" fill="none"/>
      <line x1="226" y1="166" x2="250" y2="164" stroke="#134e4a" strokeWidth="7" strokeLinecap="round"/>
      <circle cx="254" cy="172" r="5" fill="#fde047"/>
      <path d="M198 190 L214 208 L234 208" stroke="#1f2937" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <rect x="160" y="138" width="34" height="46" rx="7" fill="#f97316"/>
      <rect x="160" y="156" width="34" height="6" fill="#fdba74"/>
      <rect x="186" y="140" width="34" height="54" rx="15" fill="#10b981"/>
      <path d="M216 154 L238 166" stroke="#059669" strokeWidth="10" strokeLinecap="round" fill="none"/>
      <circle cx="204" cy="124" r="14" fill="#f5c9a0"/>
      <path d="M189 124 a15 15 0 0 1 30 0 z" fill="#f59e0b"/>
      </g>
      <g className="float">
      <ellipse cx="322" cy="150" rx="16" ry="4" fill="#0f172a" opacity=".15" className="pulse"/>
      <path d="M306 110 L322 142 L338 110 Z" fill="#ef4444"/>
      <circle cx="322" cy="98" r="19" fill="#ef4444"/>
      <circle cx="322" cy="98" r="7.5" fill="#fff"/>
      </g>
      </svg>
  );
}

export function WarehouseScene() {
  return (
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A warehouse shelf with parcels and a delivery checklist" className="scene">
      <defs><linearGradient id="s3-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#dbeafe"/><stop offset="1" stopColor="#d1fae5"/></linearGradient></defs>
      <rect width="400" height="300" fill="url(#s3-bg)"/>
      <rect x="0" y="252" width="400" height="48" fill="#cbd5e1"/>
      <rect x="0" y="252" width="400" height="5" fill="#b6c2d1"/>
      <g fill="#64748b"><rect x="28" y="44" width="8" height="208" rx="2"/><rect x="194" y="44" width="8" height="208" rx="2"/><rect x="28" y="108" width="174" height="7" rx="2"/><rect x="28" y="172" width="174" height="7" rx="2"/><rect x="28" y="236" width="174" height="7" rx="2"/></g>
      <g>
      <rect x="44" y="76" width="44" height="32" rx="4" fill="#fcd34d"/><rect x="62" y="76" width="8" height="32" fill="#f59e0b"/>
      <rect x="96" y="84" width="34" height="24" rx="4" fill="#93c5fd"/><rect x="109" y="84" width="8" height="24" fill="#60a5fa"/>
      <rect x="140" y="70" width="48" height="38" rx="4" fill="#fdba74"/><rect x="160" y="70" width="8" height="38" fill="#fb923c"/>
      <rect x="44" y="144" width="38" height="28" rx="4" fill="#a7f3d0"/><rect x="59" y="144" width="8" height="28" fill="#34d399"/>
      <rect x="90" y="132" width="52" height="40" rx="4" fill="#fcd34d"/><rect x="112" y="132" width="8" height="40" fill="#f59e0b"/>
      <rect x="150" y="150" width="36" height="22" rx="4" fill="#fdba74"/><rect x="164" y="150" width="8" height="22" fill="#fb923c"/>
      <rect x="44" y="204" width="50" height="32" rx="4" fill="#93c5fd"/><rect x="65" y="204" width="8" height="32" fill="#60a5fa"/>
      <rect x="104" y="214" width="34" height="22" rx="4" fill="#fcd34d"/><rect x="117" y="214" width="8" height="22" fill="#f59e0b"/>
      <rect x="148" y="198" width="40" height="38" rx="4" fill="#a7f3d0"/><rect x="164" y="198" width="8" height="38" fill="#34d399"/>
      </g>
      <g className="float">
      <rect x="236" y="42" width="130" height="164" rx="16" fill="#fff"/>
      <rect x="252" y="60" width="62" height="10" rx="5" fill="#10b981"/>
      <circle cx="262" cy="98" r="9" fill="#10b981"/><path d="M257 98 l4 4 l7 -8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="280" y="94" width="70" height="9" rx="4.5" fill="#cbd5e1"/>
      <circle cx="262" cy="130" r="9" fill="#10b981"/><path d="M257 130 l4 4 l7 -8" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="280" y="126" width="58" height="9" rx="4.5" fill="#cbd5e1"/>
      <circle cx="262" cy="162" r="8" fill="none" stroke="#94a3b8" strokeWidth="3"/>
      <rect x="280" y="158" width="66" height="9" rx="4.5" fill="#e2e8f0"/>
      <rect x="252" y="184" width="98" height="10" rx="5" fill="#d1fae5"/>
      </g>
      <g className="bob">
      <rect x="250" y="214" width="84" height="46" rx="6" fill="#fbbf24"/>
      <rect x="283" y="214" width="16" height="46" fill="#f59e0b"/>
      <ellipse cx="292" cy="262" rx="52" ry="5" fill="#0f172a" opacity=".15"/>
      </g>
      </svg>
  );
}

export function RouteScene() {
  return (
<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A map showing a delivery route to its destination" className="scene">
      <rect width="400" height="300" fill="#ecfdf5"/>
      <path d="M-10 70 C80 100 120 36 200 76 S330 126 410 86" stroke="#bae6fd" strokeWidth="30" fill="none" strokeLinecap="round"/>
      <g fill="#bbf7d0"><rect x="14" y="116" width="76" height="52" rx="10"/><rect x="108" y="116" width="86" height="52" rx="10"/><rect x="212" y="132" width="76" height="52" rx="10"/><rect x="306" y="140" width="80" height="52" rx="10"/><rect x="14" y="196" width="76" height="76" rx="10"/><rect x="108" y="196" width="86" height="76" rx="10"/><rect x="212" y="206" width="76" height="66" rx="10"/><rect x="306" y="214" width="80" height="58" rx="10"/></g>
      <g fill="#86efac" opacity=".8"><circle cx="52" cy="232" r="14"/><circle cx="150" cy="150" r="10"/><circle cx="350" cy="244" r="12"/></g>
      <g stroke="#fff" strokeWidth="12" strokeLinecap="round" fill="none"><path d="M0 182 H400"/><path d="M100 100 V300"/><path d="M200 110 V300"/><path d="M298 120 V300"/></g>
      <path d="M60 236 C60 190 100 190 100 182 S104 150 150 150 S200 110 232 100 S300 70 336 58" stroke="#065f46" strokeWidth="6" strokeDasharray="3 12" strokeLinecap="round" fill="none" className="route"/>
      <circle cx="60" cy="236" r="11" fill="#3b82f6"/><circle cx="60" cy="236" r="4.5" fill="#fff"/>
      <g className="float">
      <ellipse cx="336" cy="86" rx="14" ry="4" fill="#0f172a" opacity=".15"/>
      <path d="M322 44 L336 74 L350 44 Z" fill="#ef4444"/>
      <circle cx="336" cy="34" r="17" fill="#ef4444"/><circle cx="336" cy="34" r="6.5" fill="#fff"/>
      </g>
      <g className="pulse"><circle cx="150" cy="150" r="20" fill="#10b981" opacity=".25"/></g>
      <circle cx="150" cy="150" r="12" fill="#059669"/><rect x="144" y="146" width="12" height="8" rx="2" fill="#fff"/>
      </svg>
  );
}
