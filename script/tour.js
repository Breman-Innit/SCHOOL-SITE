// ===========================================
// TOUR PAGE - FIREBASE CONNECTION
// ===========================================

// Your Firebase configuration (same as events page)
const firebaseConfig = {
    apiKey: "AIzaSyCStWBZt502Xs2CWIEIZJdf4OL7eaI0Cr8",
    authDomain: "divine-grace-academy.firebaseapp.com",
    projectId: "divine-grace-academy",
    storageBucket: "divine-grace-academy.firebasestorage.app",
    messagingSenderId: "84424080855",
    appId: "1:84424080855:web:0d2d58926ada950a101f92"
};

// Initialize Firebase (if not already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ===========================================
// FAQ Toggle Functionality
// ===========================================
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        faqItem.classList.toggle('active');
    });
});

// ===========================================
// Tour Form Submission
// ===========================================
const tourForm = document.getElementById('tourForm');

if (tourForm) {
    tourForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            firstName: document.getElementById('firstName')?.value || '',
            lastName: document.getElementById('lastName')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            studentName: document.getElementById('studentName')?.value || '',
            tourType: document.getElementById('tourType')?.value || '',
            preferredDate: document.getElementById('preferredDate')?.value || '',
            preferredTime: document.getElementById('preferredTime')?.value || '',
            hearAbout: document.getElementById('hearAbout')?.value || '',
            questions: document.getElementById('questions')?.value || '',
            newsletter: document.getElementById('newsletter')?.checked || false,
            timestamp: new Date().toLocaleString(),
            status: 'pending'  // So you can track new requests
        };
        
        // Validate required fields
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.studentName || !formData.tourType || !formData.preferredDate || !formData.preferredTime || !formData.hearAbout) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Show loading state
        const submitBtn = tourForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Save to Firebase
            await db.collection('tourRequests').add(formData);
            
            // Success message
            alert('Thank you for your tour request! Our admissions team will contact you within 24-48 hours to confirm your tour details.');
            
            // Reset form
            tourForm.reset();
            
            // Scroll to top
            document.getElementById('schedule-form').scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error('Error saving tour request:', error);
            alert('There was an error submitting your request. Please try again or contact us directly.');
        } finally {
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===========================================
// Set minimum date for tour scheduling to today
// ===========================================
const today = new Date();
const formattedDate = today.toISOString().split('T')[0];
const dateInput = document.getElementById('preferredDate');
if (dateInput) {
    dateInput.min = formattedDate;
}