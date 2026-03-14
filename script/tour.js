
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