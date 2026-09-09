// Small illustrative previews keep the gallery independent of the full simulations.
export default function ProjectPreview({ slug }) {
    let scene;
    if (slug === 'eight-puzzle') {
        scene = Array.from({ length: 8 }, (_, i) => (
            <g key={i} className={i === 7 ? 'preview-tile' : undefined}>
                <rect x={85 + (i % 3) * 45} y={20 + Math.floor(i / 3) * 45} width="40" height="40" rx="7" fill={i === 7 ? '#d5ff5f' : '#e3eee7'} />
                <text x={105 + (i % 3) * 45} y={46 + Math.floor(i / 3) * 45} textAnchor="middle" fill="#203c32" fontSize="20">{i + 1}</text>
            </g>
        ));
    } else if (slug === 'nepali-kitty') {
        scene = ['♠', '♥', '♣'].map((suit, i) => (
            <g key={suit} transform={`translate(${85 + i * 44}, 35) rotate(${(i - 1) * 12}, 30, 50)`}>
                <g className="preview-card" style={{ animationDelay: `${i * -0.6}s` }}>
                    <rect width="62" height="94" rx="7" fill="#f6f5e9" stroke="#98ac9c" />
                    <text x="9" y="23" fill={i === 1 ? '#bd5d54' : '#203c32'} fontSize="18">A</text>
                    <text x="31" y="66" textAnchor="middle" fill={i === 1 ? '#bd5d54' : '#203c32'} fontSize="36">{suit}</text>
                </g>
            </g>
        ));
    } else if (slug === 'fourier-transform-audio') {
        scene = <>
            <path d="M20 50H300 M20 115H300" stroke="#547967" />
            {[0, 1].map(row => <path key={row} className="preview-trace" d={`M20 ${50 + row * 65} ${Array.from({ length: 56 }, (_, i) => `L${25 + i * 5} ${50 + row * 65 + Math.sin(i * 0.45) * 18 + (row ? 0 : Math.sin(i * 2.8) * 10)}`).join(' ')}`} fill="none" stroke={row ? '#d5ff5f' : '#73c4cf'} strokeWidth="2.5" />)}
        </>;
    } else if (slug === 'nepal-fourier-curve') {
        scene = <>
            <g className="preview-orbit"><circle cx="95" cy="80" r="32" fill="none" stroke="#80a18a" /><circle cx="127" cy="80" r="15" fill="none" stroke="#80a18a" /><path d="M95 80H142" stroke="#d5ff5f" /><circle cx="142" cy="80" r="4" fill="#d5ff5f" /></g>
            <path className="preview-trace" d="M65 73 L83 48 100 58 114 54 123 70 140 65 160 81 174 76 190 89 210 88 218 105 245 109 251 125 223 119 198 109 176 105 157 94 137 92 121 81 102 82 86 74Z" fill="none" stroke="#d5ff5f" strokeWidth="2.5" />
        </>;
    } else if (slug === 'usa-capitals-voronoi') {
        scene = <g transform="translate(25 20)">
            {['15,15 85,20 70,65 25,85', '85,20 142,12 150,70 70,65', '142,12 208,25 193,80 150,70', '208,25 270,12 248,73 193,80', '25,85 70,65 113,125 56,111', '70,65 150,70 150,115 113,125', '150,70 193,80 225,120 150,115', '193,80 248,73 225,120'].map((points, i) => <polygon className="preview-region" key={points} points={points} fill={['#638f75', '#b4d58b', '#75b6b8'][i % 3]} stroke="#213f33" strokeWidth="2" style={{ animationDelay: `${i * -0.5}s` }} />)}
            {[[48, 46], [108, 45], [173, 44], [229, 49], [64, 95], [125, 93], [180, 95], [225, 88]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="3" fill="#f6f5e9" />)}
        </g>;
    } else if (slug === 'magnus-effect' || slug === 'soccer') {
        scene = <>
            <rect x="25" y="20" width="270" height="125" rx="5" fill="none" stroke="#638f75" />
            <path d="M160 20V145 M270 57H295V108H270Z" fill="none" stroke="#638f75" />
            <circle cx="160" cy="82" r="28" fill="none" stroke="#638f75" />
            <path className="preview-trace" d="M55 125 Q120 20 265 76" fill="none" stroke="#d5ff5f" strokeWidth="3" strokeDasharray="6 5" />
            <g className="preview-football"><circle cx="160" cy="62" r="12" fill="#f6f5e9" /><path d="M160 55L167 60L164 68H156L153 60Z" fill="#203c32" /></g>
        </>;
    } else if (slug === 'karma-realization-bhakti') {
        scene = <>
            {[48, 34, 20].map((r, i) => <circle key={r} className="preview-region" cx="160" cy="80" r={r} stroke="#d5ff5f" fill="none" style={{ animationDelay: `${-i}s` }} />)}
            <g className="preview-orbit"><circle cx="208" cy="80" r="6" fill="#d5ff5f" /></g>
            <path d="M65 132H255" stroke="#638f75" />
            {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={70 + i * 30} cy="132" r="3" fill="#c1d9b0" />)}
        </>;
    } else {
        const snooker = slug === 'snooker-elastic-collision';
        const family = slug === 'family-elastic-collision';
        scene = <>
            {snooker && <rect x="22" y="15" width="276" height="135" rx="12" fill="#285848" stroke="#a58d66" strokeWidth="8" />}
            {slug === 'elastic-collision-convex-hull' && <path className="preview-region" d="M50 48L163 25L266 66L241 131L94 135Z" fill="#d5ff5f" fillOpacity="0.08" stroke="#d5ff5f" strokeWidth="2" />}
            {Array.from({ length: family ? 6 : 14 }, (_, i) => (
                <g key={i} className="preview-particle" style={{ animationDelay: `${i * -0.7}s`, animationDuration: `${3 + (i % 4)}s`, '--drift-x': `${i % 2 ? -14 : 14}px`, '--drift-y': `${i % 3 ? 12 : -12}px` }}>
                    <circle cx={48 + (i * 67) % 225} cy={37 + (i * 37) % 95} r={family ? 16 : snooker ? 8 : 4 + i % 6} fill={slug === 'diffusion-elastic-collision' ? (i % 2 ? '#73c4cf' : '#efb680') : ['#d5ff5f', '#73c4cf', '#efb680'][i % 3]} />
                    {family && <g fill="#284a3b"><circle cx={48 + (i * 67) % 225} cy={33 + (i * 37) % 95} r="5" /><path d={`M${39 + (i * 67) % 225} ${48 + (i * 37) % 95}q0 -15 18 0Z`} /></g>}
                </g>
            ))}
            {slug === 'pollen-grain-elastic-collision' && <circle className="preview-particle" cx="160" cy="80" r="24" fill="#efb680" style={{ '--drift-x': '5px', '--drift-y': '-7px' }} />}
        </>;
    }
    return <svg className="project-preview-art" viewBox="0 0 320 165" aria-hidden="true" focusable="false">{scene}</svg>;
}
