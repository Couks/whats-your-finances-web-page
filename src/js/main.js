document.addEventListener("DOMContentLoaded", () => {
  const loadComponent = (elementId, url) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return response.text();
      })
      .then((data) => {
        const element = document.getElementById(elementId);
        if (element) {
          element.innerHTML = data;
        } else {
          // This can happen if a container was removed, like testimonials-container.
          // console.error(`Element with id ${elementId} not found.`);
        }
      })
      .catch((error) => console.error("Error loading component:", error));
  };

  const components = [
    { id: "navbar-container", url: "src/components/navbar.html" },
    { id: "home-container", url: "src/components/home.html" },
    { id: "why-us-container", url: "src/components/why-us.html" },
    { id: "how-it-works-container", url: "src/components/how-it-works.html" },
    { id: "features-container", url: "src/components/features.html" },
    { id: "problem-container", url: "src/components/problem.html" },
    { id: "security-container", url: "src/components/security.html" },
    { id: "faq-container", url: "src/components/faq.html" },
    { id: "team-container", url: "src/components/team.html" },
    { id: "download-container", url: "src/components/download.html" },
    { id: "cookie-consent-container", url: "src/components/cookie-consent.html" },
    { id: "footer-container", url: "src/components/footer.html" },
    { id: "mobile-menu-container", url: "src/components/mobile-menu.html" },
  ];

  components.forEach(component => {
    loadComponent(component.id, component.url);
  });

  // --- Navbar Logic ---
  const initializeNavbar = () => {
    const header = document.getElementById("header");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const closeMobileMenuButton = document.getElementById("closeMobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");
    const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
    const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    const themeToggleButton = document.getElementById("themeToggle");
    const themeToggleButtonMobile = document.getElementById("themeToggleMobile");
    const htmlElement = document.documentElement;

    // --- Theme Toggler ---
    const storedTheme = localStorage.getItem('theme');

    const updateThemeIcons = (isDark) => {
      const sunIcon = `<i class="fa-solid fa-sun text-xl"></i>`;
      const moonIcon = `<i class="fa-solid fa-moon text-xl hidden"></i>`;
      const sunIconMobile = `<i class="fa-solid fa-sun text-2xl"></i><span class="sr-only">Tema Claro</span>`;
      const moonIconMobile = `<i class="fa-solid fa-moon text-2xl"></i><span class="sr-only">Tema Escuro</span>`;

      if (themeToggleButton) {
        const sun = themeToggleButton.querySelector('.fa-sun');
        const moon = themeToggleButton.querySelector('.fa-moon');
        if (sun && moon) {
          sun.style.display = isDark ? 'none' : 'block';
          moon.style.display = isDark ? 'block' : 'none';
        }
      }
      if (themeToggleButtonMobile) {
        themeToggleButtonMobile.innerHTML = isDark ? moonIconMobile : sunIconMobile;
      }
    };

    const toggleTheme = () => {
      const isDark = htmlElement.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcons(isDark);
    };

    // Set theme on initial load
    const initialIsDark = storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    htmlElement.classList.toggle('dark', initialIsDark);
    updateThemeIcons(initialIsDark);

    if (themeToggleButton) {
      themeToggleButton.addEventListener('click', toggleTheme);
    }
    if (themeToggleButtonMobile) {
      themeToggleButtonMobile.addEventListener('click', toggleTheme);
    }

    // Sticky Header
    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add("bg-white/80", "dark:bg-secondary-900/80", "shadow-lg", "backdrop-blur-md");
      } else {
        header.classList.remove("bg-white/80", "dark:bg-secondary-900/80", "shadow-lg", "backdrop-blur-md");
      }
    };

    // Mobile Menu Toggle
    const openMenu = () => {
      mobileMenu.classList.remove("translate-x-full");
      mobileMenuOverlay.classList.remove("hidden");
    };

    const closeMenu = () => {
      mobileMenu.classList.add("translate-x-full");
      setTimeout(() => {
        mobileMenuOverlay.classList.add("hidden");
      }, 300);
    };

    if (mobileMenuButton) mobileMenuButton.addEventListener("click", openMenu);
    if (closeMobileMenuButton) closeMobileMenuButton.addEventListener("click", closeMenu);
    if (mobileMenuOverlay) mobileMenuOverlay.addEventListener("click", closeMenu);
    mobileNavLinks.forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("scroll", handleScroll);
  };

  // Wait for navbar to be loaded before initializing its logic
  const navbarContainer = document.getElementById('navbar-container');
  if (navbarContainer) {
    const observer = new MutationObserver((mutationsList, observer) => {
      if (document.getElementById('header')) {
        initializeNavbar();
        observer.disconnect(); // Stop observing once initialized
      }
    });
    observer.observe(navbarContainer, { childList: true, subtree: true });
  }

  // Separate observer for the mobile menu, as it's in a different container now.
  const mobileMenuContainer = document.getElementById('mobile-menu-container');
  if (mobileMenuContainer) {
    const observer = new MutationObserver((mutationsList, observer) => {
      // We still initialize the logic from the navbar observer,
      // but we need to wait for the menu elements to exist.
      // This check is redundant if the navbar loads first, but it's safe.
      if (document.getElementById('mobileMenu')) {
        initializeNavbar();
        observer.disconnect();
      }
    });
    observer.observe(mobileMenuContainer, { childList: true, subtree: true });
  }

  // --- FAQ Accordion Logic ---
  const initializeFaq = () => {
    const accordion = document.getElementById('faq-accordion');
    if (!accordion) return;

    const faqItems = accordion.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      const icon = question.querySelector('i');

      question.addEventListener('click', () => {
        const isOpen = answer.classList.contains('open');

        // Close all other items
        faqItems.forEach(otherItem => {
          otherItem.querySelector('.faq-answer').classList.remove('open');
          otherItem.querySelector('.faq-question i').classList.remove('rotate-180');
        });

        if (!isOpen) {
          answer.classList.add('open');
          icon.classList.add('rotate-180');
        }
      });
    });
  };

  // Wait for FAQ to be loaded
  const faqContainer = document.getElementById('faq-container');
  if (faqContainer) {
    const observer = new MutationObserver((mutationsList, observer) => {
      if (document.getElementById('faq-accordion')) {
        initializeFaq();
        observer.disconnect();
      }
    });
    observer.observe(faqContainer, { childList: true, subtree: true });
  }

  // --- Cookie Consent Logic ---
  const initializeCookieConsent = () => {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptButton = document.getElementById('acceptCookies');
    const declineButton = document.getElementById('declineCookies');

    if (!cookieConsent || !acceptButton || !declineButton) return;

    if (!localStorage.getItem('cookieConsent')) {
      cookieConsent.style.display = 'block';
    }

    acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieConsent.style.display = 'none';
    });

    declineButton.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieConsent.style.display = 'none';
    });
  };

  // Wait for Cookie Consent to be loaded
  const cookieContainer = document.getElementById('cookie-consent-container');
  if (cookieContainer) {
    const observer = new MutationObserver((mutationsList, observer) => {
      if (document.getElementById('cookieConsent')) {
        initializeCookieConsent();
        observer.disconnect();
      }
    });
    observer.observe(cookieContainer, { childList: true, subtree: true });
  }
}); 