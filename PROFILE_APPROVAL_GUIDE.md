# User Profile Approval System & Excel Export Guide

## Overview
Your WorkBridge platform now has a complete user profile approval system with Excel export functionality. When users sign up or create accounts, they must be approved by an admin before their profile is fully active.

---

## System Features

### 1. **User Registration & Approval Flow**
- When a user signs up (via email/password or Google), an approval request is automatically created
- User profile status changes to "pending" until admin approves
- Admin receives all pending requests in the Profile Approvals dashboard

### 2. **Admin Profile Approvals Management**
Access the management dashboard at: `admin-profile-approvals.html`

**Features:**
- View all pending, approved, and rejected approval requests
- Real-time statistics showing counts for each status
- Filter profiles by status (All, Pending, Approved, Rejected)
- View detailed user information
- Approve or reject profiles with optional rejection reasons

### 3. **Excel Export Functionality**
The system includes three export options:

#### **Option 1: Export Approvals**
- Downloads all approval requests
- Includes: Request ID, Name, Email, Phone, Plan, Status, Dates, Approved By, Rejection Reason

#### **Option 2: Export Full Report**
- Creates a multi-sheet Excel file with summary:
  - Summary sheet with approval counts
  - Pending approvals sheet
  - Approved profiles sheet
  - Rejected profiles sheet

#### **Option 3: Export All Users**
- Downloads complete user database
- Includes: Name, Email, Phone, Role, Profile Status, Earning Plan, Verification Status, Join Date

---

## Technical Implementation

### Files Created/Modified:

#### **New Files:**
- `js/profile-approval.js` - Core approval system and Excel export functions
- `admin-profile-approvals.html` - Admin dashboard for managing approvals

#### **Updated Files:**
- `js/auth.js` - Modified to create approval requests on signup/login
- `index.html`, `home.html`, `jobs.html`, `profiles.html`, `donations.html`, `services.html`, `news.html`, `dashboard.html`, and all category pages - Added profile-approval.js script
- `news-detail.html` - Added profile-approval.js and auth.js scripts

### Data Storage (LocalStorage):

**Approval Requests:** `workbridge_approvals`
```json
{
  "id": "APR_1234567890",
  "userId": "user@email.com",
  "name": "User Name",
  "email": "user@email.com",
  "phone": "+92XXXXXXXXXX",
  "role": "user",
  "earningPlan": "Free Visitor Plan",
  "status": "pending|approved|rejected",
  "createdAt": "2026-03-05T10:30:00Z",
  "approvedAt": "2026-03-05T15:45:00Z",
  "approvedBy": "admin@email.com",
  "rejectionReason": "Optional reason if rejected"
}
```

**All Users:** `workbridge_all_users`
- Updated with profileStatus field
- Tracks all registered users across the platform

---

## How to Use

### For Users:
1. Sign up normally via email/password or Google authentication
2. After signup, they'll see a "Pending Approval" status on their profile
3. Wait for admin to approve their profile
4. Once approved, they can access all features

### For Admins:
1. Navigate to **Profile Approvals** in the admin menu
2. Review pending requests with user details
3. Click **View** to see full user information
4. Click **Approve** to accept the profile
5. Click **Reject** to deny (must provide reason)
6. Use export buttons to download data as Excel:
   - Export Approvals
   - Export Report (multi-sheet summary)
   - Export All Users

### Admin Menu Navigation:
- Dashboard - Main admin dashboard
- Donations - Donation management
- **Profile Approvals** - New approval management
- News Management - News administration
- Logout

---

## Excel Export Features

### Requirements:
- SheetJS library is already loaded (CDN link in admin-profile-approvals.html)
- Works on all modern browsers

### Export Formats:
1. **Single Sheet - Approvals Only**
   - All approval records with complete details
   - Columns: Request ID, Name, Email, Phone, Plan, Status, Dates, etc.

2. **Multi-Sheet Report**
   - Summary (counts by status)
   - Pending (pending requests only)
   - Approved (approved profiles)
   - Rejected (rejected profiles with reasons)

3. **All Users Export**
   - Complete user database
   - Name, Email, Phone, Role, Status, Earning Plan, etc.

### File Naming:
- Automatically dated: `UserApprovals_2026-03-05.xlsx`
- Or: `ApprovalReport_2026-03-05.xlsx`
- Or: `AllUsers_2026-03-05.xlsx`

---

## Profile Status Flow

```
New User Registration
    ↓
Auto-create "pending" approval request
    ↓
Admin Reviews in Profile Approvals Dashboard
    ↓
Admin Decision
├─ Approve → Status: "approved" ✓
├─ Reject → Status: "rejected" with reason ✗
└─ No action → Status: "pending"
```

---

## Key Functions Reference

### In `js/profile-approval.js`:

```javascript
// Create approval request (auto-called on signup)
createApprovalRequest(userData)

// Get pending approvals
getPendingApprovals()

// Get all approvals (filtered by status)
getAllApprovals(status)

// Approve a profile
approveUserProfile(requestId, adminEmail)

// Reject a profile
rejectUserProfile(requestId, rejectionReason, adminEmail)

// Download Excel files
downloadApprovalsAsExcel()
downloadApprovalReport()
downloadAllUsersAsExcel()
```

---

## Admin Dashboard - What You'll See

### Statistics Cards:
- **Pending Approvals** (Orange) - Users waiting for approval
- **Approved Profiles** (Green) - Users already approved
- **Rejected Profiles** (Red) - Rejected applications
- **Total Requests** (Blue) - Total requests received

### Action Buttons:
- **View** (Eye icon) - See full user details
- **Approve** (Check icon) - Accept the profile
- **Reject** (X icon) - Reject with reason
- **Export** buttons - Download data

---

## Testing the System

1. **Create a test account** via any public page
2. **Check admin panel** - Request should appear as "Pending"
3. **Approve the profile** - Status changes to "Approved"
4. **Export data** - Download as Excel to verify
5. **Try rejection** - Reject another profile with a reason
6. **Check exports** - View different export formats

---

## Security Notes

- Only users with `role: 'admin'` can access the admin panel
- Approval status stored in localStorage (update to backend for production)
- Admin email stamped on approval/rejection actions
- Each approval request has a unique ID for tracking

---

## Future Enhancements

- Backend database integration
- Email notifications on approval/rejection
- Bulk actions (approve multiple at once)
- Advanced filtering and search
- User verification documents
- Approval history/audit logs

---

For questions or issues, refer to the profile-approval.js and admin-profile-approvals.html files for implementation details.
