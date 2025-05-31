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

// Initialize
try {
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
} catch (error) {
    console.error("Initialization error:", error);
}