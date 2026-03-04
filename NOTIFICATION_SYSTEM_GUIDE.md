# Notification System - Setup & Testing Guide

## Overview
The notification system now alerts admins immediately when new user profiles are submitted for approval.

---

## What's New

### 1. **Browser Notifications**
- Desktop notifications appear when users submit profiles
- Requires browser permission on first visit

### 2. **Notification Bell Badge**
- Admin dashboard shows a red badge with pending approval count
- Appears in navbar on Profile Approvals page
- Link on main dashboard to quickly access approvals

### 3. **Notification Panel**
- Click the bell icon to see full notification history
- Shows time when each notification was received
- Delete individual notifications
- Auto-marks as read when viewed

### 4. **Toast Notifications**
- Small alerts pop up in top-right corner
- Appear when new approvals come in
- Auto-dismiss after 5 seconds

---

## How Notifications Work

### When User Signs Up:
```
User Registration → Approval Request Created → Notification Generated
    ↓
Admins see badge with count
    ↓
Admin clicks Profile Approvals link
    ↓
Notification panel shows details
```

### Where Notifications Appear:

1. **Browser Notification** (if enabled)
   - Desktop notification popup
   - Shows user name and email

2. **Badge on Dashboard**
   - Red number badge on "Approvals" link
   - Shows total pending count
   - Updates every 10 seconds

3. **Notification Panel**
   - Full notification history
   - Click bell icon to open
   - Shows time ago (e.g., "5m ago")

4. **Toast Alert**
   - Popup in top-right corner
   - Appears when new approvals arrive
   - Auto-dismiss after 5 seconds

---

## Testing the Notification System

### Method 1: Create a Real User Profile
1. Open the website on an incognito window
2. Go to home page and click "Sign Up"
3. Fill out the signup form and submit
4. Go to `admin-profile-approvals.html` in admin account
5. You should see:
   - New notification in the panel
   - Updated badge count
   - Toast notification (if on the page)

### Method 2: Use Test Function (Developer Console)
1. Open `admin-profile-approvals.html`
2. Right-click → **Inspect** → **Console** tab
3. Paste this command:
   ```javascript
   testCreateNotification()
   ```
4. Press Enter
5. You should immediately see:
   - Notification in the panel
   - Badge number updated
   - Toast alert

### Method 3: Add Test Users in Console
```javascript
// Create a test approval request
const testData = {
    name: 'Test User',
    email: 'test@example.com',
    phone: '+923001234567',
    role: 'user',
    earning_plan: 'Pro Plan',
    profileStatus: 'pending',
    loginDate: new Date().toISOString()
};

createApprovalRequest(testData);
```

---

## Files Used

### JavaScript Files:
- `js/profile-approval.js` - Core notification system
- Updated `js/auth.js` - Creates notifications on signup

### HTML Files:
- `admin-profile-approvals.html` - Notification panel + bell icon
- `dashboard.html` - Approvals badge link
- All other pages (`home.html`, `jobs.html`, etc.) - Load notification system

---

## Notification Data Structure

### Stored As:
```json
{
  "id": "NOTIF_1234567890",
  "type": "NEW_APPROVAL_REQUEST",
  "data": {
    "approvalId": "APR_1234567890",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "timestamp": "2026-03-05T10:30:00Z"
  },
  "isRead": false,
  "createdAt": "2026-03-05T10:30:00Z"
}
```

### LocalStorage Key:
- `workbridge_notifications` - All notifications
- `workbridge_approvals` - All approval requests

---

## Enable Browser Notifications

### First-Time Setup:
1. Visit `admin-profile-approvals.html`
2. Browser will ask for permission
3. Click "Allow" for notifications
4. Now you'll see desktop notifications

### Already Denied?
**Firefox:**
- Click lock icon → Site Settings → Reset permissions

**Chrome:**
- Click lock icon → Site Settings → Notifications → Allow

**Safari:**
- System Preferences → Notifications → Allow

---

## Features Explained

### Notification Badge
```
Dashboard → Approvals badge (red number)
    ↓
Shows count of pending approvals
    ↓
Updates every 10 seconds
    ↓
Click to go to approvals page
```

### Notification Panel
```
Click bell icon → Panel opens
    ↓
Shows all notifications (newest first)
    ↓
Shows time: "Just now" or "5m ago"
    ↓
Delete individual notifications
    ↓
Auto-mark as read when clicked
```

### Toast Alert
```
New approval comes in
    ↓
Toast appears: "You have 1 new approval request(s)!"
    ↓
Auto-dismiss after 5 seconds
    ↓
Or manually dismiss
```

---

## API Functions Available

### Get Notifications:
```javascript
getAllNotifications()              // All notifications
getUnreadNotifications()           // Only unread
getUnreadNotificationCount()       // Number count
getPendingNotifications()          // Only NEW_APPROVAL_REQUEST type
```

### Manage Notifications:
```javascript
markNotificationAsRead(id)         // Mark single as read
markAllNotificationsAsRead()       // Mark all as read
deleteNotification(id)             // Delete a notification
```

### Create Notifications:
```javascript
createNotification(type, data)     // General create
testCreateNotification()           // Test function
```

### Request Permissions:
```javascript
requestNotificationPermission()    // Ask user for browser notifications
```

---

## Troubleshooting

### Notifications Not Appearing?

**1. Check localStorage:**
```javascript
// Open browser console and check:
JSON.parse(localStorage.getItem('workbridge_notifications'))
```
If empty, notifications weren't created.

**2. Check browser permission:**
- Make sure browser notifications are enabled in settings

**3. Test the system:**
```javascript
testCreateNotification()  // Run this in console
```

**4. Check console for errors:**
- Right-click → Inspect → Console tab
- Look for red error messages

### Badge Not Updating?

```javascript
// Force update from console:
updateApprovalsBadge()
updateNotificationBadge()
```

### Notifications Taking Time to Appear?

- Checks happen every 5-10 seconds
- Refresh page to see immediate update
- Notifications are real-time on same browser session

---

## Security & Privacy

- All notifications stored in **browser localStorage** (not sent to server)
- Desktop notifications require browser permission
- Each admin account is isolated in localStorage
- Clear browser data = notifications deleted

---

## Future Enhancements

- Email notifications to admin
- SMS alerts for urgent approvals
- Notification history with search
- Notification preferences/settings
- Batch notifications
- Schedule notifications

---

## Quick Start

1. ✅ Create a new test user account
2. ✅ Go to `admin-profile-approvals.html`
3. ✅ Look for notification bell icon
4. ✅ Check badge count
5. ✅ Click bell to see details
6. ✅ Approve/Reject the profile

All done! Admin will now always know when new profiles are submitted. 🔔
