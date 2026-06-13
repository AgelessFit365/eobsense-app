// Mode Toggle
const uploadModeBtn = document.getElementById('uploadModeBtn');
const pasteModeBtn = document.getElementById('pasteModeBtn');
const uploadMode = document.getElementById('uploadMode');
const pasteMode = document.getElementById('pasteMode');
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const pasteInput = document.getElementById('pasteInput');
const submitBtn = document.getElementById('submitBtn');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const outputPanel = document.getElementById('outputPanel');
const outputContent = document.getElementById('outputContent');
const closeOutput = document.getElementById('closeOutput');
const loading = document.getElementById('loading');

let selectedFile = null;

// Toggle between upload and paste modes
uploadModeBtn.addEventListener('click', () => {
    uploadMode.classList.add('active');
    pasteMode.classList.remove('active');
    uploadModeBtn.classList.add('active');
    pasteModeBtn.classList.remove('active');
    fileNameDisplay.textContent = '';
    selectedFile = null;
});

pasteModeBtn.addEventListener('click', () => {
    uploadMode.classList.remove('active');
    pasteMode.classList.add('active');
    uploadModeBtn.classList.remove('active');
    pasteModeBtn.classList.add('active');
});

// File selection via click
uploadZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        fileNameDisplay.textContent = `Selected: ${file.name}`;
    }
});

// Drag and drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
            selectedFile = file;
            fileNameDisplay.textContent = `Selected: ${file.name}`;
            fileInput.files = files;
        } else {
            alert('Please select a PDF or image file (JPG, PNG)');
        }
    }
});

// Submit button (placeholder for API integration)
submitBtn.addEventListener('click', () => {
    const uploadModeActive = uploadMode.classList.contains('active');
    const content = uploadModeActive ? selectedFile : pasteInput.value;

    if (!content) {
        alert('Please upload a file or paste text to analyze');
        return;
    }

    // API call will be added in the next task
    console.log('Submit clicked. Content ready for analysis:', content);
});

// Close output panel
closeOutput.addEventListener('click', () => {
    outputPanel.classList.add('hidden');
    outputContent.innerHTML = '';
});

// Helper function to display output (will be called by API response handler)
function displayOutput(text) {
    outputContent.innerHTML = text;
    outputPanel.classList.remove('hidden');
    outputPanel.scrollIntoView({ behavior: 'smooth' });
}

// Helper function to show/hide loading
function setLoading(isLoading) {
    if (isLoading) {
        loading.classList.remove('hidden');
        submitBtn.disabled = true;
    } else {
        loading.classList.add('hidden');
        submitBtn.disabled = false;
    }
}
