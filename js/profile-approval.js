/**
 * WorkBridge Profile Approval System
 * Manages user profile approvals and Excel export
 */

/**
 * Create approval request when user signs up
 */
window.createApprovalRequest = function (userData) {
    const approvalRequest = {
        id: 'APR_' + Date.now(),
        userId: userData.email,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        earningPlan: userData.earning_plan,
        status: 'pending', // pending, approved, rejected
        createdAt: new Date().toISOString(),
        approvedAt: null,
        approvedBy: null,
        rejectionReason: null,
        userData: userData
    };

    // Get existing approval requests
    let approvals = JSON.parse(localStorage.getItem('workbridge_approvals') || '[]');
    
    // Check if already exists
    if (!approvals.find(a => a.userId === userData.email)) {
        approvals.push(approvalRequest);
        localStorage.setItem('workbridge_approvals', JSON.stringify(approvals));
        
        // Create notification for admin
        createNotification('NEW_APPROVAL_REQUEST', {
            approvalId: approvalRequest.id,
            userName: userData.name,
            userEmail: userData.email,
            timestamp: new Date().toISOString()
        });
        
        console.log('Approval request created for:', userData.email);
        return approvalRequest;
    }
    return null;
};

/**
 * Create a notification for admin
 */
window.createNotification = function (type, data) {
    const notification = {
        id: 'NOTIF_' + Date.now(),
        type: type, // NEW_APPROVAL_REQUEST, APPROVAL_STATUS_CHANGE
        data: data,
        isRead: false,
        createdAt: new Date().toISOString()
    };

    let notifications = JSON.parse(localStorage.getItem('workbridge_notifications') || '[]');
    notifications.unshift(notification); // Add to beginning
    
    // Keep only last 100 notifications
    notifications = notifications.slice(0, 100);
    
    localStorage.setItem('workbridge_notifications', JSON.stringify(notifications));
    
    // Show browser notification if available
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Profile Approval Request', {
            body: `${data.userName} (${data.userEmail}) has submitted a profile for approval.`,
            icon: 'https://ui-avatars.com/api/?name=WorkBridge&background=0066cc',
            tag: notification.id
        });
    }
    
    return notification;
};

/**
 * Request browser notification permission
 */
window.requestNotificationPermission = function () {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
};

/**
 * Get unread notifications
 */
window.getUnreadNotifications = function () {
    const notifications = JSON.parse(localStorage.getItem('workbridge_notifications') || '[]');
    return notifications.filter(n => !n.isRead);
};

/**
 * Get all notifications
 */
window.getAllNotifications = function () {
    return JSON.parse(localStorage.getItem('workbridge_notifications') || '[]');
};

/**
 * Get unread notification count
 */
window.getUnreadNotificationCount = function () {
    return getUnreadNotifications().length;
};

/**
 * Mark notification as read
 */
window.markNotificationAsRead = function (notificationId) {
    let notifications = JSON.parse(localStorage.getItem('workbridge_notifications') || '[]');
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
        notification.isRead = true;
        localStorage.setItem('workbridge_notifications', JSON.stringify(notifications));
    }
};

/**
 * Mark all notifications as read
 */
window.markAllNotificationsAsRead = function () {
    let notifications = JSON.parse(localStorage.getItem('workbridge_notifications') || '[]');
    notifications.forEach(n => n.isRead = true);
    localStorage.setItem('workbridge_notifications', JSON.stringify(notifications));
};

/**
 * Delete notification
 */
window.deleteNotification = function (notificationId) {
    let notifications = JSON.parse(localStorage.getItem('workbridge_notifications') || '[]');
    notifications = notifications.filter(n => n.id !== notificationId);
    localStorage.setItem('workbridge_notifications', JSON.stringify(notifications));
};

/**
 * Get pending approval notifications
 */
window.getPendingNotifications = function () {
    const notifications = getAllNotifications();
    return notifications.filter(n => n.type === 'NEW_APPROVAL_REQUEST');
};

/**
 * Get notification count by type
 */
window.getNotificationCountByType = function (type) {
    const notifications = getAllNotifications();
    return notifications.filter(n => n.type === type && !n.isRead).length;
};

/**
 * Get all pending approvals
 */
window.getPendingApprovals = function () {
    const approvals = JSON.parse(localStorage.getItem('workbridge_approvals') || '[]');
    return approvals.filter(a => a.status === 'pending');
};

/**
 * Get all approval requests with filtering
 */
window.getAllApprovals = function (status = null) {
    const approvals = JSON.parse(localStorage.getItem('workbridge_approvals') || '[]');
    if (status) {
        return approvals.filter(a => a.status === status);
    }
    return approvals;
};

/**
 * Approve a user profile
 */
window.approveUserProfile = function (requestId, adminEmail) {
    const approvals = JSON.parse(localStorage.getItem('workbridge_approvals') || '[]');
    const approval = approvals.find(a => a.id === requestId);

    if (!approval) {
        console.error('Approval request not found');
        return { success: false, message: 'Approval request not found' };
    }

    // Update approval request
    approval.status = 'approved';
    approval.approvedAt = new Date().toISOString();
    approval.approvedBy = adminEmail;

    // Update user profile status
    approval.userData.profileStatus = 'approved';

    // Store updated approval
    localStorage.setItem('workbridge_approvals', JSON.stringify(approvals));

    // Update user in workbridge_all_users if exists
    let allUsers = JSON.parse(localStorage.getItem('workbridge_all_users') || '[]');
    const userIndex = allUsers.findIndex(u => u.email === approval.email);
    if (userIndex !== -1) {
        allUsers[userIndex].profileStatus = 'approved';
        localStorage.setItem('workbridge_all_users', JSON.stringify(allUsers));
    }

    console.log('Profile approved for:', approval.email);
    return { success: true, message: 'Profile approved successfully', approval: approval };
};

/**
 * Reject a user profile
 */
window.rejectUserProfile = function (requestId, rejectionReason, adminEmail) {
    const approvals = JSON.parse(localStorage.getItem('workbridge_approvals') || '[]');
    const approval = approvals.find(a => a.id === requestId);

    if (!approval) {
        console.error('Approval request not found');
        return { success: false, message: 'Approval request not found' };
    }

    // Update approval request
    approval.status = 'rejected';
    approval.approvedAt = new Date().toISOString();
    approval.approvedBy = adminEmail;
    approval.rejectionReason = rejectionReason;

    // Update user profile status
    approval.userData.profileStatus = 'rejected';

    // Store updated approval
    localStorage.setItem('workbridge_approvals', JSON.stringify(approvals));

    // Update user in workbridge_all_users if exists
    let allUsers = JSON.parse(localStorage.getItem('workbridge_all_users') || '[]');
    const userIndex = allUsers.findIndex(u => u.email === approval.email);
    if (userIndex !== -1) {
        allUsers[userIndex].profileStatus = 'rejected';
        localStorage.setItem('workbridge_all_users', JSON.stringify(allUsers));
    }

    console.log('Profile rejected for:', approval.email);
    return { success: true, message: 'Profile rejected successfully', approval: approval };
};

/**
 * Download user approvals as Excel
 * Requires SheetJS library to be loaded
 */
window.downloadApprovalsAsExcel = function () {
    // Check if SheetJS is available
    if (typeof XLSX === 'undefined') {
        alert('Please load SheetJS library first. Add this to your HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js"><\/script>');
        return false;
    }

    const approvals = JSON.parse(localStorage.getItem('workbridge_approvals') || '[]');

    if (approvals.length === 0) {
        alert('No approval records found');
        return false;
    }

    // Prepare data for Excel
    const data = approvals.map(approval => ({
        'Request ID': approval.id,
        'Name': approval.name,
        'Email': approval.email,
        'Phone': approval.phone,
        'Earning Plan': approval.earningPlan,
        'Status': approval.status.charAt(0).toUpperCase() + approval.status.slice(1),
        'Applied Date': new Date(approval.createdAt).toLocaleDateString(),
        'Approved/Rejected Date': approval.approvedAt ? new Date(approval.approvedAt).toLocaleDateString() : 'N/A',
        'Approved By': approval.approvedBy || 'N/A',
        'Rejection Reason': approval.rejectionReason || 'N/A'
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Approvals');

    // Set column widths for better readability
    worksheet['!cols'] = [
        { wch: 15 }, // Request ID
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 20 }, // Earning Plan
        { wch: 12 }, // Status
        { wch: 15 }, // Applied Date
        { wch: 20 }, // Approved/Rejected Date
        { wch: 20 }, // Approved By
        { wch: 30 }  // Rejection Reason
    ];

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `UserApprovals_${timestamp}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
    return true;
};

/**
 * Download all user data as Excel
 */
window.downloadAllUsersAsExcel = function () {
    if (typeof XLSX === 'undefined') {
        alert('Please load SheetJS library first. Add this to your HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js"><\/script>');
        return false;
    }

    const allUsers = JSON.parse(localStorage.getItem('workbridge_all_users') || '[]');

    if (allUsers.length === 0) {
        alert('No user records found');
        return false;
    }

    // Prepare data for Excel
    const data = allUsers.map(user => ({
        'Name': user.name,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'Role': user.role || 'user',
        'Profile Status': user.profileStatus || 'none',
        'Earning Plan': user.earning_plan || 'N/A',
        'Is Verified': user.isVerified ? 'Yes' : 'No',
        'Join Date': user.loginDate ? new Date(user.loginDate).toLocaleDateString() : 'N/A'
    }));

    // Create workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'All Users');

    // Set column widths
    worksheet['!cols'] = [
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 12 }, // Role
        { wch: 15 }, // Profile Status
        { wch: 20 }, // Earning Plan
        { wch: 12 }, // Is Verified
        { wch: 15 }  // Join Date
    ];

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `AllUsers_${timestamp}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
    return true;
};

/**
 * Download detailed approval report
 */
window.downloadApprovalReport = function () {
    if (typeof XLSX === 'undefined') {
        alert('Please load SheetJS library first. Add this to your HTML: <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.min.js"><\/script>');
        return false;
    }

    const approvals = JSON.parse(localStorage.getItem('workbridge_approvals') || '[]');

    if (approvals.length === 0) {
        alert('No approval records found');
        return false;
    }

    // Separate by status
    const pending = approvals.filter(a => a.status === 'pending');
    const approved = approvals.filter(a => a.status === 'approved');
    const rejected = approvals.filter(a => a.status === 'rejected');

    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
        { 'Category': 'Total Requests', 'Count': approvals.length },
        { 'Category': 'Pending', 'Count': pending.length },
        { 'Category': 'Approved', 'Count': approved.length },
        { 'Category': 'Rejected', 'Count': rejected.length }
    ];
    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Pending approvals sheet
    if (pending.length > 0) {
        const pendingData = pending.map(a => ({
            'ID': a.id,
            'Name': a.name,
            'Email': a.email,
            'Phone': a.phone,
            'Plan': a.earningPlan,
            'Applied Date': new Date(a.createdAt).toLocaleDateString()
        }));
        const pendingSheet = XLSX.utils.json_to_sheet(pendingData);
        pendingSheet['!cols'] = [
            { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(workbook, pendingSheet, 'Pending');
    }

    // Approved approvals sheet
    if (approved.length > 0) {
        const approvedData = approved.map(a => ({
            'ID': a.id,
            'Name': a.name,
            'Email': a.email,
            'Phone': a.phone,
            'Plan': a.earningPlan,
            'Applied Date': new Date(a.createdAt).toLocaleDateString(),
            'Approved Date': new Date(a.approvedAt).toLocaleDateString(),
            'Approved By': a.approvedBy
        }));
        const approvedSheet = XLSX.utils.json_to_sheet(approvedData);
        approvedSheet['!cols'] = [
            { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }
        ];
        XLSX.utils.book_append_sheet(workbook, approvedSheet, 'Approved');
    }

    // Rejected approvals sheet
    if (rejected.length > 0) {
        const rejectedData = rejected.map(a => ({
            'ID': a.id,
            'Name': a.name,
            'Email': a.email,
            'Phone': a.phone,
            'Plan': a.earningPlan,
            'Applied Date': new Date(a.createdAt).toLocaleDateString(),
            'Rejected Date': new Date(a.approvedAt).toLocaleDateString(),
            'Rejected By': a.approvedBy,
            'Reason': a.rejectionReason
        }));
        const rejectedSheet = XLSX.utils.json_to_sheet(rejectedData);
        rejectedSheet['!cols'] = [
            { wch: 15 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 30 }
        ];
        XLSX.utils.book_append_sheet(workbook, rejectedSheet, 'Rejected');
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `ApprovalReport_${timestamp}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
    return true;
};

console.log('Profile Approval System loaded successfully');

/**
 * TEST FUNCTION - Create a test notification (for debugging)
 * Run this in browser console: testCreateNotification()
 */
window.testCreateNotification = function() {
    createNotification('NEW_APPROVAL_REQUEST', {
        approvalId: 'TEST_' + Date.now(),
        userName: 'Test User',
        userEmail: 'testuser@example.com',
        timestamp: new Date().toISOString()
    });
    console.log('Test notification created! Check admin-profile-approvals.html');
    return true;
};
