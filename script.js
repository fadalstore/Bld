
// Countdown Timer
function updateCountdown() {
    const countdownElement = document.getElementById('countdown');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!countdownElement) return;
    
    // Get current time
    let hours = parseInt(hoursElement.textContent);
    let minutes = parseInt(minutesElement.textContent);
    let seconds = parseInt(secondsElement.textContent);
    
    // Decrease by 1 second
    seconds--;
    
    if (seconds < 0) {
        seconds = 59;
        minutes--;
        
        if (minutes < 0) {
            minutes = 59;
            hours--;
            
            if (hours < 0) {
                hours = 23;
            }
        }
    }
    
    // Update display
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
}

// Start countdown when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // Add click tracking for buttons
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // You can add analytics tracking here if needed
            console.log('CTA button clicked');
        });
    });
    
    // Smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add some visual effects
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const header = document.querySelector('header');
    
    if (header) {
        header.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});
