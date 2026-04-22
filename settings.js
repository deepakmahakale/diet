/**
 * Settings Page Logic
 * Handles notification toggle and permission UI
 */

// DOM Elements
const notificationsToggle = document.getElementById('notificationsToggle');
const permissionStatus = document.getElementById('permissionStatus');
const testNotificationBtn = document.getElementById('testNotification');

// ============================================================================
// UI Updates
// ============================================================================

/**
 * Update permission status display
 */
function updatePermissionStatus() {
    const permission = NotificationManager.getPermissionStatus();

    permissionStatus.classList.remove('granted', 'denied', 'default', 'hidden');

    switch (permission) {
        case 'granted':
            permissionStatus.textContent = '✓ Notification permission granted';
            permissionStatus.classList.add('granted');
            testNotificationBtn.disabled = false;
            break;

        case 'denied':
            permissionStatus.textContent = '✗ Notification permission denied. Please enable in browser settings.';
            permissionStatus.classList.add('denied');
            testNotificationBtn.disabled = true;
            break;

        case 'default':
            permissionStatus.textContent = 'ℹ️ Permission will be requested when you enable notifications';
            permissionStatus.classList.add('default');
            testNotificationBtn.disabled = true;
            break;

        case 'unsupported':
            permissionStatus.textContent = '✗ Notifications not supported in this browser';
            permissionStatus.classList.add('denied');
            notificationsToggle.disabled = true;
            testNotificationBtn.disabled = true;
            break;
    }
}

/**
 * Update toggle state based on settings
 */
function updateToggleState() {
    notificationsToggle.checked = NotificationManager.areEnabled();
}

/**
 * Update entire UI
 */
function refreshUI() {
    updateToggleState();
    updatePermissionStatus();
}

// ============================================================================
// Event Handlers
// ============================================================================

/**
 * Handle notification toggle change
 */
async function handleToggleChange(event) {
    const enabled = event.target.checked;

    if (enabled) {
        // Request permission first
        const permission = await NotificationManager.requestPermission();

        if (permission === 'granted') {
            // Enable notifications
            NotificationManager.setEnabled(true);
            NotificationManager.scheduleAll();
            console.log('[Settings] Notifications enabled and scheduled');
        } else {
            // Permission denied - revert toggle
            notificationsToggle.checked = false;
            NotificationManager.setEnabled(false);
            console.log('[Settings] Permission denied, notifications not enabled');
        }
    } else {
        // Disable notifications
        NotificationManager.setEnabled(false);
        NotificationManager.clearAll();
        console.log('[Settings] Notifications disabled');
    }

    // Update UI
    refreshUI();
}

/**
 * Handle test notification button
 */
function handleTestNotification() {
    if (NotificationManager.getPermissionStatus() === 'granted') {
        NotificationManager.showTest();
    } else {
        alert('Please enable notifications first');
    }
}

// ============================================================================
// Initialization
// ============================================================================

/**
 * Initialize settings page
 */
function initSettings() {
    // Set initial UI state
    refreshUI();

    // Attach event listeners
    notificationsToggle.addEventListener('change', handleToggleChange);
    testNotificationBtn.addEventListener('click', handleTestNotification);

    console.log('[Settings] Page initialized');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    initSettings();
}
