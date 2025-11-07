// Application State Management
let currentStep = 1;
const totalSteps = 5;
let formData = {};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application form initialized');
    loadProgress();
    updateProgressBar();
    updateChecklist();
});

// Progress Management
function updateProgressBar() {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercent = document.getElementById('progressPercent');
    
    const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressPercent) {
        progressPercent.textContent = Math.round(progress) + '%';
    }
    
    // Update step indicators
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        if (index < currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
    
    // Update step text
    const stepTexts = [
        'Step 1 of 5 - Student Information',
        'Step 2 of 5 - Parent Information',
        'Step 3 of 5 - School Information',
        'Step 4 of 5 - Additional Information',
        'Step 5 of 5 - Review & Submit'
    ];
    
    if (progressText) {
        progressText.textContent = stepTexts[currentStep - 1];
    }
}

// Update checklist progress
function updateChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    checklistItems.forEach((item, index) => {
        const icon = item.querySelector('i');
        if (index < currentStep - 1) {
            item.classList.add('completed');
            icon.className = 'fas fa-check-circle';
        } else {
            item.classList.remove('completed');
            icon.className = 'far fa-circle';
        }
    });
}

// Navigation Functions
function nextStep() {
    console.log('Next step clicked, current step:', currentStep);
    
    // Validate current step before moving forward
    if (validateStep(currentStep)) {
        console.log('Validation passed, moving to step:', currentStep + 1);
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    } else {
        console.log('Validation failed');
        // Shake the next button to indicate error
        shakeNextButton();
    }
}

function prevStep() {
    console.log('Previous step clicked');
    if (currentStep > 1) {
        showStep(currentStep - 1);
    }
}

function showStep(stepNumber) {
    console.log('Showing step:', stepNumber);
    
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.getElementById('step' + stepNumber);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
        currentStep = stepNumber;
        updateProgressBar();
        updateChecklist();
        saveProgress();
        console.log('Step displayed successfully');
    } else {
        console.error('Step element not found: step' + stepNumber);
    }
    
    // Hide validation summary when changing steps
    hideValidationSummary();
}

// Shake animation for next button
function shakeNextButton() {
    const nextButton = document.querySelector('.btn-primary');
    if (nextButton) {
        nextButton.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            nextButton.style.animation = '';
        }, 500);
    }
}

// Validation Functions
function validateStep(step) {
    console.log('Validating step:', step);
    let isValid = true;
    const errors = [];
    
    // Clear previous errors
    clearStepErrors(step);
    
    switch(step) {
        case 1:
            isValid = validateStep1(errors) && isValid;
            break;
        case 2:
            isValid = validateStep2(errors) && isValid;
            break;
        case 3:
            isValid = validateStep3(errors) && isValid;
            break;
        case 4:
            isValid = validateStep4(errors) && isValid;
            break;
        case 5:
            isValid = validateStep5(errors) && isValid;
            break;
    }
    
    console.log('Step', step, 'is valid:', isValid);
    
    if (!isValid) {
        showValidationSummary(errors);
        highlightRequiredFields(step);
    } else {
        hideValidationSummary();
    }
    
    return isValid;
}

function highlightRequiredFields(step) {
    const stepElement = document.getElementById('step' + step);
    if (stepElement) {
        const requiredFields = stepElement.querySelectorAll('.required');
        requiredFields.forEach(field => {
            const input = field.closest('.form-group').querySelector('input, select, textarea');
            if (input && !input.value && input.type !== 'checkbox') {
                input.classList.add('highlight-required');
                setTimeout(() => {
                    input.classList.remove('highlight-required');
                }, 2000);
            }
        });
    }
}

function validateStep1(errors) {
    let isValid = true;
    
    // Student Name Validation
    const studentName = document.getElementById('studentName');
    if (!studentName.value.trim() || studentName.value.trim().length < 2) {
        showError('studentName', 'Please enter student\'s full name');
        errors.push('Student name is required');
        isValid = false;
    } else {
        showSuccess('studentName');
    }
    
    // Date of Birth Validation
    const studentDob = document.getElementById('studentDob');
    if (!studentDob.value) {
        showError('studentDob', 'Please select date of birth');
        errors.push('Date of birth is required');
        isValid = false;
    } else {
        const dob = new Date(studentDob.value);
        const today = new Date();
        const age = today.getFullYear() - dob.getFullYear();
        
        if (age < 5 || age > 18) {
            showError('studentDob', 'Student must be between 5 and 18 years old');
            errors.push('Student must be between 5 and 18 years old');
            isValid = false;
        } else {
            showSuccess('studentDob');
        }
    }
    
    // Gender Validation
    const studentGender = document.getElementById('studentGender');
    if (!studentGender.value) {
        showError('studentGender', 'Please select gender');
        errors.push('Gender is required');
        isValid = false;
    } else {
        showSuccess('studentGender');
    }
    
    // Grade Level Validation
    const gradeLevel = document.getElementById('gradeLevel');
    if (!gradeLevel.value) {
        showError('gradeLevel', 'Please select grade level');
        errors.push('Grade level is required');
        isValid = false;
    } else {
        showSuccess('gradeLevel');
    }
    
    return isValid;
}

function validateStep2(errors) {
    let isValid = true;
    
    // Parent Name Validation
    const parentName = document.getElementById('parentName');
    if (!parentName.value.trim() || parentName.value.trim().length < 2) {
        showError('parentName', 'Please enter parent/guardian name');
        errors.push('Parent name is required');
        isValid = false;
    } else {
        showSuccess('parentName');
    }
    
    // Email Validation
    const parentEmail = document.getElementById('parentEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!parentEmail.value || !emailRegex.test(parentEmail.value)) {
        showError('parentEmail', 'Please enter a valid email address');
        errors.push('Valid email address is required');
        isValid = false;
    } else {
        showSuccess('parentEmail');
    }
    
    // Phone Validation
    const parentPhone = document.getElementById('parentPhone');
    const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    const phoneDigits = parentPhone.value.replace(/\D/g, '');
    if (!parentPhone.value || phoneDigits.length !== 10) {
        showError('parentPhone', 'Please enter a valid 10-digit phone number');
        errors.push('Valid phone number is required');
        isValid = false;
    } else {
        showSuccess('parentPhone');
    }
    
    // Relationship Validation
    const parentRelationship = document.getElementById('parentRelationship');
    if (!parentRelationship.value) {
        showError('parentRelationship', 'Please select relationship to student');
        errors.push('Relationship to student is required');
        isValid = false;
    } else {
        showSuccess('parentRelationship');
    }
    
    return isValid;
}

function validateStep3(errors) {
    let isValid = true;
    
    // Current School Validation
    const currentSchool = document.getElementById('currentSchool');
    if (!currentSchool.value.trim()) {
        showError('currentSchool', 'Please enter current school name');
        errors.push('Current school name is required');
        isValid = false;
    } else {
        showSuccess('currentSchool');
    }
    
    // Current Grade Validation
    const currentGrade = document.getElementById('currentGrade');
    if (!currentGrade.value.trim()) {
        showError('currentGrade', 'Please enter current grade level');
        errors.push('Current grade level is required');
        isValid = false;
    } else {
        showSuccess('currentGrade');
    }
    
    return isValid;
}

function validateStep4(errors) {
    // Step 4 fields are optional, so always valid
    return true;
}

function validateStep5(errors) {
    let isValid = true;
    
    // Hear About Us Validation
    const hearAbout = document.getElementById('hearAbout');
    if (!hearAbout.value) {
        showError('hearAbout', 'Please select how you heard about us');
        errors.push('Please tell us how you heard about us');
        isValid = false;
    } else {
        showSuccess('hearAbout');
    }
    
    // Terms Agreement Validation
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showError('agreeTerms', 'You must certify that the information is accurate');
        errors.push('You must certify that the information is accurate');
        isValid = false;
    } else {
        showSuccess('agreeTerms');
    }
    
    // Privacy Agreement Validation
    const agreePrivacy = document.getElementById('agreePrivacy');
    if (!agreePrivacy.checked) {
        showError('agreePrivacy', 'You must agree to the privacy policy');
        errors.push('You must agree to the privacy policy');
        isValid = false;
    } else {
        showSuccess('agreePrivacy');
    }
    
    return isValid;
}

// Error Handling Functions
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Add focus to the first error field
        if (!document.querySelector('.error:focus')) {
            field.focus();
        }
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function showSuccess(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
        field.classList.add('success');
    }
    
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function clearStepErrors(step) {
    const stepElement = document.getElementById('step' + step);
    if (stepElement) {
        const inputs = stepElement.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('error', 'success', 'highlight-required');
            const errorElement = document.getElementById(input.id + 'Error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        });
    }
}

function showValidationSummary(errors) {
    const summary = document.getElementById('validationSummary');
    const errorsList = document.getElementById('validationErrors');
    
    if (summary && errorsList) {
        if (errors.length > 0) {
            errorsList.innerHTML = '';
            errors.forEach(error => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error}`;
                errorsList.appendChild(li);
            });
            summary.style.display = 'block';
            
            // Scroll to validation summary
            summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Show alert message for better visibility
            showAlertMessage(`Please fill in ${errors.length} required field(s) before continuing`);
        }
    }
}

function showAlertMessage(message) {
    // Remove existing alert if any
    const existingAlert = document.querySelector('.validation-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert message
    const alert = document.createElement('div');
    alert.className = 'validation-alert';
    alert.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        ">
            <i class="fas fa-exclamation-triangle" style="margin-right: 10px;"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        alert.remove();
    }, 4000);
}

function hideValidationSummary() {
    const summary = document.getElementById('validationSummary');
    if (summary) {
        summary.style.display = 'none';
    }
}

// Progress Saving (Local Storage)
function saveProgress() {
    const formData = collectFormData();
    const progressData = {
        currentStep: currentStep,
        formData: formData,
        timestamp: new Date().getTime()
    };
    
    localStorage.setItem('divineGraceApplication', JSON.stringify(progressData));
}

function loadProgress() {
    const saved = localStorage.getItem('divineGraceApplication');
    if (saved) {
        try {
            const progressData = JSON.parse(saved);
            currentStep = progressData.currentStep || 1;
            
            // Restore form data
            if (progressData.formData) {
                restoreFormData(progressData.formData);
            }
            
            showStep(currentStep);
        } catch (e) {
            console.log('No saved progress found');
        }
    }
}

function collectFormData() {
    const form = document.getElementById('applicationForm');
    const formData = {};
    
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                formData[input.name] = input.checked;
            } else {
                formData[input.name] = input.value;
            }
        });
    }
    
    return formData;
}

function restoreFormData(formData) {
    const form = document.getElementById('applicationForm');
    
    if (form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (formData.hasOwnProperty(input.name)) {
                if (input.type === 'checkbox') {
                    input.checked = formData[input.name];
                } else {
                    input.value = formData[input.name];
                }
            }
        });
    }
}

function clearSavedProgress() {
    localStorage.removeItem('divineGraceApplication');
}

// Form Submission
function submitApplication() {
    console.log('Submitting application');
    if (validateStep(5)) {
        // Collect final form data
        const finalData = collectFormData();
        
        // In a real application, you would send this to a server
        // For now, we'll just show success and save to localStorage
        finalData.submittedAt = new Date().toISOString();
        finalData.applicationId = 'DGA-' + Date.now();
        
        // Save the final submission
        localStorage.setItem('divineGraceApplicationSubmitted', JSON.stringify(finalData));
        
        // Clear the in-progress data
        clearSavedProgress();
        
        // Show success message
        showSuccessMessage(finalData.applicationId);
    } else {
        shakeNextButton();
    }
}

function showSuccessMessage(applicationId) {
    const form = document.getElementById('applicationForm');
    const successMessage = document.getElementById('successMessage');
    const applicationIdElement = document.getElementById('applicationId');
    
    if (form && successMessage && applicationIdElement) {
        form.style.display = 'none';
        document.getElementById('checklist').style.display = 'none';
        document.getElementById('validationSummary').style.display = 'none';
        applicationIdElement.textContent = applicationId;
        successMessage.style.display = 'block';
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Real-time validation for better UX
document.addEventListener('input', function(e) {
    if (e.target.type !== 'checkbox') {
        // Clear error when user starts typing
        const field = e.target;
        if (field.classList.contains('error')) {
            field.classList.remove('error');
            const errorElement = document.getElementById(field.id + 'Error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }
});

// Auto-save every 30 seconds
setInterval(saveProgress, 30000);