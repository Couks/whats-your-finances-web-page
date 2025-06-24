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
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    const themeToggleButton = document.getElementById("themeToggle");
    const htmlElement = document.documentElement;

    // --- Theme Toggler ---
    const storedTheme = localStorage.getItem('theme');

    // Set theme on initial load
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      htmlElement.classList.add('dark');
    }

    if (themeToggleButton) {
      themeToggleButton.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        const isDark = htmlElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
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
      mobileMenuOverlay.classList.add("z-10");
    };

    const closeMenu = () => {
      mobileMenu.classList.add("translate-x-full");
      setTimeout(() => {
        mobileMenuOverlay.classList.add("hidden");
        mobileMenuOverlay.classList.remove("z-10");
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