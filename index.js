document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const checkButton = document.getElementById('checkButton');
    const loadingScreen = document.getElementById('loadingScreen');
    const urlInput = document.getElementById('urlInput');
    const resultOverlay = document.getElementById('resultOverlay');
    const mainContainer = document.getElementById('mainContainer');
    
    let currentFile = null; // Store the current file

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    dropZone.addEventListener('dragover', () => {
        dropZone.classList.add('dragging');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragging');
    });
    
    dropZone.addEventListener('drop', (e) => {
        dropZone.classList.remove('dragging');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });
    
    dropZone.addEventListener('click', () => {
        if (dropZone.querySelector('img') || dropZone.querySelector('video')) {
            if (confirm('Do you want to remove the uploaded file?')) {
                dropZone.innerHTML = 'Drag and drop video files here or click to browse';
                currentFile = null;
            }
        } else {
            fileInput.click();
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            handleFile(fileInput.files[0]);
        }
    });
    
    function handleFile(file) {
        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
            currentFile = file; // Store the file
            const reader = new FileReader();
            reader.onload = function(e) {
                if (file.type.startsWith('image/')) {
                    dropZone.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 140px; border-radius: 8px;">`;
                } else {
                    dropZone.innerHTML = `<video controls style="max-width: 100%; max-height: 140px; border-radius: 8px;"><source src="${e.target.result}" type="${file.type}"></video>`;
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image or video file');
        }
    }
    
    checkButton.addEventListener('click', async () => {
        if (!urlInput.value.trim() && !currentFile) {
            alert('Please provide a valid URL or upload an image/video');
            return;
        }

        loadingScreen.style.display = 'flex';

        let formData = new FormData();
        let videoUrl = urlInput.value.trim();

        if (currentFile) {
            // If file is uploaded
            formData.append('video', currentFile); // Changed 'file' to 'video' to match Flask backend
        } else if (videoUrl) {
            // If URL is provided
            formData.append('url', videoUrl);
        } else {
            alert('Please provide a video');
            loadingScreen.style.display = 'none';
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            loadingScreen.style.display = 'none';

            if (response.ok) {
                resultOverlay.style.display = 'flex';
                resultOverlay.style.color = data.is_fake ? 'red' : 'green';
                resultOverlay.textContent = data.is_fake ? 'Fake content Detected!' : 'Real Content';

                setTimeout(() => {
                    resultOverlay.style.display = 'none';
                    dropZone.innerHTML = 'Drag and drop video files here or click to browse';
                    currentFile = null;
                }, 5000);
            } else {
                alert(data.error || 'Error detecting content');
            }
        } catch (error) {
            console.error('Upload error:', error);
            loadingScreen.style.display = 'none';
            alert('Error occurred while processing the video');
        }
    });
});