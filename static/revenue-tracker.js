
// Revenue Tracking System
class RevenueTracker {
    constructor() {
        this.dailyRevenue = 0;
        this.monthlyRevenue = 0;
        this.adClicks = 0;
    }
    
    trackAdClick(adType, revenue = 0.10) {
        this.adClicks++;
        this.dailyRevenue += revenue;
        this.monthlyRevenue += revenue;
        
        // Save to localStorage
        localStorage.setItem('adRevenue', JSON.stringify({
            daily: this.dailyRevenue,
            monthly: this.monthlyRevenue,
            clicks: this.adClicks,
            lastUpdate: new Date()
        }));
        
        console.log(`Ad clicked! Revenue: $${revenue}`);
    }
    
    getStats() {
        return {
            daily: this.dailyRevenue.toFixed(2),
            monthly: this.monthlyRevenue.toFixed(2),
            clicks: this.adClicks
        };
    }
}

// Initialize tracker
const revenueTracker = new RevenueTracker();

// Track all ad clicks
document.addEventListener('click', function(e) {
    if (e.target.closest('.ad-banner') || e.target.closest('.ad-rectangle')) {
        revenueTracker.trackAdClick('banner', Math.random() * 0.50 + 0.05);
    }
});
// Live Revenue Tracking & Real-time Features
class LiveTracker {
    constructor() {
        this.earnings = 87350;
        this.activeUsers = 5847;
        this.todayEarnings = 1240;
        this.init();
    }

    init() {
        this.startLiveUpdates();
        this.createNotificationSystem();
        this.startEarningsTicker();
    }

    startLiveUpdates() {
        // Update earnings every 5-15 seconds
        setInterval(() => {
            this.updateLiveStats();
        }, Math.random() * 10000 + 5000);
    }

    updateLiveStats() {
        // Simulate real earnings
        const earning = (Math.random() * 20 + 5).toFixed(2);
        this.earnings += parseFloat(earning);
        this.todayEarnings += parseFloat(earning);
        
        // Update active users occasionally
        if (Math.random() < 0.3) {
            this.activeUsers += Math.random() < 0.5 ? 1 : -1;
        }

        // Update DOM
        this.updateStatsDisplay();
        this.showEarningNotification(earning);
    }

    updateStatsDisplay() {
        const earningsEl = document.querySelector('[data-target="87350"] .counter');
        const usersEl = document.querySelector('[data-target="5847"] .counter');
        const todayEl = document.querySelector('.live-indicator:contains("TODAY")');

        if (earningsEl) earningsEl.textContent = `$${this.earnings.toLocaleString()}`;
        if (usersEl) usersEl.textContent = this.activeUsers.toLocaleString();
        if (todayEl) todayEl.textContent = `💰 TODAY: +$${this.todayEarnings.toLocaleString()}`;
    }

    showEarningNotification(amount) {
        const names = ['Ahmed S.', 'Fatima M.', 'Mohamed A.', 'Khadija H.', 'Abdi K.', 'Sahra D.'];
        const name = names[Math.floor(Math.random() * names.length)];
        
        this.showNotification(`💰 ${name} just earned $${amount}!`, 'earning');
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `live-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        container.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 4000);

        // Manual close
        notification.querySelector('.notification-close').onclick = () => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        };
    }

    createNotificationSystem() {
        if (document.getElementById('notification-container')) return;

        const container = document.createElement('div');
        container.id = 'notification-container';
        container.innerHTML = '';
        document.body.appendChild(container);
    }

    startEarningsTicker() {
        const ticker = document.querySelector('.ticker-content');
        if (!ticker) return;

        // Add more dynamic updates
        setInterval(() => {
            const updates = ticker.querySelectorAll('.earning-update');
            const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
            const names = ['Ahmed S.', 'Fatima M.', 'Mohamed A.', 'Khadija H.', 'Sahra D.', 'Omar F.'];
            const name = names[Math.floor(Math.random() * names.length)];
            const amount = (Math.random() * 20 + 5).toFixed(2);
            
            randomUpdate.textContent = `${name} just earned $${amount}`;
        }, 8000);
    }
}

// Enhanced Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.closest('[data-target]')?.dataset.target || counter.textContent.replace(/\D/g, '') || 0);
        let current = 0;
        const increment = target / 100;
        const isPrice = counter.textContent.includes('$');
        const isPercent = counter.textContent.includes('%');

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isPrice) displayValue = `$${displayValue.toLocaleString()}`;
            if (isPercent) displayValue = `${displayValue}%`;
            
            counter.textContent = displayValue;
        }, 20);
    });
}

// Start live features
function startLiveUpdates() {
    window.liveTracker = new LiveTracker();
}

// Enhanced Earnings Ticker
function startEarningsTicker() {
    const ticker = document.getElementById('live-earnings-ticker');
    if (!ticker) return;

    ticker.style.display = 'block';
    
    // Add pause on hover
    ticker.addEventListener('mouseenter', () => {
        ticker.style.animationPlayState = 'paused';
    });
    
    ticker.addEventListener('mouseleave', () => {
        ticker.style.animationPlayState = 'running';
    });
}

// Export functions
window.startLiveUpdates = startLiveUpdates;
window.initializeCounters = initializeCounters;
window.startEarningsTicker = startEarningsTicker;
