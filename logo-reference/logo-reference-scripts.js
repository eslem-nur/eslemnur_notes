// ============================================
// ESLEM NUR | LOGO REFERENCE - GLOBAL SCRIPTS
// Tüm Diller İçin Ortak JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. Current Year Auto-Update ---
    const currentYearElements = document.querySelectorAll('[id="current-year"], [id="current-year-footer"]');
    currentYearElements.forEach(el => {
        el.textContent = new Date().getFullYear();
    });
    
    // --- 2. Font Awesome Loading ---
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);
  
    // --- 3. Theme Toggle Functionality ---
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Load saved preference from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }
    
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update icon
        if (themeIcon) {
            themeIcon.className = theme === 'dark' 
                ? 'fas fa-sun' 
                : 'fas fa-moon';
        }
        
        // Save preference
        localStorage.setItem('theme', theme);
    }
    
    // --- 4. Language Dropdown Menu ---
    const langDropdown = document.getElementById('langDropdown');
    
    if (langDropdown) {
        // Toggle dropdown on button click
        const langButton = langDropdown.querySelector('.lang-toggle');
        if (langButton) {
            langButton.addEventListener('click', function(e) {
                e.stopPropagation();
                langDropdown.classList.toggle('active');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!langDropdown.contains(event.target)) {
                langDropdown.classList.remove('active');
            }
        });
        
        // Close dropdown when clicking on a language link
        const langLinks = langDropdown.querySelectorAll('.lang-dropdown-menu a');
        langLinks.forEach(link => {
            link.addEventListener('click', function() {
                langDropdown.classList.remove('active');
            });
        });
    }
    
    // --- 5. Smooth Scroll (if anchor links exist) ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // --- 6. External Links Opening in New Tab (optional security) ---
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
});