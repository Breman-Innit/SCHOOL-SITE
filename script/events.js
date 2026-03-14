// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
});

// ===========================================
// FIREBASE - LOAD EVENTS FROM DATABASE
// ===========================================

// Reference to the events grid
const eventsGrid = document.getElementById('eventsGrid');

// Function to load events from Firebase
async function loadEvents() {
    try {
        // Show loading state
        eventsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin"></i> Loading events...</div>';
        
        // Get events from Firestore
        const querySnapshot = await window.db.collection('events').get();
        
        // Clear loading message
        eventsGrid.innerHTML = '';
        
        if (querySnapshot.empty) {
            eventsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;">No events found.</div>';
            return;
        }
        
        // Loop through each event document
        querySnapshot.forEach(doc => {
            const event = doc.data();
            const eventId = doc.id;
            
            // Create event card HTML
            const eventCard = createEventCard(event, eventId);
            eventsGrid.innerHTML += eventCard;
        });
        
        // Re-attach event listeners for filter buttons and calendar buttons
        attachEventListeners();
        
    } catch (error) {
        console.error("Error loading events:", error);
        eventsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px; color: #e74c3c;"><i class="fas fa-exclamation-triangle"></i> Error loading events. Please try again.</div>';
    }
}

// Function to create event card HTML
function createEventCard(event, eventId) {
    // Set default values if fields are missing
    const title = event.title || 'Untitled Event';
    const category = event.category || 'general';
    const description = event.description || 'No description available.';
    const date = event.date || 'TBD';
    const time = event.time || 'Time TBD';
    const location = event.location || 'Location TBD';
    const image = event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
    const featured = event.featured || false;
    const day = event.day || new Date(date).getDate() || '15';
    const month = event.month || new Date(date).toLocaleString('default', { month: 'short' }).toUpperCase() || 'MAR';
    
    // Determine card classes
    const cardClasses = `event-card ${featured ? 'featured' : ''} fade-in`;
    const categoryAttr = `academic sports arts community`.includes(category) ? category : 'general';
    
    return `
        <div class="${cardClasses}" data-category="${categoryAttr}" data-id="${eventId}">
            ${featured ? '<div class="event-badge">Featured</div>' : ''}
            <div class="event-image" style="background-image: url('${image}');">
                <div class="event-date">
                    <span class="day">${day}</span>
                    <span class="month">${month}</span>
                </div>
            </div>
            <div class="event-content">
                <span class="event-category">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                <h3 class="event-title">${title}</h3>
                <div class="event-meta">
                    <div class="event-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>${time}</span>
                    </div>
                    <div class="event-meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${location}</span>
                    </div>
                </div>
                <p class="event-description">${description}</p>
                <div class="event-actions">
                    <button class="btn btn-primary add-to-calendar">
                        <i class="fas fa-calendar-plus"></i> Add to Calendar
                    </button>
                    <button class="btn btn-outline learn-more">
                        <i class="fas fa-info-circle"></i> Learn More
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Function to attach event listeners
function attachEventListeners() {
    // Filter buttons functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            eventCards.forEach(card => {
                if (filterValue === 'all') {
                    card.style.display = 'block';
                } else {
                    const cardCategory = card.getAttribute('data-category');
                    if (cardCategory && cardCategory.includes(filterValue)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // Add to Calendar functionality
    document.querySelectorAll('.add-to-calendar').forEach(button => {
        button.addEventListener('click', function() {
            const eventCard = this.closest('.event-card');
            const eventTitle = eventCard.querySelector('.event-title').textContent;
            alert(`"${eventTitle}" has been added to your calendar! (Demo only)`);
        });
    });
}

// Load events when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadEvents();
    
    // Also keep your scroll animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(element);
    });
});

// Newsletter form submission
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('.newsletter-input').value;
    alert(`Thank you for subscribing with ${email}! You'll receive our next events newsletter.`);
    this.reset();
});