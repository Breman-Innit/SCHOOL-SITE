// Application State Management
let currentStep = 1;
const totalSteps = 5;
let formData = {};

// Firebase and EmailJS Configuration
const firebaseConfig = {
    apiKey: "AIzaSyCStWBZt502Xs2CWIEIZJdf4OL7eaI0Cr8",
    authDomain: "divine-grace-academy.firebaseapp.com",
    projectId: "divine-grace-academy",
    storageBucket: "divine-grace-academy.firebasestorage.app",
    messagingSenderId: "84424080855",
    appId: "1:84424080855:web:0d2d58926ada950a101f92"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Initialize EmailJS
emailjs.init("CwH05MhdjatUiDqNy");

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
    
    if (validateStep(currentStep)) {
        console.log('Validation passed, moving to step:', currentStep + 1);
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    } else {
        console.log('Validation failed');
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
    
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
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
    
    hideValidationSummary();
}

function shakeNextButton() {
    const nextButton = document.querySelector('.btn-primary');
    if (nextButton) {
        nextButton.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            nextButton.style.animation = '';
        }, 500);
    }
}

// Validation Functions (keep your existing validation functions - they're perfect!)
function validateStep(step) {
    console.log('Validating step:', step);
    let isValid = true;
    const errors = [];
    
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
    
    const studentName = document.getElementById('studentName');
    if (!studentName.value.trim() || studentName.value.trim().length < 2) {
        showError('studentName', 'Please enter student\'s full name');
        errors.push('Student name is required');
        isValid = false;
    } else {
        showSuccess('studentName');
    }
    
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
    
    const studentGender = document.getElementById('studentGender');
    if (!studentGender.value) {
        showError('studentGender', 'Please select gender');
        errors.push('Gender is required');
        isValid = false;
    } else {
        showSuccess('studentGender');
    }
    
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
    
    const parentName = document.getElementById('parentName');
    if (!parentName.value.trim() || parentName.value.trim().length < 2) {
        showError('parentName', 'Please enter parent/guardian name');
        errors.push('Parent name is required');
        isValid = false;
    } else {
        showSuccess('parentName');
    }
    
    const parentEmail = document.getElementById('parentEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!parentEmail.value || !emailRegex.test(parentEmail.value)) {
        showError('parentEmail', 'Please enter a valid email address');
        errors.push('Valid email address is required');
        isValid = false;
    } else {
        showSuccess('parentEmail');
    }
    
    const parentPhone = document.getElementById('parentPhone');
    const phoneDigits = parentPhone.value.replace(/\D/g, '');
    if (!parentPhone.value || phoneDigits.length !== 10) {
        showError('parentPhone', 'Please enter a valid 10-digit phone number');
        errors.push('Valid phone number is required');
        isValid = false;
    } else {
        showSuccess('parentPhone');
    }
    
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
    
    const currentSchool = document.getElementById('currentSchool');
    if (!currentSchool.value.trim()) {
        showError('currentSchool', 'Please enter current school name');
        errors.push('Current school name is required');
        isValid = false;
    } else {
        showSuccess('currentSchool');
    }
    
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
    return true;
}

function validateStep5(errors) {
    let isValid = true;
    
    const hearAbout = document.getElementById('hearAbout');
    if (!hearAbout.value) {
        showError('hearAbout', 'Please select how you heard about us');
        errors.push('Please tell us how you heard about us');
        isValid = false;
    } else {
        showSuccess('hearAbout');
    }
    
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms.checked) {
        showError('agreeTerms', 'You must certify that the information is accurate');
        errors.push('You must certify that the information is accurate');
        isValid = false;
    } else {
        showSuccess('agreeTerms');
    }
    
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
            summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            showAlertMessage(`Please fill in ${errors.length} required field(s) before continuing`);
        }
    }
}

function showAlertMessage(message) {
    const existingAlert = document.querySelector('.validation-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
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

// ===========================================
// UPDATED FORM SUBMISSION - SAVES TO FIREBASE & SENDS EMAIL
// ===========================================
async function submitApplication() {
    console.log('Submitting application');
    if (validateStep(5)) {
        // Collect final form data
        const finalData = collectFormData();
        
        // Generate application ID
        const appId = 'DGA-' + new Date().getFullYear() + '-' + Date.now().toString().slice(-6);
        
        // Prepare data for Firebase
        const applicationData = {
            applicationId: appId,
            studentName: finalData.studentName || '',
            studentDob: finalData.studentDob || '',
            studentGender: finalData.studentGender || '',
            gradeLevel: finalData.gradeLevel || '',
            parentName: finalData.parentName || '',
            parentEmail: finalData.parentEmail || '',
            parentPhone: finalData.parentPhone || '',
            parentRelationship: finalData.parentRelationship || '',
            currentSchool: finalData.currentSchool || '',
            currentGrade: finalData.currentGrade || '',
            previousSchools: finalData.previousSchools || '',
            specialNeeds: finalData.specialNeeds || '',
            medicalConditions: finalData.medicalConditions || '',
            allergies: finalData.allergies || '',
            hearAbout: finalData.hearAbout || '',
            agreeTerms: finalData.agreeTerms || false,
            agreePrivacy: finalData.agreePrivacy || false,
            status: 'pending',
            submittedAt: new Date().toISOString(),
            submittedDate: new Date().toLocaleDateString()
        };
        
        // Show loading state on submit button
        const submitBtn = document.querySelector('#step5 .btn-primary');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Save to Firebase
            await db.collection('applications').add(applicationData);
            
            // Send confirmation email
            const emailParams = {
                parent_email: applicationData.parentEmail,
                parent_name: applicationData.parentName,
                student_name: applicationData.studentName,
                student_dob: applicationData.studentDob,
                grade_level: applicationData.gradeLevel,
                current_school: applicationData.currentSchool,
                application_id: appId,
                submitted_date: applicationData.submittedDate,
                to_name: applicationData.parentName.split(' ')[0]
            };
            
            await emailjs.send('service_vybn3ea', 'YOUR_APPLICATION_TEMPLATE_ID', emailParams);
            
            // Save to localStorage for backup
            finalData.submittedAt = new Date().toISOString();
            finalData.applicationId = appId;
            localStorage.setItem('divineGraceApplicationSubmitted', JSON.stringify(finalData));
            
            // Clear in-progress data
            clearSavedProgress();
            
            // Show success message
            showSuccessMessage(appId);
            
        } catch (error) {
            console.error('Error submitting application:', error);
            alert('There was an error submitting your application. Please try again or contact the admissions office.');
        } finally {
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
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
        const checklist = document.getElementById('checklist');
        const validationSummary = document.getElementById('validationSummary');
        if (checklist) checklist.style.display = 'none';
        if (validationSummary) validationSummary.style.display = 'none';
        applicationIdElement.textContent = applicationId;
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Real-time validation
document.addEventListener('input', function(e) {
    if (e.target.type !== 'checkbox') {
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