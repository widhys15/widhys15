// ===== Utilities =====
// Fetch JSON with a soft failure (returns null on error).
async function fetchJSON(url) {
    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            console.warn(`Could not load ${url}. Status: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
        return null;
    }
}

// Create HTML for a list of badges (chips).
function renderBadges(tags = [], limit = null) {
    if (!tags.length) return '';
    const safeTags = Number.isInteger(limit) ? tags.slice(0, limit) : tags;
    return `
        <div class="badge-container">
            ${safeTags.map(tag => `<span class="badge">${tag}</span>`).join('')}
        </div>
    `;
}

// ===== Education =====
async function renderEducation() {
    const container = document.getElementById('education');
    if (!container) return;

    const data = await fetchJSON('data/education.json');
    let html = `
        <h2>Education</h2>
        <p>My academic background and achievements.</p>
    `;

    if (data && data.length) {
        data.forEach(edu => {
            html += `
                <div class="card">
                    <h3>${edu.degree}</h3>
                    <div class="card-subtitle">${edu.institution} (${edu.period})</div>
                    ${edu.gpa ? `<div class="badge-container"><span class="badge">GPA: ${edu.gpa}</span></div>` : ''}
                    ${edu.coursework ? `<p><strong>Related coursework:</strong></p><p>${edu.coursework}</p>` : ''}
                </div>
            `;
        });
    } else {
        html += `
            <div class="card">
                <h3>Bachelor of Science in Information System and Technology</h3>
                <div class="card-subtitle">Bandung Institute of Technology (2020 - 2024)</div>
                <div class="badge-container"><span class="badge">GPA: 3.7/4.0</span></div>
                <p><strong>Related coursework:</strong></p>
                <p>Data Structures, Algorithms, Database Systems, Web Programming, Software Engineering, Data Analytics, Machine Learning, IT Project Management</p>
            </div>
        `;
    }

    container.innerHTML = html;
}

// ===== Experiences =====
// Renders a simple timeline-style list of cards.
async function renderExperiences() {
    const container = document.getElementById('experiences');
    if (!container) return;

    const data = await fetchJSON('data/experiences.json');
    let html = `
        <h2>Experiences</h2>
        <p>My professional journey and work experiences.</p>
    `;

    if (data && data.length) {
        data.forEach(exp => {
            const initials = getCompanyInitials(exp.company || '');
            html += `
                <div class="card">
                    <div class="exp-header">
                        <div class="exp-logo">
                            ${exp.logo ? `<img src="${exp.logo}" alt="${exp.company} logo" loading="lazy">` : `<span>${initials}</span>`}
                        </div>
                        <div class="exp-meta">
                            <h3>${exp.title}</h3>
                            <div class="card-subtitle">${exp.company}</div>
                            <div class="card-date">${exp.period}</div>
                        </div>
                    </div>
                    ${renderBadges(exp.tags)}
                    ${Array.isArray(exp.description) ? `
                        <ul class="content-list">
                            ${exp.description.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `;
        });
    } else {
        html += `
            <div class="card">
                <h3>Assurance Associate</h3>
                <div class="card-subtitle">PwC Indonesia - Jakarta, Indonesia</div>
                <div class="card-date">July 2024 - Present</div>
                <div class="badge-container">
                    <span class="badge">IT Audit</span>
                    <span class="badge">Data Analytics</span>
                    <span class="badge">Machine Learning</span>
                </div>
                <ul class="content-list">
                    <li>Conducted end-to-end IT audits across multiple industries.</li>
                    <li>Automated audit data workflows with Alteryx.</li>
                    <li>Built scalable ML pipelines in PySpark.</li>
                </ul>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Create 2-letter initials for a company name.
function getCompanyInitials(company = '') {
    const base = company.split('-')[0].trim();
    const words = base.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean);
    const initials = words.slice(0, 2).map(word => word[0]).join('').toUpperCase();
    return initials || 'CO';
}

// ===== Projects =====
// Renders projects in a responsive grid.
async function renderProjects() {
    const container = document.getElementById('projects');
    if (!container) return;

    const data = await fetchJSON('data/projects.json');
    const cvUrl = document.body?.dataset?.cvUrl || '';
    const groupOrder = [
        'Data & Analytics',
        'Systems & Architecture',
        'Cloud & Machine Learning',
        'Backend / APIs',
        'Product & Fintech'
    ];
    const filterOptions = [
        { key: 'all', label: 'All', group: null },
        { key: 'data', label: 'Data & Analytics', group: 'Data & Analytics' },
        { key: 'systems', label: 'Systems', group: 'Systems & Architecture' },
        { key: 'cloud', label: 'Cloud/ML', group: 'Cloud & Machine Learning' },
        { key: 'backend', label: 'Backend', group: 'Backend / APIs' },
        { key: 'product', label: 'Product', group: 'Product & Fintech' }
    ];
    let html = `
        <h2>Projects</h2>
        <p>Selected work focused on audit analytics, data engineering, and systems that turn messy data into decisions.</p>
        <div class="projects-tldr">
            <div class="tldr-items">
                <span>Risk Assurance Associate · PwC Indonesia</span>
                <span>Scale: 1M+ monthly banking records</span>
                <span>Domains: Data pipelines • Systems • Cloud/ML</span>
            </div>
            <div class="tldr-actions">
                <a href="#featured-projects" class="tldr-link">View featured</a>
                ${cvUrl ? `<a href="${cvUrl}" class="tldr-link" target="_blank" rel="noopener">Download CV</a>` : ''}
            </div>
        </div>
        <div class="projects-filters">
            ${filterOptions.map(option => `
                <button class="filter-chip${option.key === 'all' ? ' is-active' : ''}" data-filter="${option.key}" data-group="${option.group || ''}">
                    ${option.label}
                </button>
            `).join('')}
        </div>
        <div class="what-i-do">
            <h3>What I Do</h3>
            <ul class="what-i-do-list">
                <li>Build scalable data pipelines and analytics workflows for regulated environments.</li>
                <li>Design systems that connect data, processes, and technology across teams.</li>
                <li>Apply audit, governance, and engineering thinking to real-world problems.</li>
            </ul>
        </div>
    `;

    if (data && data.length) {
        const featured = data.filter(project => project.featured);
        if (featured.length) {
            html += `
                <div class="featured-projects" id="featured-projects">
                    <div class="featured-header">
                        <h3>Featured Projects</h3>
                        <p>High-impact work where I led the core data, system, and delivery pieces.</p>
                    </div>
                    <div class="featured-projects-grid">
                        ${featured.map(project => `
                            ${renderProjectCard(project, { featured: true })}
                        `).join('')}
                    </div>
                </div>
            `;
        }

        groupOrder.forEach(group => {
            const grouped = data
                .filter(project => project.group === group)
                .sort((a, b) => {
                    if (Number.isFinite(a.priority) && Number.isFinite(b.priority)) {
                        return a.priority - b.priority;
                    }
                    if (Number.isFinite(a.priority)) return -1;
                    if (Number.isFinite(b.priority)) return 1;
                    return 0;
                });
            if (!grouped.length) return;
            html += `
                <div class="project-group" data-group="${group}">
                    <div class="project-group-header">
                        <h3>${group}</h3>
                    </div>
                    <div class="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        ${grouped.map((project, index) => `
                            ${renderProjectCard(project, { index })}
                        `).join('')}
                    </div>
                    <div class="project-group-actions">
                        <button class="show-more-btn" data-action="toggle-group" data-group="${group}">
                            Show more
                        </button>
                    </div>
                </div>
            `;
        });
    } else {
        html += `
            <div class="card">
                <h3>Sample Project</h3>
                <div class="card-subtitle">WEB APP</div>
                <div class="badge-container"><span class="badge">JavaScript</span><span class="badge">UI/UX</span></div>
                <p class="project-description">A short description of a past project.</p>
            </div>
        `;
    }

    container.innerHTML = html;
    if (!document.getElementById('project-modal')) {
        document.body.insertAdjacentHTML('beforeend', renderProjectModalShell());
    }
    setupProjectModal(document, data || []);
    setupProjectGroups(container);
    setupProjectFilters(container);
}

function renderProjectCard(project, { featured = false, index = 0 } = {}) {
    const limitedTags = renderBadges(project.tags, 5);
    const hideByDefault = index > 1 && !featured ? ' is-hidden' : '';
    return `
        <div class="card project-card flex flex-col h-full${featured ? ' featured-card' : ''}${hideByDefault}" id="project-${project.id}" data-project-id="${project.id}">
            <div class="project-media flex justify-center items-center py-8">
                ${project.image ? `
                    <img src="${project.image}" alt="${project.title} Screenshot" class="object-contain max-h-32 w-auto" loading="lazy">
                ` : `
                    <div class="w-full h-32 flex items-center justify-center text-4xl text-gray-600">
                        <i class="fa-solid fa-image"></i>
                    </div>
                `}
            </div>
            <div class="project-content flex flex-col flex-1 px-6 pt-4 pb-0">
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    ${project.type ? `<div class="project-type">${project.type}</div>` : ''}
                    ${project.impact ? `<p class="project-subtitle">${project.impact}</p>` : ''}
                </div>
                ${limitedTags ? `<div class="tags-compact">${limitedTags}</div>` : ''}
                <div class="card-hint">Click for details</div>
            </div>
        </div>
    `;
}

function renderCaseStudy(caseStudy = {}) {
    if (!caseStudy || (!caseStudy.context && !caseStudy.role && !caseStudy.outcome)) {
        return '';
    }
    const rows = [
        { label: 'Context', text: caseStudy.context },
        { label: 'My role', text: caseStudy.role },
        { label: 'Outcome', text: caseStudy.outcome }
    ].filter(row => row.text);

    if (!rows.length) return '';

    return `
        <div class="project-case">
            ${rows.map(row => `
                <div class="case-row">
                    <span class="case-label">${row.label}</span>
                    <span class="case-text">${row.text}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderProjectModalShell() {
    return `
        <div class="project-modal" id="project-modal" aria-hidden="true">
            <div class="project-modal-backdrop" data-action="close-modal"></div>
            <div class="project-modal-card" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
                <button class="modal-close" data-action="close-modal" aria-label="Close project details">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="modal-header">
                    <h3 id="project-modal-title"></h3>
                    <div class="modal-type"></div>
                </div>
                <p class="modal-subtitle"></p>
                <div class="modal-body">
                    <div class="modal-description"></div>
                    <div class="modal-case"></div>
                    <div class="modal-tags"></div>
                    <div class="modal-links"></div>
                </div>
            </div>
        </div>
    `;
}

function setupProjectModal(rootNode, projects = []) {
    const root = rootNode || document;
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    const projectMap = new Map(projects.map(project => [project.id, project]));
    const titleEl = modal.querySelector('#project-modal-title');
    const typeEl = modal.querySelector('.modal-type');
    const subtitleEl = modal.querySelector('.modal-subtitle');
    const descriptionEl = modal.querySelector('.modal-description');
    const caseEl = modal.querySelector('.modal-case');
    const tagsEl = modal.querySelector('.modal-tags');
    const linksEl = modal.querySelector('.modal-links');

    const closeModal = () => {
        modal.classList.remove('is-active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const openModal = (project) => {
        if (!project) return;
        titleEl.textContent = project.title || '';
        typeEl.textContent = project.type || '';
        subtitleEl.textContent = project.impact || '';
        descriptionEl.innerHTML = project.description ? `<p>${project.description}</p>` : '';
        caseEl.innerHTML = project.caseStudy ? renderCaseStudy(project.caseStudy) : '';
        tagsEl.innerHTML = project.tags ? renderBadges(project.tags) : '';
        linksEl.innerHTML = project ? renderProjectLinks(project) : '';

        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    document.addEventListener('click', (event) => {
        const openCard = event.target.closest('.project-card');
        const closeBtn = event.target.closest('[data-action="close-modal"]');
        if (openCard && !closeBtn) {
            const projectId = openCard.getAttribute('data-project-id');
            openModal(projectMap.get(projectId));
        }
        if (closeBtn) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-active')) {
            closeModal();
        }
    });
}

function setupProjectGroups(container) {
    const groups = container.querySelectorAll('.project-group');
    groups.forEach(group => {
        const cards = group.querySelectorAll('.project-card');
        const button = group.querySelector('[data-action="toggle-group"]');
        if (cards.length <= 2 && button) {
            button.classList.add('is-hidden');
        }
    });

    container.addEventListener('click', (event) => {
        const button = event.target.closest('[data-action="toggle-group"]');
        if (!button) return;

        const groupName = button.dataset.group;
        const group = container.querySelector(`.project-group[data-group="${groupName}"]`);
        if (!group) return;

        const hiddenCards = group.querySelectorAll('.project-card.is-hidden');
        const isCollapsed = hiddenCards.length > 0;
        group.querySelectorAll('.project-card').forEach((card, index) => {
            if (index > 1) {
                card.classList.toggle('is-hidden', !isCollapsed);
            }
        });

        button.textContent = isCollapsed ? 'Show less' : 'Show more';
    });
}

function setupProjectFilters(container) {
    const chips = Array.from(container.querySelectorAll('.filter-chip'));
    const groups = Array.from(container.querySelectorAll('.project-group'));
    if (!chips.length || !groups.length) return;

    const setActiveChip = (active) => {
        chips.forEach(chip => chip.classList.toggle('is-active', chip === active));
    };

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const groupName = chip.dataset.group;
            setActiveChip(chip);

            if (!groupName) {
                groups.forEach(group => group.classList.remove('is-hidden'));
                return;
            }

            groups.forEach(group => {
                group.classList.toggle('is-hidden', group.dataset.group !== groupName);
            });

            const target = container.querySelector(`.project-group[data-group="${groupName}"]`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Build project links with icons.
function renderProjectLinks(project) {
    const icons = {
        doc: `<i class="fa-solid fa-file-lines"></i>`,
        code: `<i class="fa-brands fa-github"></i>`,
        demo: `<i class="fa-solid fa-play"></i>`,
        video: `<i class="fa-brands fa-youtube"></i>`,
        website: `<i class="fa-solid fa-globe"></i>`,
        figma: `<i class="fa-brands fa-figma"></i>`
    };

    const labels = {
        doc: 'Documentation',
        code: 'Code',
        demo: 'Demo',
        video: 'Video',
        website: 'Website',
        figma: 'Figma'
    };

    return Object.keys(icons)
        .filter(type => project[type])
        .map(type => `
            <a href="${project[type]}" class="project-link" target="_blank" rel="noopener">
                ${icons[type]} ${labels[type]}
            </a>
        `)
        .join('');
}

// ===== Skills =====
// Renders category-based lists and honors.
async function renderSkills() {
    const section = document.getElementById('skills');
    if (!section) return;

    const data = await fetchJSON('data/skills.json');
    if (!data) return;

    const skillsHTML = `
        <div class="card bg-[#17191c]/80 rounded-xl shadow-md border border-white/5 p-6 flex flex-col gap-6">
            <div>
                <div class="flex items-center gap-2 mb-4">
                    <span class="inline-block w-6 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full"></span>
                    <span class="uppercase tracking-wide text-xl font-bold text-accent-1">Professional Skills</span>
                </div>
                ${
                    (data.professionalSkills || []).map(category => `
                        <div class="mb-4 text-xs font-semibold uppercase text-gray-400">${category.category}</div>
                        <div class="flex flex-wrap gap-2 mb-4">
                            ${(category.skills || []).map(skill =>
                                `<span class="badge${category.category === 'Product Skills' ? ' badge-product' : ''}">${skill}</span>`
                            ).join('')}
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;

    const honorsHTML = `
        <div class="card bg-[#17191c]/80 rounded-xl shadow-md border border-white/5 p-6 flex flex-col gap-3">
            <div class="flex items-center gap-2">
                <span class="inline-block w-6 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full"></span>
                <span class="uppercase tracking-wide text-xl font-bold text-accent-1">Honors & Awards</span>
            </div>
            <div class="text-xl text-gray-300 space-y-6">
                ${
                    (data.honorsAwards || []).map(honor => `
                        <div>
                            <div class="font-semibold text-white mb-1">${honor.title}</div>
                            <div class="text-xs text-gray-400 mb-1">${honor.date} | ${honor.issuer}</div>
                            <div class="text-base text-gray-300">${honor.description}</div>
                        </div>
                    `).join('')
                }
            </div>
        </div>
    `;

    section.innerHTML = `
        <h2 class="text-3xl font-bold mb-2 flex items-center gap-2"><span>Skills & Honors</span></h2>
        <p class="mb-8 text-gray-400">My professional skills and recognitions.</p>
        <div class="skills-honors-container grid md:grid-cols-2 gap-8">
            ${skillsHTML}
            ${honorsHTML}
        </div>
    `;
}

// ===== UI Interactions =====
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const top = section.getBoundingClientRect().top;
        if (top < windowHeight - 100) {
            section.classList.add('visible');
        }
    });
}

function headerScrollEffect() {
    const header = document.getElementById('header');
    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileNav = document.getElementById('mobile-nav');
    if (!mobileMenuBtn || !closeMenuBtn || !mobileNav) return;

    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    closeMenuBtn.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Highlight active nav link based on scroll position.
function setupActiveNav() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const allLinks = [...navLinks, ...mobileLinks];
    const sections = Array.from(document.querySelectorAll('section'));

    const setActiveById = (id) => {
        allLinks.forEach(link => link.classList.remove('active'));
        const selector = `.nav-links a[href="#${id}"], .mobile-nav-links a[href="#${id}"]`;
        document.querySelectorAll(selector).forEach(link => link.classList.add('active'));
    };

    // Click state for immediate feedback.
    allLinks.forEach(link => {
        link.addEventListener('click', () => {
            const hash = link.getAttribute('href');
            if (!hash) return;
            const id = hash.replace('#', '');
            if (id) setActiveById(id);
        });
    });

    // Scroll spy (manual) to keep state accurate.
    const updateOnScroll = () => {
        const offset = 140;
        let current = sections[0]?.id;
        sections.forEach(section => {
            const top = section.getBoundingClientRect().top;
            if (top - offset <= 0) {
                current = section.id;
            }
        });
        if (current) setActiveById(current);
    };

    updateOnScroll();
    window.addEventListener('scroll', updateOnScroll);
}

// ===== Bootstrapping =====
async function loadContent() {
    await Promise.all([
        renderEducation(),
        renderExperiences(),
        renderProjects(),
        renderSkills()
    ]);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Render content first so headings exist for nav dots.
    await loadContent();

    // Initialize UI behaviors.
    revealOnScroll();
    headerScrollEffect();
    setupMobileMenu();
    setupActiveNav();

    // Keep UI in sync.
    window.addEventListener('scroll', () => {
        revealOnScroll();
        headerScrollEffect();
    });
});
