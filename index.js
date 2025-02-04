
        document.addEventListener('DOMContentLoaded', () => {
            const dropZone = document.getElementById('dropzone');
            const fileInput = document.getElementById('fileInput');
            const checkButton = document.getElementById('checkButton');
            const loadingScreen = document.getElementById('loadingScreen');
            const urlInput = document.getElementById('urlInput');
            
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
                if (dropZone.querySelector('img')) {
                    if (confirm('Do you want to remove the uploaded image?')) {
                        dropZone.innerHTML = 'Drag and drop files here or click to browse';
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
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        dropZone.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 140px; border-radius: 8px;">`;
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please upload an image file');
                }
            }
            
            checkButton.addEventListener('click', () => {
                if (!urlInput.value.trim() && !dropZone.querySelector('img')) {
                    alert('Please provide a valid URL or upload an image');
                    return;
                }
                loadingScreen.style.display = 'flex';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    alert('Analysis Complete!');
                }, 3000);
            });
        });
    