/**
 * Notification Manager for Diet Schedule App
 * Handles scheduling and displaying meal notifications
 */

// ============================================================================
// Configuration
// ============================================================================

const MEAL_SCHEDULE = [
    {
        id: 'early-morning',
        title: 'Early Morning',
        time: '07:00',
        emoji: '🌅',
        timeRange: '7:00 AM - 7:30 AM'
    },
    {
        id: 'snacks-1',
        title: 'Snacks 1',
        time: '07:30',
        emoji: '🌰',
        timeRange: '7:30 AM - 8:00 AM'
    },
    {
        id: 'breakfast',
        title: 'Breakfast',
        time: '08:00',
        emoji: '🍳',
        timeRange: '8:00 AM - 9:00 AM'
    },
    {
        id: 'mid-morning',
        title: 'Mid Morning',
        time: '11:00',
        emoji: '🥤',
        timeRange: '11:00 AM - 11:30 AM'
    },
    {
        id: 'lunch',
        title: 'Lunch',
        time: '13:00',
        emoji: '🍽️',
        timeRange: '1:00 PM - 2:00 PM'
    },
    {
        id: 'evening-tea',
        title: 'Evening Tea',
        time: '16:00',
        emoji: '☕',
        timeRange: '4:00 PM - 5:00 PM'
    },
    {
        id: 'dinner',
        title: 'Dinner',
        time: '20:00',
        emoji: '🌙',
        timeRange: '8:00 PM - 9:00 PM'
    },
    {
        id: 'snacks-2',
        title: 'Snacks 2',
        time: '21:15',
        emoji: '🥛',
        timeRange: '9:15 PM - 9:30 PM'
    }
];

const STORAGE_KEY = 'dietAppNotificationsEnabled';
const MEAL_SETTINGS_KEY = 'dietAppMealSettings';
const LAST_CHECK_KEY = 'dietAppLastNotificationCheck';
const NOTIFICATION_TAG_PREFIX = 'meal-notification-';

// ============================================================================
// Settings Management
// ============================================================================

/**
 * Check if notifications are enabled globally
 */
function areNotificationsEnabled() {
    const setting = localStorage.getItem(STORAGE_KEY);
    return setting === 'true';
}

/**
 * Save global notification preference
 */
function setNotificationsEnabled(enabled) {
    localStorage.setItem(STORAGE_KEY, enabled.toString());
    console.log('[Notifications] Settings updated:', enabled);
}

/**
 * Get individual meal settings
 * @returns {Object} Object with meal IDs as keys and boolean enabled status
 */
function getMealSettings() {
    const settings = localStorage.getItem(MEAL_SETTINGS_KEY);
    if (!settings) {
        // Default: all meals enabled
        const defaultSettings = {};
        MEAL_SCHEDULE.forEach(meal => {
            defaultSettings[meal.id] = true;
        });
        return defaultSettings;
    }
    return JSON.parse(settings);
}

/**
 * Save individual meal settings
 * @param {Object} settings - Object with meal IDs as keys and boolean values
 */
function saveMealSettings(settings) {
    localStorage.setItem(MEAL_SETTINGS_KEY, JSON.stringify(settings));
    console.log('[Notifications] Meal settings updated:', settings);
}

/**
 * Check if a specific meal notification is enabled
 * @param {string} mealId - The meal ID to check
 * @returns {boolean}
 */
function isMealEnabled(mealId) {
    if (!areNotificationsEnabled()) {
        return false; // Global toggle is off
    }
    const settings = getMealSettings();
    return settings[mealId] !== false; // Default to true if not set
}

/**
 * Toggle a specific meal notification
 * @param {string} mealId - The meal ID to toggle
 * @param {boolean} enabled - Whether to enable or disable
 */
function setMealEnabled(mealId, enabled) {
    const settings = getMealSettings();
    settings[mealId] = enabled;
    saveMealSettings(settings);

    // Reschedule notifications
    if (areNotificationsEnabled() && getPermissionStatus() === 'granted') {
        scheduleAllNotifications();
    }
}

/**
 * Get current notification permission status
 */
function getPermissionStatus() {
    if (!('Notification' in window)) {
        return 'unsupported';
    }
    return Notification.permission;
}

// ============================================================================
// Permission Handling
// ============================================================================

/**
 * Request notification permission from user
 * @returns {Promise<string>} Permission status: 'granted', 'denied', or 'default'
 */
async function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.warn('[Notifications] Not supported in this browser');
        return 'unsupported';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    try {
        const permission = await Notification.requestPermission();
        console.log('[Notifications] Permission:', permission);
        return permission;
    } catch (error) {
        console.error('[Notifications] Permission request failed:', error);
        return 'denied';
    }
}

// ============================================================================
// Notification Display
// ============================================================================

/**
 * Show a meal notification
 * @param {Object} meal - Meal configuration object
 */
function showMealNotification(meal) {
    if (!('Notification' in window)) {
        console.warn('[Notifications] Not supported');
        return;
    }

    if (Notification.permission !== 'granted') {
        console.warn('[Notifications] Permission not granted');
        return;
    }

    const options = {
        body: `Time for ${meal.title} (${meal.timeRange})`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: NOTIFICATION_TAG_PREFIX + meal.id,
        requireInteraction: false,
        silent: false,
        data: {
            mealId: meal.id,
            url: '/index.html'
        }
    };

    // Use Service Worker notification if available (better for PWA)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(
                `${meal.emoji} ${meal.title}`,
                options
            ).then(() => {
                console.log('[Notifications] Shown via Service Worker:', meal.title);
            }).catch(error => {
                console.error('[Notifications] SW notification failed:', error);
                // Fallback to regular notification
                showRegularNotification(meal, options);
            });
        });
    } else {
        showRegularNotification(meal, options);
    }
}

/**
 * Show regular notification (non-service-worker)
 */
function showRegularNotification(meal, options) {
    const notification = new Notification(
        `${meal.emoji} ${meal.title}`,
        options
    );

    notification.onclick = function(event) {
        event.preventDefault();
        window.focus();
        window.location.href = '/index.html';
        notification.close();
    };

    console.log('[Notifications] Shown:', meal.title);
}

/**
 * Show a test notification
 */
function showTestNotification() {
    const testMeal = {
        id: 'test',
        title: 'Test Notification',
        emoji: '🔔',
        timeRange: 'Now'
    };
    showMealNotification(testMeal);
}

// ============================================================================
// Notification Scheduling
// ============================================================================

let scheduledTimeouts = [];

/**
 * Calculate milliseconds until next occurrence of time
 * @param {string} timeString - Time in HH:MM format (24-hour)
 * @returns {number} Milliseconds until time
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
 * Schedule a single meal notification
 * @param {Object} meal - Meal configuration
 */
function scheduleMealNotification(meal) {
    // Check if this specific meal is enabled
    if (!isMealEnabled(meal.id)) {
        console.log(`[Notifications] Skipping disabled meal: ${meal.title}`);
        return;
    }

    const delay = getMillisecondsUntilTime(meal.time);

    const timeoutId = setTimeout(() => {
        console.log('[Notifications] Triggering:', meal.title);

        // Double-check if still enabled before showing
        if (isMealEnabled(meal.id)) {
            showMealNotification(meal);
            recordNotificationShown(meal.id);
        }

        // Reschedule for next day
        scheduleMealNotification(meal);
    }, delay);

    scheduledTimeouts.push(timeoutId);

    const triggerTime = new Date(Date.now() + delay);
    console.log(`[Notifications] Scheduled: ${meal.title} at ${triggerTime.toLocaleString()}`);
}

/**
 * Schedule all meal notifications
 */
function scheduleAllNotifications() {
    console.log('[Notifications] Scheduling all meals...');

    // Clear existing schedules
    clearAllSchedules();

    // Check if enabled
    if (!areNotificationsEnabled()) {
        console.log('[Notifications] Disabled in settings');
        return;
    }

    // Check permission
    if (getPermissionStatus() !== 'granted') {
        console.warn('[Notifications] Permission not granted');
        return;
    }

    // Schedule each meal
    MEAL_SCHEDULE.forEach(meal => {
        scheduleMealNotification(meal);
    });

    console.log('[Notifications] All meals scheduled');
}

/**
 * Clear all scheduled notifications
 */
function clearAllSchedules() {
    scheduledTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    scheduledTimeouts = [];
    console.log('[Notifications] Cleared all schedules');
}

/**
 * Record that a notification was shown
 * @param {string} mealId - The meal ID
 */
function recordNotificationShown(mealId) {
    const today = new Date().toDateString();
    const key = `notification-shown-${mealId}-${today}`;
    localStorage.setItem(key, 'true');
}

/**
 * Check if a notification was already shown today
 * @param {string} mealId - The meal ID
 * @returns {boolean}
 */
function wasNotificationShownToday(mealId) {
    const today = new Date().toDateString();
    const key = `notification-shown-${mealId}-${today}`;
    return localStorage.getItem(key) === 'true';
}

/**
 * Check for missed notifications and show them
 */
function checkMissedNotifications() {
    if (!areNotificationsEnabled() || getPermissionStatus() !== 'granted') {
        return;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    console.log('[Notifications] Checking for missed notifications...');

    MEAL_SCHEDULE.forEach(meal => {
        // Skip if this meal is disabled
        if (!isMealEnabled(meal.id)) {
            return;
        }

        // Skip if already shown today
        if (wasNotificationShownToday(meal.id)) {
            return;
        }

        // Parse meal time
        const [hours, minutes] = meal.time.split(':').map(Number);
        const mealTime = hours * 60 + minutes;

        // If we've passed this meal time and haven't shown it, show it now
        if (currentTime >= mealTime) {
            console.log(`[Notifications] Showing missed notification: ${meal.title}`);
            showMealNotification(meal);
            recordNotificationShown(meal.id);
        }
    });

    // Update last check time
    localStorage.setItem(LAST_CHECK_KEY, now.toISOString());
}

/**
 * Reschedule notifications (call this on page load)
 */
function initializeNotifications() {
    console.log('[Notifications] Initializing...');

    // Check for missed notifications first
    checkMissedNotifications();

    // Only schedule if enabled and permitted
    if (areNotificationsEnabled() && getPermissionStatus() === 'granted') {
        scheduleAllNotifications();
    }

    // Re-check for missed notifications when page becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            console.log('[Notifications] Page visible - checking for missed notifications');
            checkMissedNotifications();

            // Reschedule to ensure timers are active
            if (areNotificationsEnabled() && getPermissionStatus() === 'granted') {
                scheduleAllNotifications();
            }
        }
    });

    // Re-schedule periodically to handle missed notifications
    // Check every 30 minutes if any schedules need updating
    setInterval(() => {
        if (areNotificationsEnabled() && getPermissionStatus() === 'granted') {
            console.log('[Notifications] Periodic check - ensuring schedules active');
            checkMissedNotifications();
            scheduleAllNotifications();
        }
    }, 30 * 60 * 1000); // Every 30 minutes
}

// ============================================================================
// Public API
// ============================================================================

const NotificationManager = {
    // Settings
    areEnabled: areNotificationsEnabled,
    setEnabled: setNotificationsEnabled,
    getPermissionStatus,

    // Meal-specific settings
    getMealSettings,
    saveMealSettings,
    isMealEnabled,
    setMealEnabled,

    // Permissions
    requestPermission: requestNotificationPermission,

    // Display
    showTest: showTestNotification,

    // Scheduling
    scheduleAll: scheduleAllNotifications,
    clearAll: clearAllSchedules,
    initialize: initializeNotifications,
    checkMissed: checkMissedNotifications,

    // Configuration
    getMealSchedule: () => MEAL_SCHEDULE
};

// Auto-initialize when included
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNotifications);
} else {
    initializeNotifications();
}
