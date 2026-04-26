/**
 * Settings Page Logic
 * Handles notification toggle and permission UI
 */

// DOM Elements
const notificationsToggle = document.getElementById('notificationsToggle');
const permissionStatus = document.getElementById('permissionStatus');
const testNotificationBtn = document.getElementById('testNotification');
const mealTogglesContainer = document.getElementById('mealTogglesContainer');
const mealToggles = document.getElementById('mealToggles');

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
 * Create individual meal toggle items
 */
function createMealToggles() {
    const meals = NotificationManager.getMealSchedule();
    const mealSettings = NotificationManager.getMealSettings();

    // Clear existing toggles
    mealToggles.innerHTML = '';

    meals.forEach(meal => {
        const isEnabled = mealSettings[meal.id] !== false;

        const toggleItem = document.createElement('div');
        toggleItem.className = `meal-toggle-item ${!isEnabled ? 'disabled' : ''}`;
        toggleItem.dataset.mealId = meal.id;

        toggleItem.innerHTML = `
            <div class="meal-toggle-info">
                <span class="meal-emoji">${meal.emoji}</span>
                <div class="meal-details">
                    <div class="meal-name">${meal.title}</div>
                    <div class="meal-time">${meal.timeRange}</div>
                </div>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" data-meal-id="${meal.id}" ${isEnabled ? 'checked' : ''}>
                <span class="slider"></span>
            </label>
        `;

        mealToggles.appendChild(toggleItem);
    });

    // Attach event listeners to all meal toggles
    const toggleInputs = mealToggles.querySelectorAll('input[type="checkbox"]');
    toggleInputs.forEach(input => {
        input.addEventListener('change', handleMealToggleChange);
    });
}

/**
 * Update meal toggles visibility and state
 */
function updateMealTogglesVisibility() {
    const notificationsEnabled = NotificationManager.areEnabled();
    const permissionGranted = NotificationManager.getPermissionStatus() === 'granted';

    if (notificationsEnabled && permissionGranted) {
        mealTogglesContainer.classList.remove('hidden');
        createMealToggles(); // Refresh the toggles
    } else {
        mealTogglesContainer.classList.add('hidden');
    }
}

/**
 * Update entire UI
 */
function refreshUI() {
    updateToggleState();
    updatePermissionStatus();
    updateMealTogglesVisibility();
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

    // Show/hide individual meal toggles
    updateMealTogglesVisibility();
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

/**
 * Handle individual meal toggle change
 */
function handleMealToggleChange(event) {
    const mealId = event.target.dataset.mealId;
    const enabled = event.target.checked;

    console.log(`[Settings] Meal toggle changed: ${mealId} = ${enabled}`);

    // Update the meal setting
    NotificationManager.setMealEnabled(mealId, enabled);

    // Update the visual state of the toggle item
    const toggleItem = event.target.closest('.meal-toggle-item');
    if (enabled) {
        toggleItem.classList.remove('disabled');
    } else {
        toggleItem.classList.add('disabled');
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
