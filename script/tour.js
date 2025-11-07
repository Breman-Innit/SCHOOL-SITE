 // Dark Mode Toggle
        const themeToggle = document.getElementById('themeToggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Check for saved theme preference or use OS preference
        const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
        
        // Apply the theme
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
        
        // Toggle theme function
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });

        // FAQ Toggle Functionality
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                faqItem.classList.toggle('active');
            });
        });

        // Form Submission
        document.getElementById('tourForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // In a real application, you would send this data to a server
            // For demonstration, we'll just show an alert
            alert('Thank you for your tour request! Our admissions team will contact you within 24-48 hours to confirm your tour details.');
            
            // Reset form
            this.reset();
            
            // Scroll to top of form
            document.getElementById('schedule-form').scrollIntoView({ behavior: 'smooth' });
        });

        // Set minimum date for tour scheduling to today
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        document.getElementById('preferredDate').min = formattedDate;