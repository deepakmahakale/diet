/**
 * Common Application Functionality
 * Handles navigation, PWA installation, and service worker registration
 */

// ============================================================================
// Navigation & Sidebar
// ============================================================================

/**
 * Initialize sidebar navigation
 */
function initNavigation() {
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    if (!menuBtn || !sidebar || !overlay) {
        console.warn('Navigation elements not found');
        return;
    }

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('open');
    };

    menuBtn.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
}

// ============================================================================
// Service Worker Registration
// ============================================================================

/**
 * Register service worker for offline functionality
 */
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered successfully:', registration.scope);
                })
                .catch(err => {
                    console.error('ServiceWorker registration failed:', err);
                });
        });
    }
}

// ============================================================================
// PWA Installation
// ============================================================================

/**
 * Initialize PWA installation functionality
 */
function initPWAInstall() {
    let deferredPrompt;
    const installBtn = document.getElementById('installBtn');

    if (!installBtn) {
        console.warn('Install button not found');
        return;
    }

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();

        // Store the event for later use
        deferredPrompt = e;

        // Show the install button
        installBtn.style.display = 'block';
    });

    // Handle install button click
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) {
            return;
        }

        // Hide the install button
        installBtn.style.display = 'none';

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user's response
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);

        // Clear the deferredPrompt
        deferredPrompt = null;
    });

    // Handle successful installation
    window.addEventListener('appinstalled', () => {
        console.log('PWA installed successfully');
        deferredPrompt = null;
    });
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize common app functionality when DOM is ready
 */
function initApp() {
    initNavigation();
    registerServiceWorker();
    initPWAInstall();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
