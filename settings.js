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
const testNotificationTime = document.getElementById('testNotificationTime');
const setCurrentTimeBtn = document.getElementById('setCurrentTime');
const testNotificationInfo = document.getElementById('testNotificationInfo');

// Test notification timeout ID
let testNotificationTimeoutId = null;

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
 * Set time input to current time
 */
function setCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    testNotificationTime.value = `${hours}:${minutes}`;
}

/**
 * Calculate milliseconds until specified time
 */
function getMillisecondsUntilTime(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    return target.getTime() - now.getTime();
}

/**
 * Format milliseconds to human-readable time
 */
function formatTimeUntil(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

/**
 * Handle test notification button
 */
function handleTestNotification() {
    if (NotificationManager.getPermissionStatus() !== 'granted') {
        alert('Please enable notifications first');
        return;
    }

    const timeValue = testNotificationTime.value;

    if (!timeValue) {
        // No time specified - send immediately
        NotificationManager.showTest();
        testNotificationInfo.textContent = '✓ Test notification sent immediately!';
        testNotificationInfo.classList.remove('hidden', 'scheduled');
        testNotificationInfo.classList.add('test-info');

        // Hide message after 3 seconds
        setTimeout(() => {
            testNotificationInfo.classList.add('hidden');
        }, 3000);
        return;
    }

    // Clear any existing scheduled test
    if (testNotificationTimeoutId) {
        clearTimeout(testNotificationTimeoutId);
        testNotificationTimeoutId = null;
    }

    // Calculate delay
    const delay = getMillisecondsUntilTime(timeValue);
    const targetTime = new Date(Date.now() + delay);
    const timeUntil = formatTimeUntil(delay);

    // Schedule the test notification
    testNotificationTimeoutId = setTimeout(() => {
        console.log('[Settings] Triggering scheduled test notification');
        NotificationManager.showTest();
        testNotificationTimeoutId = null;

        // Update info message
        testNotificationInfo.textContent = '✓ Test notification sent!';
        testNotificationInfo.classList.remove('scheduled');

        // Hide after 5 seconds
        setTimeout(() => {
            testNotificationInfo.classList.add('hidden');
        }, 5000);
    }, delay);

    // Show scheduling confirmation
    testNotificationInfo.textContent = `⏰ Test notification scheduled for ${targetTime.toLocaleTimeString()} (in ${timeUntil})`;
    testNotificationInfo.classList.remove('hidden');
    testNotificationInfo.classList.add('scheduled');

    console.log(`[Settings] Test notification scheduled for ${targetTime.toLocaleString()} (${delay}ms)`);
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

    // Set default time to 1 minute from now
    const defaultTime = new Date(Date.now() + 60000); // 1 minute from now
    const hours = String(defaultTime.getHours()).padStart(2, '0');
    const minutes = String(defaultTime.getMinutes()).padStart(2, '0');
    testNotificationTime.value = `${hours}:${minutes}`;

    // Attach event listeners
    notificationsToggle.addEventListener('change', handleToggleChange);
    testNotificationBtn.addEventListener('click', handleTestNotification);
    setCurrentTimeBtn.addEventListener('click', setCurrentTime);

    console.log('[Settings] Page initialized');
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSettings);
} else {
    initSettings();
}
