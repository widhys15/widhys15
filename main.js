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
function renderBadges(tags = []) {
    if (!tags.length) return '';
    return `
        <div class="badge-container">
            ${tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
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
    let html = `
        <h2>Projects</h2>
        <p>Selected work focused on audit analytics, data engineering, and systems that turn messy data into decisions.</p>
        <div class="projects-focus">
            <span>Audit Analytics</span>
            <span>Data Engineering</span>
            <span>Enterprise Systems</span>
        </div>
        <div class="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    `;

    if (data && data.length) {
        data.forEach(project => {
            const focus = (project.tags || []).slice(0, 3).join(' • ');
            html += `
                <div class="card project-card flex flex-col h-full">
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
                        <h3 class="project-title">${project.title}</h3>
                        <div class="project-type">${project.type || ''}</div>
                        ${focus ? `
                            <div class="project-context">
                                <span class="context-label">Focus</span>
                                <span class="context-text">${focus}</span>
                            </div>
                        ` : ''}
                        ${renderBadges(project.tags)}
                        <p class="project-description">${project.description || ''}</p>
                        <div class="project-links mt-2">
                            ${renderProjectLinks(project)}
                        </div>
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

    html += '</div>';
    container.innerHTML = html;
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
