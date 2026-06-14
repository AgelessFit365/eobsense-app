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

// Submit button
submitBtn.addEventListener('click', async () => {
    const uploadModeActive = uploadMode.classList.contains('active');
    const content = uploadModeActive ? selectedFile : pasteInput.value;

    if (!content) {
        alert('Please upload a file or paste text to analyze');
        return;
    }

    try {
        setLoading(true);

        let requestBody;
        if (uploadModeActive) {
            // File upload: convert to base64
            const fileContent = await readFileAsBase64(selectedFile);
            const mediaType = getMimeType(selectedFile.type);
            requestBody = JSON.stringify({
                content: [
                    {
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: mediaType,
                            data: fileContent,
                        },
                    },
                ],
                type: 'file',
            });
        } else {
            // Text paste
            requestBody = JSON.stringify({
                content: pasteInput.value,
                type: 'text',
            });
        }

        const response = await fetch('/.netlify/functions/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestBody,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to analyze bill');
        }

        const result = await response.json();
        displayOutput(formatOutput(result.analysis));
    } catch (error) {
        console.error('Error:', error);
        displayOutput(`<p style="color: #d32f2f;"><strong>Error:</strong> ${error.message}</p>`);
    } finally {
        setLoading(false);
    }
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

// Convert file to base64
function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
}

// Get MIME type for Claude API
function getMimeType(fileType) {
    const mimeMap = {
        'application/pdf': 'application/pdf',
        'image/jpeg': 'image/jpeg',
        'image/png': 'image/png',
        'image/jpg': 'image/jpeg',
    };
    return mimeMap[fileType] || 'application/octet-stream';
}

// Format Claude's response for display using marked.js
function formatOutput(text) {
    return marked.parse(text);
}
