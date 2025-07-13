// Navigation dot update
function updateList() {
	try {
		const titles = [...document.querySelectorAll('h1, h2')].sort((a, b) => {
			return Math.abs(a.getBoundingClientRect().top) - Math.abs(b.getBoundingClientRect().top);
		});

		const navDots = document.querySelectorAll(".nav-dot");
		
		// Only proceed if nav dots exist
		if (navDots.length > 0) {
			document.querySelectorAll(".selected-circle").forEach(c => c.classList.remove("selected-circle"));
			navDots[[...document.querySelectorAll('h1, h2')].indexOf(titles[0])].classList.add("selected-circle");
		}
	} catch (error) {
		console.log("Navigation update error:", error);
	}
}

// Scroll animations
function revealOnScroll() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight - 100) {
            section.classList.add('visible');
        }
    });
}

// Header scroll effect
function headerScrollEffect() {
    const header = document.getElementById('header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (mobileMenuBtn && closeMenuBtn && mobileNav) {
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
}

// Fetch JSON data with better error handling
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`Warning: Could not load data from ${url}. Status: ${response.status}`);
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

// Render education section with fallback
async function renderEducation() {
    const educationData = await fetchData('data/education.json');
    const container = document.getElementById('education');
    if (!container) return;

    let html = `
        <h2>Education</h2>
        <p>My academic background and achievements.</p>
    `;

    if (educationData && educationData.length > 0) {
        educationData.forEach(edu => {
            html += `
                <div class="card">
                    <h3>${edu.degree}</h3>
                    <div class="card-subtitle">${edu.institution} (${edu.period})</div>
                    <div class="badge-container">
                        <span class="badge">GPA: ${edu.gpa}</span>
                    </div>
                    <p><strong>Related coursework:</strong></p>
                    <p>${edu.coursework}</p>
                </div>
            `;
        });
    } else {
        // Fallback content if data is missing
        html += `
            <div class="card">
                <h3>Bachelor of Science in Information System and Technology</h3>
                <div class="card-subtitle">Bandung Institute of Technology (2020 - 2024)</div>
                <div class="badge-container">
                    <span class="badge">GPA: 3.7/4.0</span>
                </div>
                <p><strong>Related coursework:</strong></p>
                <p>Data Structures, Algorithms, Database Systems, Web Programming, Software Engineering, Data Analytics, Machine Learning, IT Project Management</p>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Similar fallback handling for other render functions
async function renderExperiences() {
    const experiencesData = await fetchData('data/experiences.json');
    if (!experiencesData) return;

    const container = document.getElementById('experiences');
    if (!container) return;

    let html = `
        <h2>Experiences</h2>
        <p>My professional journey and work experiences.</p>
    `;

    experiencesData.forEach(exp => {
        html += `
            <div class="card">
                <h3>${exp.title}</h3>
                <div class="card-subtitle">${exp.company}</div>
                <div class="card-date">${exp.period}</div>
                <div class="badge-container">
                    ${exp.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
                </div>
                <ul class="content-list">
                    ${exp.description.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Render projects section
async function renderProjects() {
    const projectsData = await fetchData('data/projects.json');
    if (!projectsData) return;

    const container = document.getElementById('projects');
    if (!container) return;

    let html = `
        <h2>Projects</h2>
        <p>Here are some of my projects throughout my life.</p>
        <div class="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
    `;
    projectsData.forEach(project => {
        html += `
        <div class="card flex flex-col h-full">
            <div class="project-media flex justify-center items-center py-8">
            <img src="${project.image}" alt="${project.title} Screenshot" class="object-contain max-h-32 w-auto" loading="lazy">
            </div>
            <div class="project-content flex flex-col flex-1 px-6 pt-4 pb-0">
            <h3 class="project-title">${project.title}</h3>
            <div class="card-subtitle">${project.type.toUpperCase()}</div>
            <div class="badge-container">
                ${project.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
            </div>
            <p class="project-description">${project.description}</p>
            <div class="project-links mt-2">
                ${getProjectLinks(project)}
            </div>
            </div>
        </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Helper function to generate project media HTML
function getProjectMedia(project) {
    if (project.image) {
        // You can support multiple images with a carousel later
        return `<img src="${project.image}" alt="${project.title} Screenshot" class="rounded-t-xl w-full h-48 object-cover bg-[#181818] p-4 shadow" loading="lazy">`;
    }
    // If no image, fallback to icon or SVG
    return `<div class="w-full h-48 flex items-center justify-center bg-[#202020] text-4xl text-gray-600 rounded-t-xl">
        <i class="fa-solid fa-image"></i>
    </div>`;
}

// Helper function to generate project links HTML
function getProjectLinks(project) {
    const icons = {
        doc: `<i class="fa-solid fa-file-lines"></i>`,
        code: `<i class="fa-brands fa-github"></i>`,
        demo: `<i class="fa-solid fa-play"></i>`,
        video: `<i class="fa-brands fa-youtube"></i>`,
        website: `<i class="fa-solid fa-globe"></i>`,
        figma: `<i class="fa-brands fa-figma"></i>`
    };

    const linkLabels = {
        doc: "Documentation",
        code: "Code",
        demo: "Demo",
        video: "Video",
        website: "Website",
        figma: "Figma"
    };

    return Object.keys(icons)
        .filter(type => project[type])
        .map(type =>
            `<a href="${project[type]}" class="project-link" target="_blank" rel="noopener">
                ${icons[type]} ${linkLabels[type]}
            </a>`
        ).join('');
}

// Render skills section
async function renderSkillsAndHonors() {
// Fetch the JSON data from your skills.json file
const response = await fetch('data/skills.json');
if (!response.ok) return;
const data = await response.json();

const section = document.getElementById('skills');
if (!section) return;

// Build the HTML for professional skills
let skillsHTML = `
<div class="card bg-[#17191c]/80 rounded-xl shadow-md border border-white/5 p-6 flex flex-col gap-6">
    <div>
    <div class="flex items-center gap-2 mb-4">
        <span class="inline-block w-6 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full"></span>
        <span class="uppercase tracking-wide text-xl font-bold text-accent-1">Professional Skills</span>
    </div>
    ${
        data.professionalSkills.map(category => `
        <div class="mb-4 text-xs font-semibold uppercase text-gray-400">${category.category}</div>
        <div class="flex flex-wrap gap-2 mb-4">
            ${category.skills.map(skill =>
            `<span class="badge${category.category === 'Product Skills' ? ' badge-product' : ''}">${skill}</span>`
            ).join('')}
        </div>
        `).join('')
    }
    </div>
</div>
`;

// Build the HTML for honors & awards
let honorsHTML = `
<div class="card bg-[#17191c]/80 rounded-xl shadow-md border border-white/5 p-6 flex flex-col gap-3">
    <div class="flex items-center gap-2">
    <span class="inline-block w-6 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 rounded-full"></span>
    <span class="uppercase tracking-wide text-xl font-bold text-accent-1">Honors & Awards</span>
    </div>
    <div class="text-xl text-gray-300 space-y-6">
    ${
        data.honorsAwards.map(honor => `
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

// Final render
section.innerHTML = `
<h2 class="text-3xl font-bold mb-2 flex items-center gap-2">
    <span>Skills & Honors</span>
</h2>
<p class="mb-8 text-gray-400">My professional skills and recognitions.</p>
<div class="skills-honors-container grid md:grid-cols-2 gap-8">
    ${skillsHTML}
    ${honorsHTML}
</div>
`;
}

// Load all content
async function loadContent() {
    await Promise.all([
        renderEducation(),
        renderExperiences(),
        renderProjects(),
        renderSkillsAndHonors()
    ]);
}

// Initialize
try {
    document.addEventListener('DOMContentLoaded', async () => {
        // Load content from JSON files
        await loadContent();
        
        // Initialize UI components
        updateList();
        revealOnScroll();
        headerScrollEffect();
        setupMobileMenu();

        // Event listeners
        window.addEventListener('scroll', () => {
            updateList();
            revealOnScroll();
            headerScrollEffect();
        });

        window.addEventListener('resize', () => {
            updateList();
        });
    });
} catch (error) {
    console.error("Initialization error:", error);
}