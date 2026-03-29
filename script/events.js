// ===========================================
// FIREBASE & EMAILJS CONFIGURATION
// ===========================================

// Initialize EmailJS
emailjs.init("CwH05MhdjatUiDqNy");

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCStWBZt502Xs2CWIEIZJdf4OL7eaI0Cr8",
    authDomain: "divine-grace-academy.firebaseapp.com",
    projectId: "divine-grace-academy",
    storageBucket: "divine-grace-academy.firebasestorage.app",
    messagingSenderId: "84424080855",
    appId: "1:84424080855:web:0d2d58926ada950a101f92"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Global variables
let allEvents = [];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let monthsWithEvents = new Set();

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ===========================================
// LOAD ALL EVENTS FROM FIREBASE
// ===========================================
async function loadAllEvents() {
    try {
        const querySnapshot = await db.collection('events').get();
        allEvents = [];
        monthsWithEvents.clear();
        
        querySnapshot.forEach(doc => {
            const eventData = doc.data();
            if (eventData.date) {
                allEvents.push({ id: doc.id, ...eventData });
                const eventDate = new Date(eventData.date);
                if (!isNaN(eventDate.getTime())) {
                    monthsWithEvents.add(`${eventDate.getFullYear()}-${eventDate.getMonth()}`);
                }
            }
        });
        
        displayEventsGrid();
        populateMonthSelector();
        renderCalendar(currentYear, currentMonth);
        renderTimeline();
        
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('eventsGrid').innerHTML = '<div style="text-align: center; padding: 40px; color: red;">Error loading events</div>';
    }
}

// ===========================================
// POPULATE MONTH SELECTOR DROPDOWN
// ===========================================
function populateMonthSelector() {
    const selector = document.getElementById('monthSelector');
    selector.innerHTML = '<option value="">📅 Jump to month with events</option>';
    
    const sortedMonths = Array.from(monthsWithEvents).sort();
    
    sortedMonths.forEach(monthKey => {
        const [year, month] = monthKey.split('-');
        const monthNum = parseInt(month);
        const monthName = monthNames[monthNum];
        const eventCount = allEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === parseInt(year) && eventDate.getMonth() === monthNum;
        }).length;
        
        const option = document.createElement('option');
        option.value = monthKey;
        option.textContent = `${monthName} ${year} (${eventCount} event${eventCount !== 1 ? 's' : ''}) 🎉`;
        selector.appendChild(option);
    });
    
    if (sortedMonths.length === 0) {
        selector.innerHTML = '<option value="">No events scheduled yet</option>';
    }
}

// ===========================================
// DISPLAY EVENTS GRID
// ===========================================
function displayEventsGrid() {
    const eventsGrid = document.getElementById('eventsGrid');
    
    if (allEvents.length === 0) {
        eventsGrid.innerHTML = '<div style="text-align: center; padding: 40px;">No events found.</div>';
        return;
    }

    eventsGrid.innerHTML = '';
    
    allEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        
        const card = `
            <div class="event-card ${event.featured ? 'featured' : ''}" data-category="${event.category || 'general'}">
                ${event.featured ? '<div class="event-badge">⭐ Featured</div>' : ''}
                <div class="event-image" style="background-image: url('${event.image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}');">
                    <div class="event-date">
                        <span class="day">${event.day || day}</span>
                        <span class="month">${event.month || month}</span>
                    </div>
                </div>
                <div class="event-content">
                    <span class="event-category">${(event.category || 'General').charAt(0).toUpperCase() + (event.category || 'General').slice(1)}</span>
                    <h3 class="event-title">${event.title || 'Untitled'}</h3>
                    <div class="event-meta">
                        <div class="event-meta-item"><i class="fas fa-clock"></i> ${event.time || 'Time TBD'}</div>
                        <div class="event-meta-item"><i class="fas fa-map-marker-alt"></i> ${event.location || 'Location TBD'}</div>
                    </div>
                    <p class="event-description">${event.description || 'No description available.'}</p>
                </div>
            </div>
        `;
        eventsGrid.innerHTML += card;
    });
    
    attachFilterListeners();
}

// ===========================================
// FILTER BUTTONS
// ===========================================
function attachFilterListeners() {
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
                    } else if (filterValue === 'featured' && card.classList.contains('featured')) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });
}

// ===========================================
// CALENDAR FUNCTIONS
// ===========================================
function getEventsForDate(year, month, day) {
    return allEvents.filter(event => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === year && 
               eventDate.getMonth() === month && 
               eventDate.getDate() === day;
    });
}

function showDayEvents(year, month, day) {
    const events = getEventsForDate(year, month, day);
    if (events.length === 0) return;
    
    let message = `📅 ${events.length} Event(s) for ${monthNames[month]} ${day}, ${year}:\n\n`;
    events.forEach(event => {
        message += `📌 ${event.title}\n   🕒 ${event.time || 'Time TBD'}\n   📍 ${event.location || 'Location TBD'}\n   🏷️ ${(event.category || 'General').toUpperCase()}\n\n`;
    });
    alert(message);
}

function renderCalendar(year, month) {
    const firstDay = new Date(year, month, 1);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.className = 'calendar-day';
        
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayCell.appendChild(dayNumber);
        
        const eventsOnDay = getEventsForDate(year, month, day);
        
        if (eventsOnDay.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.style.marginTop = '8px';
            
            const displayEvents = eventsOnDay.slice(0, 2);
            displayEvents.forEach(event => {
                const eventBadge = document.createElement('div');
                eventBadge.className = 'event-badge-calendar';
                const shortTitle = event.title.length > 20 ? event.title.substring(0, 18) + '...' : event.title;
                eventBadge.innerHTML = `<i class="fas fa-calendar-alt" style="font-size: 8px; margin-right: 4px;"></i> ${shortTitle}`;
                
                const tooltip = document.createElement('div');
                tooltip.className = 'event-tooltip';
                tooltip.innerHTML = `<strong>${event.title}</strong><br>🕒 ${event.time || 'Time TBD'}<br>📍 ${event.location || 'Location TBD'}`;
                eventBadge.appendChild(tooltip);
                
                eventBadge.onclick = (e) => {
                    e.stopPropagation();
                    alert(`📅 ${event.title}\n\n🕒 ${event.time || 'Time TBD'}\n📍 ${event.location || 'Location TBD'}\n\n📝 ${event.description || 'No description available.'}`);
                };
                eventsContainer.appendChild(eventBadge);
            });
            
            if (eventsOnDay.length > 2) {
                const moreBadge = document.createElement('div');
                moreBadge.className = 'event-badge-calendar multiple';
                moreBadge.innerHTML = `<i class="fas fa-plus-circle"></i> +${eventsOnDay.length - 2} more`;
                moreBadge.onclick = (e) => {
                    e.stopPropagation();
                    showDayEvents(year, month, day);
                };
                eventsContainer.appendChild(moreBadge);
            }
            
            dayCell.appendChild(eventsContainer);
            dayCell.style.cursor = 'pointer';
            dayCell.onclick = () => showDayEvents(year, month, day);
        }
        
        calendarGrid.appendChild(dayCell);
    }
    
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = 42 - totalCells;
    for (let i = 0; i < remainingCells; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
}

// ===========================================
// TIMELINE - SHOW ALL EVENTS
// ===========================================
function renderTimeline() {
    const timelineContainer = document.getElementById('timelineContainer');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const allEventsSorted = allEvents
        .filter(event => event.date)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (allEventsSorted.length === 0) {
        timelineContainer.innerHTML = '<div style="text-align: center; padding: 40px;">✨ No events scheduled. Check back soon!</div>';
        return;
    }
    
    timelineContainer.innerHTML = '';
    
    allEventsSorted.forEach(event => {
        const eventDate = new Date(event.date);
        const day = eventDate.getDate();
        const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
        const isPast = eventDate < today;
        
        timelineContainer.innerHTML += `
            <div class="timeline-item" style="${isPast ? 'opacity: 0.7;' : ''}">
                <div class="timeline-date">
                    <div class="timeline-day">${event.day || day}</div>
                    <div class="timeline-month">${event.month || month}</div>
                </div>
                <div class="timeline-content">
                    <h4>${event.title || 'Untitled Event'} ${isPast ? '<span style="font-size: 10px; color: #888;"> (Past Event)</span>' : '<span style="font-size: 10px; color: #2c6e49;"> (Upcoming)</span>'}</h4>
                    <p><i class="fas fa-clock"></i> ${event.time || 'Time TBD'} | <i class="fas fa-map-marker-alt"></i> ${event.location || 'Location TBD'}</p>
                    <span class="timeline-category"><i class="fas fa-tag"></i> ${(event.category || 'General').charAt(0).toUpperCase() + (event.category || 'General').slice(1)}</span>
                </div>
            </div>
        `;
    });
}

// ===========================================
// MONTH NAVIGATION
// ===========================================
function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentYear, currentMonth);
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentYear, currentMonth);
}

// ===========================================
// MONTH SELECTOR
// ===========================================
document.getElementById('monthSelector').addEventListener('change', function(e) {
    const value = e.target.value;
    if (value) {
        const [year, month] = value.split('-');
        currentYear = parseInt(year);
        currentMonth = parseInt(month);
        renderCalendar(currentYear, currentMonth);
        e.target.value = '';
    }
});

document.getElementById('prevMonthBtn').addEventListener('click', prevMonth);
document.getElementById('nextMonthBtn').addEventListener('click', nextMonth);

// ===========================================
// NEWSLETTER FORM WITH EMAIL SENDING
// ===========================================
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('.newsletter-input');
        const email = emailInput.value;
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        if (!email || !email.includes('@')) {
            alert('📧 Please enter a valid email address.');
            return;
        }
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        submitBtn.disabled = true;
        
        try {
            // Check if email already exists
            const existing = await db.collection('newsletterSubscribers')
                .where('email', '==', email)
                .get();
            
            if (!existing.empty) {
                alert('✅ You are already subscribed!');
                emailInput.value = '';
                return;
            }
            
            // Save to Firebase
            await db.collection('newsletterSubscribers').add({
                email: email,
                subscribedAt: new Date().toISOString(),
                status: 'active'
            });
            
            // ✅ FETCH ONLY UPCOMING EVENTS (today and future)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const eventsSnapshot = await db.collection('events').get();
            const upcomingEventsList = [];
            
            eventsSnapshot.forEach(doc => {
                const event = doc.data();
                if (event.date) {
                    const eventDate = new Date(event.date);
                    // Only include events that are TODAY or in the FUTURE
                    if (eventDate >= today) {
                        upcomingEventsList.push(event);
                    }
                }
            });
            
            // Sort by date (closest first) and take first 3
            upcomingEventsList.sort((a, b) => new Date(a.date) - new Date(b.date));
            const topEvents = upcomingEventsList.slice(0, 3);
            
            // Build events HTML
            let eventsHTML = '';
            if (topEvents.length > 0) {
                topEvents.forEach(event => {
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                    eventsHTML += `
                        <div style="background: #f5f5f5; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #f8b739;">
                            <h4 style="color: #1a4b8c; margin: 0 0 8px;">${event.title || 'Upcoming Event'}</h4>
                            <p style="margin: 5px 0;">📅 ${formattedDate} | ${event.time || 'Time TBD'}</p>
                            <p style="margin: 5px 0;">📍 ${event.location || 'Location TBD'}</p>
                        </div>
                    `;
                });
            } else {
                eventsHTML = '<p style="color: #666;">✨ No upcoming events scheduled yet. Check back soon!</p>';
            }
            
        // Build full email HTML
const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Poppins', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; }
            .content { padding: 30px 25px; }
            .welcome { background: #f8b73920; padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #f8b739; }
            .button { background: #f8b739; color: #333; padding: 12px 25px; text-decoration: none; border-radius: 50px; display: inline-block; margin: 20px 0; font-weight: 600; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
            .footer a { color: #1a4b8c; text-decoration: none; }
            .divider { height: 2px; background: linear-gradient(to right, #f8b739, #1a4b8c); margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header" style="background: linear-gradient(135deg, #1a4b8c, #0d3a6b); padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; color: #ffffff;">🎓 Divine Grace Academy</h1>
                <p style="margin: 5px 0 0; opacity: 0.9; color: #ffffff;">Excellence in Education | With God All Things Are Possible</p>
            </div>
            
            <div class="content">
                <div class="welcome">
                    <h3>👋 Hello ${email.split('@')[0]}!</h3>
                    <p>Thank you for subscribing to the Divine Grace Academy newsletter! We're excited to keep you updated on all the amazing things happening at our school.</p>
                </div>
                
                <h3>📅 Upcoming Events</h3>
                ${eventsHTML}
                
                <div class="divider"></div>
                
                <p style="text-align: center;">
                    <a href="https://breman-innit.github.io/SCHOOL-SITE/events.html" class="button">📖 View All Events</a>
                </p>
                
                <p><strong>What to expect:</strong></p>
                <ul>
                    <li>⭐ Monthly event updates</li>
                    <li>🏆 Student achievement highlights</li>
                    <li>📢 Important school announcements</li>
                    <li>🎉 Community news and celebrations</li>
                </ul>
            </div>
            
            <div class="footer">
                <p>Divine Grace Academy<br>
                3rd October Junction, Ashalaja</p>
                <p>
                    <a href="https://breman-innit.github.io/SCHOOL-SITE/unsubscribe.html?email=${email}">Unsubscribe</a> | 
                    <a href="https://breman-innit.github.io/SCHOOL-SITE">Visit our website</a>
                </p>
                <p>© 2025 Divine Grace Academy. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;
            
            // Send welcome email
            const templateParams = {
                email: email,
                to_name: email.split('@')[0],
                from_name: 'Divine Grace Academy',
                reply_to: 'divinegraceacademycommunity@gmail.com',
                html_message: emailHTML
            };
            
            await emailjs.send('service_vybn3ea', 'template_3nx9uvs', templateParams);
            
            alert(`🎉 Welcome to Divine Grace Academy!\n\nWe've sent a welcome email to ${email} with upcoming events. Check your inbox!`);
            emailInput.value = '';
            
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Something went wrong. Please try again later.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===========================================
// INITIALIZE
// ===========================================
document.addEventListener('DOMContentLoaded', loadAllEvents);