/**
 * ============================================================================
 * ALI HASSAN - PERSONAL PORTFOLIO SCRIPT
 * Vanilla JavaScript (ES6+) with Tailwind CSS Integration
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. THEME ENGINE (Tailwind CSS Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlRoot.classList.add('dark');
      htmlRoot.setAttribute('data-theme', 'dark');
    } else {
      htmlRoot.classList.remove('dark');
      htmlRoot.setAttribute('data-theme', 'light');
    }
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#020617' : '#f8fafc');
    }
  }

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = htmlRoot.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark' : 'Light'} Mode`, 'fa-circle-half-stroke');
    });
  }

  // OS theme change listener
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --------------------------------------------------------------------------
  // 2. SCROLL PROGRESS BAR & HEADER ELEVATION
  // --------------------------------------------------------------------------
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const header = document.getElementById('header');
  const backToTopBtn = document.getElementById('backToTop');

  function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Scroll progress bar width
    if (scrollProgressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Header elevation
    if (header) {
      if (scrollTop > 20) {
        header.classList.add('shadow-lg', 'shadow-slate-900/5', 'dark:shadow-black/40');
      } else {
        header.classList.remove('shadow-lg', 'shadow-slate-900/5', 'dark:shadow-black/40');
      }
    }

    // Back to top visibility
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. RESPONSIVE MOBILE NAVIGATION
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceState) {
    if (!mobileMenu) return;
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : mobileMenu.classList.contains('-translate-y-full');

    if (isOpen) {
      // Open
      mobileMenu.classList.remove('-translate-y-full', 'opacity-0', 'pointer-events-none');
      mobileMenu.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto');
      menuToggle.setAttribute('aria-expanded', 'true');
    } else {
      // Close
      mobileMenu.classList.add('-translate-y-full', 'opacity-0', 'pointer-events-none');
      mobileMenu.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => toggleMobileMenu());

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('-translate-y-full')) {
        toggleMobileMenu(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION TRACKING (Intersection Observer)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id], div[id="certificates"]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active', 'text-brand-600', 'dark:text-brand-400', 'bg-slate-100', 'dark:bg-slate-800/50');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active', 'text-brand-600', 'dark:text-brand-400', 'bg-slate-100', 'dark:bg-slate-800/50');
          }
        });
      }
    });
  }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => navObserver.observe(section));

  // --------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-element');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -40px 0px', threshold: 0.1 });

  revealElements.forEach((el, index) => {
    const delay = (index % 4) * 0.08;
    el.style.transitionDelay = `${delay}s`;
    revealObserver.observe(el);
  });

  // --------------------------------------------------------------------------
  // 6. PROJECT CATEGORY FILTERING
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  const activeClasses = ['bg-gradient-to-r', 'from-brand-500', 'to-sky-600', 'text-white', 'shadow-md', 'shadow-brand-500/25'];
  const inactiveClasses = ['bg-white', 'dark:bg-slate-800/80', 'border', 'border-slate-200', 'dark:border-white/10', 'text-slate-600', 'dark:text-slate-300'];

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove(...activeClasses);
        b.classList.add(...inactiveClasses);
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.remove(...inactiveClasses);
      btn.classList.add(...activeClasses);
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-categories') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 7. PROJECT DETAILS MODAL
  // --------------------------------------------------------------------------
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');
  const demoButtons = document.querySelectorAll('.project-demo-btn');

  const projectDetailsMap = {
    'Student Learning Portal': {
      title: 'Student Learning Portal',
      category: 'Academic Web Application',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      overview: 'A centralized digital hub created for university students to streamline lecture materials, PDF documents, and academic study guides within a unified, responsive interface.',
      features: [
        'Organized semester-by-semester course hierarchy.',
        'Integrated lecture notes repository and video link player.',
        'Built-in PDF document viewer with reading controls.',
        'Responsive layout optimized for smartphones, tablets, and desktop browsers.'
      ],
      githubUrl: 'https://github.com/AliHassan05'
    },
    'Student Expense Manager': {
      title: 'Student Expense Manager',
      category: 'Financial Analytics Web Tool',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      overview: 'A dedicated personal budgeting application tailored specifically for university students to track, categorize, and forecast recurring academic and living expenses.',
      features: [
        'Dedicated tracking categories for Transport, Petrol, Hostel, Food, Books & Tuition.',
        'Automated real-time calculation of Monthly, Semester, and Yearly expenditures.',
        'Interactive financial summary view with category breakdowns.',
        'Clean data export for generating downloadable budget reports.'
      ],
      liveUrl: 'https://student-expense-manager-rho.vercel.app/',
      githubUrl: 'https://github.com/AliHassan05'
    },
    'Alliance Coach Hire': {
      title: 'Alliance Coach Hire',
      category: 'Commercial WordPress Website',
      tech: ['WordPress', 'PHP', 'CSS3', 'JavaScript'],
      overview: 'Official commercial platform designed and developed for UK-wide coach, minibus, and private transport hire. Provides comprehensive fleet details, instant online quote requests, and an optimized mobile user experience.',
      features: [
        'Fleet and vehicle catalog with detailed passenger capacities.',
        'Interactive quote inquiry & booking request system.',
        'Customized WordPress theme with responsive mobile layout.',
        'Fast page performance and SEO search-engine optimization.'
      ],
      liveUrl: 'https://alliancecoachhire.co.uk',
      githubUrl: 'https://github.com/AliHassan05'
    },
    'Chrono-Lock': {
      title: 'Chrono-Lock: Coding Adventure',
      category: 'Interactive 3D Web Application',
      tech: ['React', 'Three.js', 'JavaScript', 'Tailwind CSS'],
      overview: 'An engaging 3D cyberpunk web application where users learn real programming and problem-solving by repairing components of a futuristic city in real-time.',
      features: [
        'Interactive 3D cyberpunk city scene rendered with Three.js.',
        'Gamified coding puzzles and programming challenges.',
        'React frontend state management with fluid interface transitions.',
        'Real-time interactive code feedback and browser audio-visuals.'
      ],
      liveUrl: 'https://chrono-lock-sepia.vercel.app',
      githubUrl: 'https://github.com/AliHassan05'
    },
    'Chrono-Lock: Coding Adventure': {
      title: 'Chrono-Lock: Coding Adventure',
      category: 'Interactive 3D Web Application',
      tech: ['React', 'Three.js', 'JavaScript', 'Tailwind CSS'],
      overview: 'An engaging 3D cyberpunk web application where users learn real programming and problem-solving by repairing components of a futuristic city in real-time.',
      features: [
        'Interactive 3D cyberpunk city scene rendered with Three.js.',
        'Gamified coding puzzles and programming challenges.',
        'React frontend state management with fluid interface transitions.',
        'Real-time interactive code feedback and browser audio-visuals.'
      ],
      liveUrl: 'https://chrono-lock-sepia.vercel.app',
      githubUrl: 'https://github.com/AliHassan05'
    }
  };

  function openProjectModal(projectName) {
    const data = projectDetailsMap[projectName];
    if (!data || !modalBody || !projectModalBackdrop) return;

    modalBody.innerHTML = `
      <div class="mb-4">
        <span class="text-xs font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">${data.category}</span>
        <h3 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">${data.title}</h3>
      </div>
      
      <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">${data.overview}</p>
      
      <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 mb-6">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Key Implemented Features:</h4>
        <ul class="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          ${data.features.map(f => `<li class="flex items-start gap-2"><i class="fa-solid fa-check text-emerald-500 text-xs mt-0.5"></i> <span>${f}</span></li>`).join('')}
        </ul>
      </div>

      <div class="mb-6">
        <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">Technologies Used:</h4>
        <div class="flex flex-wrap gap-2">
          ${data.tech.map(t => `<span class="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-400 font-mono text-xs font-bold">${t}</span>`).join('')}
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        ${data.liveUrl ? `<a href="${data.liveUrl}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-sky-600 hover:from-brand-600 hover:to-sky-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-brand-500/20">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          <span>Visit Live Site</span>
        </a>` : ''}
        ${data.githubUrl ? `<a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all">
          <i class="fa-brands fa-github"></i>
          <span>View on GitHub</span>
        </a>` : ''}
        <button class="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all" onclick="document.getElementById('modalCloseBtn').click()">
          Close
        </button>
      </div>
    `;

    projectModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (projectModalBackdrop) {
      projectModalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  demoButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectName = btn.getAttribute('data-project');
      if (projectName) {
        openProjectModal(projectName);
      }
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projectModalBackdrop) {
        closeProjectModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModalBackdrop && projectModalBackdrop.classList.contains('active')) {
      closeProjectModal();
    }
  });

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM VALIDATION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const formStatusNotice = document.getElementById('formStatusNotice');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const subjectError = document.getElementById('subjectError');
  const messageError = document.getElementById('messageError');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        const errorEl = document.getElementById(`${input.name}Error`);
        if (errorEl) errorEl.classList.add('hidden');
        input.classList.remove('border-red-500');
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        nameError.classList.remove('hidden');
        nameInput.classList.add('border-red-500');
        isValid = false;
      }

      if (!validateEmail(emailInput.value.trim())) {
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-red-500');
        isValid = false;
      }

      if (!subjectInput.value.trim() || subjectInput.value.trim().length < 2) {
        subjectError.classList.remove('hidden');
        subjectInput.classList.add('border-red-500');
        isValid = false;
      }

      if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
        messageError.classList.remove('hidden');
        messageInput.classList.add('border-red-500');
        isValid = false;
      }

      if (isValid) {
        if (formStatusNotice) {
          formStatusNotice.className = 'block p-4 rounded-xl text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mt-2';
          formStatusNotice.innerHTML = `
            <i class="fa-solid fa-circle-check"></i>
            Thank you, <strong>${nameInput.value.trim()}</strong>! Your message is validated. Feel free to also reach out directly via Email/LinkedIn!
          `;
        }
        showToast('Message ready! Connect via Email/LinkedIn directly.', 'fa-paper-plane');
        contactForm.reset();
      } else {
        showToast('Please correct the highlighted fields.', 'fa-triangle-exclamation');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 9. CV DOWNLOAD HELPER
  // --------------------------------------------------------------------------
  const cvDownloadBtn = document.getElementById('cvDownloadBtn');
  if (cvDownloadBtn) {
    cvDownloadBtn.addEventListener('click', () => {
      showToast('Downloading Ali Hassan CV...', 'fa-file-arrow-down');
    });
  }

  // --------------------------------------------------------------------------
  // 10. TOAST NOTIFICATION HELPER
  // --------------------------------------------------------------------------
  function showToast(message, iconClass = 'fa-info-circle') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<i class="fa-solid ${iconClass} text-brand-400"></i> <span>${message}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }
});
