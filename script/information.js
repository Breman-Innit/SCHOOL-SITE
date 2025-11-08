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

        // Information Request System
        const topicsList = document.getElementById('topicsList');
        const viewInfoBtn = document.getElementById('viewInfoBtn');
        const resetSelectionBtn = document.getElementById('resetSelectionBtn');
        const welcomeScreen = document.getElementById('welcomeScreen');
        const infoDisplay = document.getElementById('infoDisplay');
        const topicsGrid = document.getElementById('topicsGrid');
        const backToSelectionBtn = document.getElementById('backToSelectionBtn');

        // Topic data with detailed information
        const topicData = {
            academic: {
                title: "Academic Programs",
                icon: "fas fa-graduation-cap",
                description: "Our comprehensive academic curriculum is designed to challenge and inspire students at every level.",
                features: [
                    "College-preparatory curriculum with AP courses",
                    "STEM-focused programs with advanced labs",
                    "Individualized learning plans for each student",
                    "Dedicated college counseling starting in 9th grade",
                    "Project-based learning and critical thinking focus"
                ],
                detailedInfo: `
                    <div class="info-section">
                        <h4><i class="fas fa-book"></i> Core Curriculum</h4>
                        <p>Our rigorous core curriculum ensures students develop strong foundational knowledge across all subject areas while allowing for specialization in areas of interest.</p>
                        <ul class="program-list">
                            <li>Advanced Mathematics & Science Programs</li>
                            <li>Comprehensive Humanities & Social Studies</li>
                            <li>World Languages: Spanish, French, Mandarin</li>
                            <li>Digital Literacy & Computer Science</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-flask"></i> STEM Excellence</h4>
                        <p>State-of-the-art laboratories and dedicated STEM faculty provide hands-on learning experiences that prepare students for careers in science, technology, engineering, and mathematics.</p>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-chart-line"></i> College Preparation</h4>
                        <p>100% of our graduates are accepted to four-year colleges and universities, with an average of 8 college acceptances per student.</p>
                    </div>
                `
            },
            athletics: {
                title: "Athletics",
                icon: "fas fa-running",
                description: "We believe in developing the whole student, and our athletic programs play a key role in character development.",
                features: [
                    "15+ competitive sports teams",
                    "State-of-the-art athletic facilities",
                    "Emphasis on sportsmanship and teamwork",
                    "Athletic scholarships available",
                    "Certified trainers and coaches"
                ],
                detailedInfo: `
                    <div class="info-section">
                        <h4><i class="fas fa-trophy"></i> Competitive Teams</h4>
                        <p>Our athletes compete at the highest levels while maintaining academic excellence and sportsmanship.</p>
                        <ul class="program-list">
                            <li>Basketball, Soccer, Volleyball</li>
                            <li>Swimming & Diving</li>
                            <li>Track & Field</li>
                            <li>Tennis & Golf</li>
                        </ul>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-dumbbell"></i> Facilities</h4>
                        <p>Recently renovated athletic complex featuring Olympic-size pool, indoor track, and weight training center.</p>
                    </div>
                `
            },
            arts: {
                title: "Arts & Music",
                icon: "fas fa-paint-brush",
                description: "Creative expression is celebrated through our comprehensive arts and music programs.",
                features: [
                    "Visual arts, theater, and music programs",
                    "Annual school productions and art shows",
                    "Private music lessons available",
                    "Digital media and graphic design courses",
                    "Partnerships with local arts organizations"
                ],
                detailedInfo: `
                    <div class="info-section">
                        <h4><i class="fas fa-palette"></i> Visual Arts</h4>
                        <p>Comprehensive studio art program including drawing, painting, sculpture, and digital arts.</p>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-music"></i> Music Program</h4>
                        <p>Orchestra, band, choir, and individual instrument instruction for all skill levels.</p>
                    </div>
                `
            },
            tuition: {
                title: "Tuition & Financial Aid",
                icon: "fas fa-dollar-sign",
                description: "We are committed to making a Divine Grace Academy education accessible to qualified students.",
                features: [
                    "Competitive tuition rates with family discounts",
                    "Need-based financial aid available",
                    "Merit scholarships for academic excellence",
                    "Flexible payment plans",
                    "Transparent fee structure with no hidden costs"
                ],
                detailedInfo: `
                    <div class="info-section">
                        <h4><i class="fas fa-graduation-cap"></i> Tuition Information</h4>
                        <p>Comprehensive tuition includes all academic materials, technology fees, and most extracurricular activities.</p>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-hand-holding-usd"></i> Financial Assistance</h4>
                        <p>Over 40% of our students receive some form of financial assistance through our generous aid programs.</p>
                    </div>
                `
            },
            campus: {
                title: "Campus Life",
                icon: "fas fa-home",
                description: "Our vibrant campus community offers numerous opportunities for growth, friendship, and discovery.",
                features: [
                    "40+ student clubs and organizations",
                    "Leadership development programs",
                    "Community service opportunities",
                    "Modern dormitories for boarding students",
                    "Safe, nurturing environment with 24/7 support"
                ],
                detailedInfo: `
                    <div class="info-section">
                        <h4><i class="fas fa-users"></i> Student Activities</h4>
                        <p>From robotics club to debate team, there's something for every interest and passion.</p>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-home"></i> Residential Life</h4>
                        <p>Comfortable dormitories with dedicated faculty residents creating a home away from home.</p>
                    </div>
                `
            },
            admission: {
                title: "Admission Process",
                icon: "fas fa-clipboard-list",
                description: "Our admission process is designed to identify students who will thrive in our community.",
                features: [
                    "Rolling admissions with priority deadlines",
                    "Personalized campus tours available",
                    "Shadow days for prospective students",
                    "Comprehensive application review process",
                    "Dedicated admission counselors for each family"
                ],
                detailedInfo: `
                    <div class="info-section">
                        <h4><i class="fas fa-calendar-alt"></i> Application Timeline</h4>
                        <p>Priority application deadline: January 15th. Rolling admissions continue through August.</p>
                    </div>
                    <div class="info-section">
                        <h4><i class="fas fa-file-alt"></i> Required Materials</h4>
                        <p>Complete online application, transcripts, teacher recommendations, and student essay.</p>
                    </div>
                `
            }
        };

        // Topic selection handling - fixed for both radio and container clicks
        function handleTopicSelection(topicItem) {
            const radio = topicItem.querySelector('.topic-radio');
            radio.checked = true;
            
            // Update visual selection state
            document.querySelectorAll('.topic-item').forEach(item => {
                item.classList.remove('selected');
            });
            topicItem.classList.add('selected');
        }

        // Handle container clicks
        topicsList.addEventListener('click', function(e) {
            const topicItem = e.target.closest('.topic-item');
            if (topicItem) {
                handleTopicSelection(topicItem);
            }
        });

        // Handle radio button clicks directly
        topicsList.addEventListener('change', function(e) {
            if (e.target.classList.contains('topic-radio')) {
                const topicItem = e.target.closest('.topic-item');
                handleTopicSelection(topicItem);
            }
        });

        // View information button
        viewInfoBtn.addEventListener('click', function() {
            const selectedTopic = document.querySelector('.topic-radio:checked');
            
            if (!selectedTopic) {
                alert('Please select a topic to view information.');
                return;
            }
            
            displaySelectedTopic(selectedTopic.dataset.topic);
            welcomeScreen.style.display = 'none';
            infoDisplay.classList.add('active');
        });

        // Reset selection
        resetSelectionBtn.addEventListener('click', function() {
            document.querySelectorAll('.topic-radio').forEach(radio => {
                radio.checked = false;
            });
            document.querySelectorAll('.topic-item').forEach(item => {
                item.classList.remove('selected');
            });
        });

        // Back to selection
        backToSelectionBtn.addEventListener('click', function() {
            infoDisplay.classList.remove('active');
            welcomeScreen.style.display = 'block';
            
            // Collapse all expanded sections
            document.querySelectorAll('.detailed-info').forEach(section => {
                section.classList.remove('expanded');
            });
        });

        // Display selected topic
        function displaySelectedTopic(topic) {
            if (topicData[topic]) {
                const data = topicData[topic];
                topicsGrid.innerHTML = '';
                
                const topicCard = document.createElement('div');
                topicCard.className = 'topic-card';
                topicCard.innerHTML = `
                    <div class="topic-card-header">
                        <div class="topic-card-icon">
                            <i class="${data.icon}"></i>
                        </div>
                        <h3 class="topic-card-title">${data.title}</h3>
                    </div>
                    <div class="topic-content">
                        <p>${data.description}</p>
                        <ul class="topic-features">
                            ${data.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                        </ul>
                        <div class="action-buttons">
                            <button class="btn btn-primary btn-small learn-more-btn" data-topic="${topic}">
                                <i class="fas fa-info-circle"></i> Learn More About Our ${data.title}
                            </button>
                        </div>
                        <div class="detailed-info" id="detailed-${topic}">
                            ${data.detailedInfo}
                        </div>
                    </div>
                `;
                topicsGrid.appendChild(topicCard);
                
                // Add event listener to learn more button
                const learnMoreBtn = topicCard.querySelector('.learn-more-btn');
                learnMoreBtn.addEventListener('click', function() {
                    const detailedSection = document.getElementById(`detailed-${topic}`);
                    
                    // Toggle the expanded class
                    if (detailedSection.classList.contains('expanded')) {
                        detailedSection.classList.remove('expanded');
                        this.innerHTML = `<i class="fas fa-info-circle"></i> Learn More About Our ${data.title}`;
                    } else {
                        detailedSection.classList.add('expanded');
                        this.innerHTML = `<i class="fas fa-times"></i> Show Less`;
                    }
                });
            }
        }
