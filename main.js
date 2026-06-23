// ===== Utilities =====
function debounce(fn, delay) {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
function createSkeleton() {
    return `<div class="skeleton-block" aria-hidden="true">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-subtitle"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line skeleton-short"></div>
    </div>`;
}
function createErrorCard(label) {
    return `<div class="error-item"><p>Could not load ${label}. Please refresh.</p></div>`;
}
async function fetchJSON(url) {
    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) { return null; }
}

// ===== Matrix constants (Feature M) =====
// [governance, data, cloud, advisory] per experience id
const EXP_MATRIX = {
    1: [1.0,  0.90, 0.30, 1.0 ],
    2: [0.45, 0.30, 0.10, 0.85],
    3: [0.20, 0.40, 0.10, 0.75],
    4: [0.35, 0.75, 0.60, 0.45],
    5: [0.10, 0.15, 0.10, 0.65],
    6: [0.10, 0.55, 0.90, 0.35],
};
const SKILL_CATS = ['IT Governance', 'Data & Engineering', 'Cloud & Platforms', 'Advisory'];
const CELL_NOTES = {
    '1-0': 'ITGC/ITAC audits, ICFR consulting, BPM/RCM design — banking, retail, energy, telecom',
    '1-1': 'CAATs via Alteryx on 100K+ records, PySpark on Cloudera/Hive, analytics champion',
    '1-2': 'Cloudera/Hive, SAP & non-SAP system configurations and access testing',
    '1-3': 'Client IT controls consulting, colleague training & enablement, analytics adoption lead',
    '2-0': 'Taught system analysis, enterprise architecture, SDLC frameworks to students',
    '2-1': 'Mentored database systems, algorithms, UX/UI design, data-centric coursework',
    '2-2': '—',
    '2-3': 'Structured feedback, project milestone guidance, cross-group coordination over 2 years',
    '3-0': 'Supported IT governance documentation and audit coordination',
    '3-1': 'Requirement analysis, competitor benchmarking, process mapping for IoT platform',
    '3-2': '—',
    '3-3': 'User research, stakeholder interviews, feature & subscription definition',
    '4-0': 'IT data governance, audit coordination, operational documentation',
    '4-1': 'Python log-processing scripts, Grafana data integration, ~30% faster incident response',
    '4-2': 'Grafana + Telegram Bot API, platform monitoring, cloud alert integration',
    '4-3': 'Cross-team IT ops coordination, reporting, structured documentation',
    '5-0': '—',
    '5-1': '—',
    '5-2': '—',
    '5-3': 'User segmentation, MVP definition, product concept for fintech prototype',
    '6-0': '—',
    '6-1': 'GCP fundamentals, FastAPI + ML model integration, data pipelines',
    '6-2': 'Google Cloud Platform, Cloud Run, Firestore, cloud-native deployment',
    '6-3': 'Team collaboration on Bangkit capstone, structured self-paced learning program',
};

// ===== Graph constants (Feature L) =====
const GRAPH_TECH_LIMIT = 11;
const GRAPH_W = 960;
const GRAPH_H = 460;
const PROJ_RING_R = 178; // fixed radius for project nodes

// ===== Education =====
async function renderEducation() {
    const container = document.getElementById('education');
    if (!container) return;
    container.innerHTML = createSkeleton();
    const data = await fetchJSON('data/education.json');
    if (!data) { container.innerHTML = sectionShell('01', 'Education', createErrorCard('education')); return; }
    const rows = (data || []).map(edu => `
        <div class="edu-item slide-in">
            <div>
                <div class="edu-period">${edu.period || ''}</div>
                <div class="edu-school">${edu.institution || ''}</div>
            </div>
            <div>
                <div class="edu-degree">${edu.degree || ''}</div>
                ${edu.gpa ? `<div class="edu-meta">GPA ${edu.gpa}</div>` : ''}
                ${edu.coursework ? `<div class="edu-coursework"><strong>Coursework:</strong>${edu.coursework.split(' · ').map(c=>`<span class="edu-cw-cluster">${c}</span>`).join('')}</div>` : ''}
            </div>
        </div>`).join('');
    container.innerHTML = sectionShell('01', 'Education', `<div>${rows}</div>`);
    observeSlideIns(container);
}

// ===== Experiences (with matrix) =====
async function renderExperiences() {
    const container = document.getElementById('experiences');
    if (!container) return;
    container.innerHTML = createSkeleton();
    const data = await fetchJSON('data/experiences.json');
    if (!data) { container.innerHTML = sectionShell('03', 'Work', createErrorCard('experiences')); return; }

    const matrix = buildSkillMatrix(data);
    const rows = (data || []).map(exp => {
        const tags = (exp.tags || []).map(t => `<span class="exp-tag">${t}</span>`).join('');
        const body = exp.id === 1 ? renderPwCDescriptionSections(exp.description || []) : renderBulletList(exp.description || []);
        const logo = exp.logo ? `<div class="exp-logo-wrap"><img src="${exp.logo}" alt="${getCompanyShort(exp.company)} logo" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : '';
        return `
            <div class="exp-item slide-in">
                <div>
                    ${logo}
                    <div class="exp-period">${formatPeriod(exp.period)}</div>
                    <div class="exp-company">${getCompanyShort(exp.company)}</div>
                </div>
                <div>
                    <div class="exp-title">${exp.title || ''}</div>
                    ${tags ? `<div class="exp-tags">${tags}</div>` : ''}
                    ${body}
                </div>
            </div>`;
    }).join('');

    container.innerHTML = sectionShell('03', 'Work', matrix + `<div class="exp-list">${rows}</div>`);
    observeSlideIns(container);
    observeStaggerItems(container);
    setupMatrixInteractions(container);
}

function buildSkillMatrix(experiences) {
    const cols = experiences.map(exp => ({
        id: exp.id,
        short: getCompanyShort(exp.company).split(' ')[0],
    }));

    const colHeaders = `<div class="matrix-corner"></div>` +
        cols.map(c => `<div class="matrix-col-hdr">${c.short}</div>`).join('');

    const bodyRows = SKILL_CATS.map((cat, ci) =>
        `<div class="matrix-row-hdr">${cat}</div>` +
        cols.map(col => {
            const level = (EXP_MATRIX[col.id] || [])[ci] || 0;
            const note  = CELL_NOTES[`${col.id}-${ci}`] || '—';
            const circ  = (level * 50.27).toFixed(1);
            return `
                <div class="matrix-cell" data-note="${note.replace(/"/g, '&quot;')}" data-level="${level.toFixed(2)}">
                    <svg viewBox="0 0 24 24" width="24" height="24" class="matrix-svg">
                        <circle cx="12" cy="12" r="8" class="dot-track"/>
                        <circle cx="12" cy="12" r="8" class="dot-fill"
                            stroke-dasharray="${circ} 50.27"
                            stroke-dashoffset="12.57"/>
                    </svg>
                </div>`;
        }).join('')
    ).join('');

    return `
        <div class="exp-matrix-wrap">
            <div class="matrix-hdr-row">
                <span class="matrix-label">Skill intensity by role</span>
                <span class="matrix-legend">
                    <span>● full</span><span>◕ med</span><span>○ low</span>
                </span>
            </div>
            <div class="matrix-grid" style="grid-template-columns:130px repeat(${cols.length},1fr)">
                ${colHeaders}${bodyRows}
            </div>
            <div class="matrix-note" id="matrix-note">Hover a cell to see the specific work</div>
        </div>`;
}

function setupMatrixInteractions(container) {
    const note = container.querySelector('#matrix-note');
    container.querySelectorAll('.matrix-cell').forEach(cell => {
        cell.addEventListener('mouseenter', () => {
            const txt = cell.dataset.note;
            if (!txt || txt === '—') return;
            note.textContent = txt;
            note.classList.add('active');
        });
        cell.addEventListener('mouseleave', () => {
            note.classList.remove('active');
            note.textContent = 'Hover a cell to see the specific work';
        });
    });
}

function renderBulletList(items) {
    if (!items.length) return '';
    return `<ul class="exp-bullets">${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
}
function renderPwCDescriptionSections(description) {
    const sections = [
        { label: 'IT Audit & Assurance',                        items: description.slice(0, 3) },
        { label: 'ICFR Implementation & IT Controls Consulting', items: description.slice(3, 5) },
        { label: 'Internal Initiatives',                         items: description.slice(5) }
    ];
    return sections.map(s => `
        <div class="exp-sublabel">${s.label}</div>
        <ul class="exp-bullets">${s.items.map(i => `<li>${i}</li>`).join('')}</ul>`).join('');
}
function formatPeriod(p = '') {
    return p.replace('July','Jul').replace('September','Sep').replace('January','Jan')
            .replace('February','Feb').replace('December','Dec').replace('June','Jun');
}
function getCompanyShort(c = '') { return c.split(' - ')[0].trim(); }

// ===== Projects (Force graph, Feature L) =====
function getProjectColorName(project) {
    if (project.status === 'in-progress')            return 'amber';
    if (project.group === 'Data & Analytics')        return 'green';
    if (project.group === 'Cloud & Machine Learning') return 'blue';
    return 'muted';
}

function shortenTitle(title) {
    const stop = new Set(['&','-','—','and','for','the','of','a','an','to','in','based']);
    return title.split(/[\s\-—]+/).filter(w => w && !stop.has(w.toLowerCase())).slice(0, 3).join(' ');
}

function buildGraphData(projects) {
    const freq = {};
    projects.forEach(p => (p.tags || []).forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
    const topTechs = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,GRAPH_TECH_LIMIT).map(([t])=>t);

    const nodes = [], edges = [], nodeMap = {};
    projects.forEach((p, i) => {
        const n = { id:p.id, type:'project', label:shortenTitle(p.title),
                    colorName:getProjectColorName(p), r:22, mass:5,
                    x:0, y:0, vx:0, vy:0, project:p, num:i+1 };
        nodes.push(n); nodeMap[p.id] = n;
    });
    topTechs.forEach(tech => {
        const n = { id:`tech:${tech}`, type:'tech', label:tech, freq:freq[tech],
                    r:Math.max(5,Math.min(10,4+freq[tech]*2)), mass:1,
                    x:0, y:0, vx:0, vy:0 };
        nodes.push(n); nodeMap[n.id] = n;
    });
    projects.forEach(p => (p.tags||[]).forEach(tag => {
        if (topTechs.includes(tag)) edges.push({ source:p.id, target:`tech:${tag}` });
    }));
    return { nodes, edges, nodeMap };
}

function runForceSimulation(nodes, edges, W, H) {
    const nodeMap = {};
    nodes.forEach(n => nodeMap[n.id] = n);

    const proj = nodes.filter(n => n.type === 'project');
    const tech = nodes.filter(n => n.type === 'tech');

    // Project nodes are FIXED on an outer ring — they never move
    proj.forEach((n, i) => {
        const a = (2 * Math.PI * i / proj.length) - Math.PI / 2;
        n.x = W / 2 + PROJ_RING_R * Math.cos(a);
        n.y = H / 2 + PROJ_RING_R * Math.sin(a);
        n.fixed = true;
    });

    // Tech nodes start near the center with spread
    tech.forEach((n, i) => {
        const a = (2 * Math.PI * i / tech.length);
        const r = 50 + (i % 3) * 25;
        n.x = W / 2 + r * Math.cos(a);
        n.y = H / 2 + r * Math.sin(a);
        n.fixed = false;
    });

    // Only tech nodes participate in simulation
    for (let iter = 0; iter < 400; iter++) {
        const k = Math.max(0.005, 0.5 * Math.exp(-iter * 0.012));

        // Repulsion between all tech nodes
        for (let i = 0; i < tech.length; i++) {
            for (let j = i + 1; j < tech.length; j++) {
                const a = tech[i], b = tech[j];
                const dx = (b.x - a.x) || 0.1, dy = (b.y - a.y) || 0.1;
                const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
                const f = (900 / d / d) * k;
                a.vx -= dx / d * f; a.vy -= dy / d * f;
                b.vx += dx / d * f; b.vy += dy / d * f;
            }
        }

        // Spring: pull tech toward connected project nodes
        edges.forEach(({ source, target }) => {
            const proj_n = nodeMap[source], tech_n = nodeMap[target];
            if (!proj_n || !tech_n || tech_n.fixed) return;
            const dx = proj_n.x - tech_n.x, dy = proj_n.y - tech_n.y;
            const d = Math.sqrt(dx * dx + dy * dy) + 0.01;
            const rest = PROJ_RING_R * 0.55; // pull tech toward inner zone
            const disp = (d - rest) * 0.12 * k;
            tech_n.vx += dx / d * disp;
            tech_n.vy += dy / d * disp;
        });

        // Gentle center pull to prevent drift
        tech.forEach(n => {
            n.vx += (W / 2 - n.x) * 0.008 * k;
            n.vy += (H / 2 - n.y) * 0.008 * k;
            n.vx *= 0.78; n.vy *= 0.78;
            n.x += n.vx; n.y += n.vy;
            const pad = n.r + 12;
            n.x = Math.max(pad, Math.min(W - pad, n.x));
            n.y = Math.max(pad, Math.min(H - pad, n.y));
        });

        // Tech-tech separation
        for (let i = 0; i < tech.length; i++) {
            for (let j = i + 1; j < tech.length; j++) {
                const a = tech[i], b = tech[j];
                const dx = (b.x - a.x) || 0.01, dy = (b.y - a.y) || 0.01;
                const d = Math.sqrt(dx * dx + dy * dy);
                const min = a.r + b.r + 10;
                if (d < min) {
                    const c = (min - d) / 2 / d;
                    a.x -= dx * c; a.y -= dy * c;
                    b.x += dx * c; b.y += dy * c;
                }
            }
        }
    }
}

function buildGraphHTML(nodes, edges, nodeMap) {
    const cx = GRAPH_W / 2, cy = GRAPH_H / 2;

    const edgeSVG = edges.map(({ source, target }) => {
        const a = nodeMap[source], b = nodeMap[target];
        if (!a || !b) return '';
        return `<line class="graph-edge" data-source="${source}" data-target="${target}"
                     x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}"
                     x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}"/>`;
    }).join('');

    const nodeSVG = nodes.map(n => {
        const tx = n.x.toFixed(1), ty = n.y.toFixed(1);

        if (n.type === 'project') {
            // Label points outward from the center of the ring
            const angle  = Math.atan2(n.y - cy, n.x - cx);
            const outDist = n.r + 14;
            const lx = Math.cos(angle) * outDist;
            const ly = Math.sin(angle) * outDist;
            const anchor = Math.abs(Math.cos(angle)) < 0.35
                ? 'middle'
                : Math.cos(angle) > 0 ? 'start' : 'end';

            const words = n.label.split(' ');
            // Split into max 2 lines
            const half = Math.ceil(words.length / 2);
            const l1   = words.slice(0, half).join(' ');
            const l2   = words.slice(half).join(' ');
            const lineH = 12;
            // Vertical centering for multi-line: shift up by half the total height
            const totalH = l2 ? lineH : 0;
            const labelSVG = l2
                ? `<tspan x="${lx.toFixed(1)}" dy="${(ly - totalH / 2).toFixed(1)}">${l1}</tspan>
                   <tspan x="${lx.toFixed(1)}" dy="${lineH}">${l2}</tspan>`
                : `<tspan x="${lx.toFixed(1)}" dy="${ly.toFixed(1)}">${l1}</tspan>`;

            return `<g class="graph-node graph-project" data-id="${n.id}"
                       transform="translate(${tx},${ty})" tabindex="0" role="button">
                        <circle r="${n.r}" class="proj-circle proj-circle-${n.colorName}" data-color="${n.colorName}"/>
                        <text class="graph-proj-label" text-anchor="${anchor}">${labelSVG}</text>
                    </g>`;
        } else {
            return `<g class="graph-node graph-tech" data-id="${n.id}"
                       transform="translate(${tx},${ty})">
                        <circle r="${n.r}" class="tech-circle"/>
                        <text class="graph-tech-label" text-anchor="middle" dy="${n.r + 11}">${n.label}</text>
                    </g>`;
        }
    }).join('');

    return `
        <svg class="proj-graph-svg" viewBox="0 0 ${GRAPH_W} ${GRAPH_H}"
             width="100%" height="${GRAPH_H}"
             role="img" aria-label="Project-technology graph">
            <g class="graph-edges">${edgeSVG}</g>
            <g class="graph-nodes">${nodeSVG}</g>
        </svg>
        <div class="graph-hint">Hover tech nodes · Click project to explore</div>`;
}

function setupGraphInteractions(container, nodes, nodeMap, onActivate) {
    const svg = container.querySelector('.proj-graph-svg');
    if (!svg) return;
    const edgeEls    = Array.from(svg.querySelectorAll('.graph-edge'));
    const nodeEls    = Array.from(svg.querySelectorAll('.graph-node'));
    const projEls    = Array.from(svg.querySelectorAll('.graph-project'));
    const techEls    = Array.from(svg.querySelectorAll('.graph-tech'));

    const clearState = () => {
        edgeEls.forEach(e => e.classList.remove('is-dim','is-lit'));
        nodeEls.forEach(n => n.classList.remove('is-dim','is-lit'));
    };
    const dimAll = () => {
        edgeEls.forEach(e => e.classList.add('is-dim'));
        nodeEls.forEach(n => n.classList.add('is-dim'));
    };

    techEls.forEach(el => {
        const id = el.dataset.id;
        el.addEventListener('mouseenter', () => {
            dimAll();
            edgeEls.forEach(e => {
                if (e.dataset.target === id) {
                    e.classList.remove('is-dim'); e.classList.add('is-lit');
                    svg.querySelector(`[data-id="${e.dataset.source}"]`)?.classList.remove('is-dim');
                }
            });
            el.classList.remove('is-dim'); el.classList.add('is-lit');
        });
        el.addEventListener('mouseleave', clearState);
    });

    projEls.forEach(el => {
        const id = el.dataset.id;
        el.addEventListener('mouseenter', () => {
            dimAll();
            edgeEls.forEach(e => {
                if (e.dataset.source === id) {
                    e.classList.remove('is-dim'); e.classList.add('is-lit');
                    svg.querySelector(`[data-id="${e.dataset.target}"]`)?.classList.remove('is-dim');
                }
            });
            el.classList.remove('is-dim'); el.classList.add('is-lit');
        });
        el.addEventListener('mouseleave', clearState);
        el.addEventListener('click', () => {
            projEls.forEach(e => e.classList.remove('is-selected'));
            el.classList.add('is-selected');
            const n = nodeMap[id];
            if (n) onActivate(n.project, n.num);
        });
        el.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); el.click(); } });
    });
}

function activateGraphDetail(container, project, num) {
    const wrapper = container.querySelector('.proj-graph-detail');
    if (!wrapper) return;
    const colorName = getProjectColorName(project);
    const isFirst   = wrapper.hasAttribute('hidden');

    const render = () => {
        wrapper.removeAttribute('hidden');
        wrapper.innerHTML = `
            <div class="proj-detail c-${colorName}">
                <div class="proj-detail-top-line"></div>
                ${renderDetailPanel(project, num)}
            </div>`;
        setTimeout(() => wrapper.scrollIntoView({ behavior:'smooth', block:'nearest' }), 100);
    };

    if (isFirst) {
        render();
    } else {
        const detailEl = wrapper.querySelector('.proj-detail');
        if (detailEl) detailEl.classList.add('switching');
        setTimeout(render, 160);
    }
}

function renderCaseStudyRows(caseStudy) {
    if (!caseStudy) return '';
    const rows = [
        {label:'Context', text:caseStudy.context},
        {label:'My role', text:caseStudy.role},
        {label:'Outcome', text:caseStudy.outcome},
    ].filter(r=>r.text);
    return rows.length ? `<div class="proj-detail-case">${rows.map(r=>`
        <div class="case-row"><span class="case-label">${r.label}</span><span class="case-text">${r.text}</span></div>`).join('')}</div>` : '';
}

function renderProjectLinksOrNote(project) {
    const linkDefs = [{key:'code',label:'Code'},{key:'demo',label:'Demo'},{key:'doc',label:'Docs'},{key:'website',label:'Website'}];
    const links = linkDefs.filter(d=>project[d.key]).map(d=>`<a href="${project[d.key]}" class="project-link" target="_blank" rel="noopener">↗ ${d.label}</a>`).join('');
    if (links) return `<div class="proj-detail-links">${links}</div>`;
    return project.note ? `<p class="proj-note">${project.note}</p>` : '';
}

function renderDetailPanel(project, num) {
    const isWIP  = project.status === 'in-progress';
    const isPwC  = (project.id||'').includes('pwc');
    const badge  = isWIP ? `<span class="proj-detail-badge wip">● In progress</span>`
                 : isPwC ? `<span class="proj-detail-badge pwc">PwC engagement</span>` : '';
    const stack = (project.tags||[]).map(t=>`<span>${t}</span>`).join('');

    return `
        <div class="proj-detail-inner">
            <div class="proj-detail-num">${String(num).padStart(2,'0')}</div>
            <div class="proj-detail-meta">
                <span class="proj-detail-type">${project.type||project.group||''}</span>${badge}
            </div>
            <h3 class="proj-detail-title">${project.title||''}</h3>
            <p class="proj-detail-desc">${project.description||project.summary||''}</p>
            ${renderCaseStudyRows(project.caseStudy)}
            ${stack?`<div class="proj-detail-stack">${stack}</div>`:''}
            ${renderProjectLinksOrNote(project)}
        </div>`;
}

function renderFlagshipCard(project) {
    if (!project) return '';
    const isWIP = project.status === 'in-progress';
    const badge = isWIP ? `<span class="proj-detail-badge wip">● In progress</span>` : '';
    const stack = (project.tags||[]).map(t=>`<span>${t}</span>`).join('');
    const media = project.image
        ? `<div class="proj-flagship-media"><img src="${project.image}" alt="${project.title||''} screenshot" loading="lazy" onerror="this.closest('.proj-flagship-media').style.display='none'"></div>`
        : '';

    return `
        <div class="proj-flagship">
            <div class="proj-flagship-glow"></div>
            ${media}
            <div class="proj-flagship-body">
                <div class="proj-flagship-eyebrow">Flagship project</div>
                <div class="proj-detail-meta">
                    <span class="proj-detail-type">${project.type||project.group||''}</span>${badge}
                </div>
                <h3 class="proj-flagship-title">${project.title||''}</h3>
                <p class="proj-flagship-desc">${project.description||project.summary||''}</p>
                ${renderCaseStudyRows(project.caseStudy)}
                ${stack?`<div class="proj-detail-stack">${stack}</div>`:''}
                ${renderProjectLinksOrNote(project)}
            </div>
        </div>`;
}

function setupTilt(el, max = 6) {
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (py - 0.5) * -2 * max;
        const ry = (px - 0.5) * 2 * max;
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}

async function renderProjects() {
    const container = document.getElementById('projects');
    if (!container) return;
    container.innerHTML = createSkeleton();
    const data = await fetchJSON('data/projects.json');
    if (!data) { container.innerHTML = sectionShell('04', 'Selected projects', createErrorCard('projects')); return; }

    const flagship = data.find(p => p.flagship);
    const graphProjects = data.filter(p => !p.flagship);

    const cvUrl  = document.body?.dataset?.cvUrl || '';
    const cvLink = cvUrl ? `<div class="proj-cv-row"><a href="${cvUrl}" class="btn-ghost" target="_blank" rel="noopener">↓ Download CV</a></div>` : '';

    container.innerHTML = sectionShell('04', 'Selected projects', `
        ${renderFlagshipCard(flagship)}
        <div class="proj-graph-container"></div>
        <div class="proj-graph-detail" hidden></div>
        ${cvLink}
    `);

    setupTilt(container.querySelector('.proj-flagship'));

    // Build graph after DOM is laid out so clientWidth is accurate
    setTimeout(() => {
        const graphContainer = container.querySelector('.proj-graph-container');
        const { nodes, edges, nodeMap } = buildGraphData(graphProjects);
        runForceSimulation(nodes, edges, GRAPH_W, GRAPH_H);
        graphContainer.innerHTML = buildGraphHTML(nodes, edges, nodeMap);
        setupGraphInteractions(graphContainer, nodes, nodeMap, (project, num) => {
            activateGraphDetail(container, project, num);
        });
    }, 0);
}

// ===== Skills =====
async function renderSkills() {
    const section = document.getElementById('skills');
    if (!section) return;
    section.innerHTML = createSkeleton();
    const data = await fetchJSON('data/skills.json');
    if (!data) { section.innerHTML = sectionShell('02', 'Skills', createErrorCard('skills')); return; }

    const hiGov  = new Set(['ITGC / ITAC testing','ICFR (BPM & RCM design)','Audit analytics & CAATs']);
    const hiData = new Set(['Python (Pandas, NumPy)','PySpark','SQL','Alteryx']);
    const hiCloud= new Set(['Google Cloud (Skill Badges)','Cloudera']);
    function tagCls(s,i) {
        if (i===0&&hiGov.has(s))  return ' hi';
        if (i===1&&hiData.has(s)) return ' hi';
        if (i===2&&hiCloud.has(s))return ' hib';
        return '';
    }

    const skillsGrid = `<div class="skills-grid">${(data.professionalSkills||[]).map((cat,i)=>`
        <div class="skill-cat stagger-item">
            <div class="skill-cat-title">${cat.category}</div>
            <div class="skill-tags">${(cat.skills||[]).map(s=>`<span class="skill-tag${tagCls(s,i)}">${s}</span>`).join('')}</div>
        </div>`).join('')}</div>`;

    const credentialsHTML = (data.credentials||[]).length ? `
        <div class="subsection-label">Credentials</div>
        <div class="honors-grid">${(data.credentials||[]).map(c=>`
            <div class="honor-item stagger-item">
                <div class="honor-title">${c.title}</div>
                <div class="honor-meta">${c.date} · ${c.issuer}</div>
                ${c.url ? `<a href="${c.url}" class="project-link" target="_blank" rel="noopener">↗ Verify</a>` : ''}
            </div>`).join('')}</div>` : '';

    const honorsHTML = (data.honorsAwards||[]).length ? `
        <div class="subsection-label">Honors &amp; Awards</div>
        <div class="honors-grid">${(data.honorsAwards||[]).map(h=>`
            <div class="honor-item stagger-item">
                <div class="honor-title">${h.title}</div>
                <div class="honor-meta">${h.date} · ${h.issuer}</div>
                <div class="honor-desc">${h.description}</div>
            </div>`).join('')}</div>` : '';

    section.innerHTML = sectionShell('02', 'Skills', skillsGrid + credentialsHTML + honorsHTML);
    observeStaggerItems(section);
}

// ===== Helpers =====
function sectionShell(num, title, body) {
    return `<div class="section-header anim"><span class="section-num">${num}</span><h2 class="section-title">${title}</h2></div>${body}`;
}

function observeStaggerItems(container) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    container.querySelectorAll('.stagger-item').forEach(el => io.observe(el));
}
function observeSlideIns(container) {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    container.querySelectorAll('.slide-in').forEach((el,i) => { el.style.transitionDelay=`${i*0.08}s`; io.observe(el); });
}
function setupGlobalAnimations() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('section.fade-in').forEach(s => io.observe(s));
    document.querySelectorAll('.section-header.anim').forEach(h => io.observe(h));
    setupScrambleObserver();
}

// ===== Lenis =====
function initLenis() {
    if (typeof Lenis === 'undefined') return;
    const lenis = new Lenis({ duration: 0.75 });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
}

// ===== Counters =====
function animateCounters() {
    document.querySelectorAll('.stat-num[data-count]').forEach(el => {
        const target=parseFloat(el.dataset.count), prefix=el.dataset.prefix||'',
              suffix=el.dataset.suffix||'', decimals=parseInt(el.dataset.decimals||'0',10);
        const duration=1600, start=performance.now();
        const tick = now => {
            const p = Math.min((now-start)/duration,1);
            const e = 1-Math.pow(1-p,3);
            el.textContent = prefix+(target*e).toFixed(decimals)+suffix;
            if (p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    });
}

// ===== Scramble =====
const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$!%&*';
function scrambleText(el, duration=850) {
    if (el._sFrame) { cancelAnimationFrame(el._sFrame); el._sFrame=null; }
    const original = el._sOriginal || el.textContent;
    el._sOriginal = original;
    const len = original.length;
    const isAlphaNum = c => /[a-zA-Z0-9]/.test(c);
    let t0=null;
    const animate = ts => {
        if (!t0) t0=ts;
        const progress = Math.min((ts-t0)/duration,1);
        const revealed = Math.floor(progress*len);
        let out='';
        for (let i=0;i<len;i++) {
            const c=original[i];
            out += (!isAlphaNum(c)||i<revealed) ? c : SCRAMBLE_CHARS[Math.floor(Math.random()*SCRAMBLE_CHARS.length)];
        }
        el.textContent=out;
        if (progress<1) { el._sFrame=requestAnimationFrame(animate); }
        else { el.textContent=original; el._sFrame=null; el._sOriginal=null; }
    };
    el._sFrame=requestAnimationFrame(animate);
}
function setupScrambleObserver() {
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => { if (e.isIntersecting) { scrambleText(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.35 });
    document.querySelectorAll('.section-title').forEach(el => io.observe(el));
}

// ===== Nav =====
function headerScrollEffect() {
    const nav = document.getElementById('header');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
}
function setupActiveNav() {
    const links   = Array.from(document.querySelectorAll('.nav-links a'));
    const sections= Array.from(document.querySelectorAll('section[id]'));
    const setActive = id => links.forEach(l => l.classList.toggle('active', l.getAttribute('href')===`#${id}`));
    links.forEach(l => l.addEventListener('click', () => {
        const id=(l.getAttribute('href')||'').replace('#',''); if (id) setActive(id);
    }));
    const update = () => {
        let current=sections[0]?.id;
        sections.forEach(s => { if (s.getBoundingClientRect().top-110<=0) current=s.id; });
        if (current) setActive(current);
    };
    update();
    window.addEventListener('scroll', debounce(update,80), { passive:true });
}

// ===== Bootstrap =====
async function loadContent() {
    await Promise.all([renderEducation(), renderExperiences(), renderProjects(), renderSkills()]);
    setupGlobalAnimations();
}
document.addEventListener('DOMContentLoaded', async () => {
    initLenis();
    await loadContent();
    headerScrollEffect();
    setupActiveNav();
    setTimeout(() => {
        animateCounters();
        const eyebrow = document.querySelector('.hero-eyebrow');
        if (eyebrow) scrambleText(eyebrow, 700);
    }, 900);
    window.addEventListener('scroll', debounce(headerScrollEffect,80), { passive:true });
});
