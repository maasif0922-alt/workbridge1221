/**
 * Earning Dashboard Logic
 * Handles Points, Timers, and Task Submissions
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Check Authentication and Plan
    const userStr = localStorage.getItem('workbridge_user');
    if (!userStr) {
        window.location.href = './index.html';
        return;
    }

    const user = JSON.parse(userStr);
    const planName = user.earning_plan || "Free Visitor Plan";

    document.getElementById('welcome-msg').textContent = `Welcome, ${user.name}`;
    document.getElementById('user-plan-display').textContent = planName;

    // 2. Load Earning Profile
    let profile = JSON.parse(localStorage.getItem('earning_profile')) || {
        points: 0,
        earnings: 0,
        activeTime: 0,
        isTimerRunning: false,
        completedTasks: [],
        joinDate: new Date().toISOString()
    };

    // 3. Define Plan Configurations
    const PLAN_CONFIG = {
        "Free Visitor": {
            pointsPerDollar: 100,
            dailyLimit: 20, // max points per day
            tasks: [
                { id: "free_1", title: "Active Time Focus", desc: "Stay active on the dashboard for 10 minutes.", reward: 10, type: "timer", targetSeconds: 600 },
                { id: "free_2", title: "Promote WorkBridge", desc: "Share website on Facebook/WhatsApp and upload proof.", reward: 10, type: "upload" }
            ]
        },
        "Task Promoter": {
            pointsPerDollar: 100,
            tasks: [
                { id: "promoter_1", title: "Daily Mega Task", desc: "Promote our daily sponsor link / video on your timeline.", reward: 30, type: "upload" }
            ]
        },
        "Business Promotion": {
            pointsPerDollar: 200,
            tasks: [
                { id: "biz_1", title: "Like Official Page", desc: "Like the sponsor's social media page.", reward: 10, type: "upload" },
                { id: "biz_2", title: "Share Campaign", desc: "Share the business campaign post.", reward: 10, type: "upload" },
                { id: "biz_3", title: "Visit Website", desc: "Visit the sponsor's website for 2 minutes.", reward: 10, type: "upload" },
                { id: "biz_4", title: "Leave a Review", desc: "Leave a positive 5-star review.", reward: 10, type: "upload" },
                { id: "biz_5", title: "Watch Ad full", desc: "Watch the latest sponsored video Ad.", reward: 10, type: "upload" }
            ]
        }
    };

    // Determine config to use based on matched plan name
    let activeConfig = PLAN_CONFIG["Free Visitor"];
    if (planName.includes("Promoter")) activeConfig = PLAN_CONFIG["Task Promoter"];
    if (planName.includes("Business")) activeConfig = PLAN_CONFIG["Business Promotion"];

    // 4. Update UI Values
    function updateUI() {
        document.getElementById('total-points').textContent = profile.points;
        const calcEarnings = (profile.points / activeConfig.pointsPerDollar).toFixed(2);
        profile.earnings = calcEarnings;
        document.getElementById('total-earnings').textContent = `$${calcEarnings}`;

        // Save back
        localStorage.setItem('earning_profile', JSON.stringify(profile));

        // Render Info List
        const infoList = document.getElementById('plan-info-list');
        infoList.innerHTML = `
            <li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);"><i class="fa-solid fa-arrow-right-arrow-left"></i> Conversion Rate: <strong>${activeConfig.pointsPerDollar} pts = $1</strong></li>
            <li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);"><i class="fa-solid fa-money-bill"></i> Min. Withdrawal: <strong>$5.00</strong></li>
            <li style="padding: 0.5rem 0;"><i class="fa-solid fa-calendar-check"></i> Member Since: <strong>${new Date(profile.joinDate).toLocaleDateString()}</strong></li>
        `;
        renderTasks();
    }

    // 5. Check if tasks reset today
    const lastLogin = localStorage.getItem('last_earning_login_date');
    const todayStr = new Date().toDateString();
    if (lastLogin !== todayStr) {
        // New day, reset daily tasks
        profile.activeTime = 0;
        // Keep completed items that are NOT from today ? For simplicity, we just empty daily tasks
        // In reality, might want history. We'll just reset status for today
        profile.completedTasks = [];
        localStorage.setItem('last_earning_login_date', todayStr);
    }
    updateUI();

    // 6. Active Timer Logic (For Free Plan ONLY)
    if (planName.includes("Free")) {
        document.getElementById('time-progress-container').style.display = 'block';
        const timerTask = activeConfig.tasks.find(t => t.type === 'timer');

        let timerInterval = setInterval(() => {
            if (profile.activeTime < timerTask.targetSeconds && !profile.completedTasks.includes(timerTask.id)) {
                profile.activeTime += 1; // 1 second

                // Format MM:SS
                const m = Math.floor(profile.activeTime / 60).toString().padStart(2, '0');
                const s = (profile.activeTime % 60).toString().padStart(2, '0');
                document.getElementById('active-time').textContent = `${m}:${s}`;

                // Progress Bar
                const pct = (profile.activeTime / timerTask.targetSeconds) * 100;
                document.getElementById('time-progress-fill').style.width = `${pct}%`;

                // Task completion
                if (profile.activeTime >= timerTask.targetSeconds) {
                    clearInterval(timerInterval);
                    completeTaskInstant(timerTask);
                }

                // Save periodically (every 5s)
                if (profile.activeTime % 5 === 0) {
                    localStorage.setItem('earning_profile', JSON.stringify(profile));
                }
            } else if (profile.completedTasks.includes(timerTask.id)) {
                document.getElementById('active-time').textContent = `10:00`;
                document.getElementById('time-progress-fill').style.width = `100%`;
                clearInterval(timerInterval);
            }
        }, 1000);
    }

    // 7. Render Tasks
    function renderTasks() {
        const container = document.getElementById('tasks-container');
        container.innerHTML = '';

        // Also check pending Admin tasks
        const pendingAdmin = JSON.parse(localStorage.getItem('admin_pending_tasks') || '[]');

        activeConfig.tasks.forEach(task => {
            const isCompleted = profile.completedTasks.includes(task.id);
            const isPendingAdmin = pendingAdmin.some(pt => pt.taskId === task.id && pt.userEmail === user.email);

            let btnHtml = '';
            let styleClass = '';

            if (isCompleted) {
                btnHtml = `<span class="badge-completed"><i class="fa-solid fa-check"></i> Done (+${task.reward} pts)</span>`;
                styleClass = "opacity: 0.6;";
            } else if (isPendingAdmin) {
                btnHtml = `<span class="badge-pending"><i class="fa-solid fa-clock-rotate-left"></i> In Review</span>`;
            } else {
                if (task.type === 'upload') {
                    btnHtml = `<button class="btn btn-primary" onclick="openProofModal('${task.id}')" style="font-size: 0.8rem; padding: 0.4rem 0.8rem;">Upload Proof</button>`;
                } else if (task.type === 'timer') {
                    btnHtml = `<span class="badge-pending" style="background:#e0f2fe; color:#0284c7;">In Progress...</span>`;
                }
            }

            container.innerHTML += `
                <div class="task-card" style="${styleClass}">
                    <div class="task-info">
                        <div class="task-title">${task.title}</div>
                        <div class="task-desc">${task.desc}</div>
                    </div>
                    <div class="task-action" style="min-width: 120px; text-align: right;">
                        <span style="font-weight: 700; color: var(--primary-color); margin-bottom: 0.25rem;">+${task.reward} pts</span>
                        ${btnHtml}
                    </div>
                </div>
            `;
        });
    }

    // 8. Handle Upload Modal
    window.openProofModal = function (taskId) {
        document.getElementById('task-id-input').value = taskId;
        document.getElementById('upload-modal').style.display = 'flex';
    };

    window.closeUploadModal = function () {
        document.getElementById('upload-modal').style.display = 'none';
        document.getElementById('proof-upload-form').reset();
    };

    document.getElementById('proof-upload-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const taskId = document.getElementById('task-id-input').value;
        const taskObj = activeConfig.tasks.find(t => t.id === taskId);

        // Mock pushing to Admin Dashboard
        const pendingAdmin = JSON.parse(localStorage.getItem('admin_pending_tasks') || '[]');
        pendingAdmin.push({
            id: Date.now().toString(),
            date: new Date().toLocaleDateString(),
            userEmail: user.email,
            userName: user.name,
            planName: planName,
            taskId: taskId,
            taskTitle: taskObj.title,
            reward: taskObj.reward,
            status: 'Pending'
        });
        localStorage.setItem('admin_pending_tasks', JSON.stringify(pendingAdmin));

        alert("Proof uploaded successfully! Admin will review and credit points shortly.");
        closeUploadModal();
        renderTasks(); // Re-render to show "In Review" status
    });

    // 9. Instant Task Completion (for Timers)
    function completeTaskInstant(taskObj) {
        if (!profile.completedTasks.includes(taskObj.id)) {
            profile.completedTasks.push(taskObj.id);
            profile.points += taskObj.reward;
            updateUI();
        }
    }

    // 10. Withdrawal
    window.requestWithdrawal = function () {
        const earnings = parseFloat(profile.earnings);
        if (earnings < 5.00) {
            alert(`Minimum withdrawal is $5.00. Your estimated earnings are $${earnings.toFixed(2)}. Keep completing tasks!`);
        } else {
            alert("Withdrawal request initiated. Our admin team will contact you via registered email for payment details.");
            // Reset points (optional logic)
            profile.points = 0;
            updateUI();
        }
    };
});
