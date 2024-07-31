document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('fileList');

    // URL to the JSON file containing the list of .pptx files
    fetch('files.json')
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                if (file.endsWith('.pptx')) {
                    const listItem = document.createElement('li');
                    const fileLink = document.createElement('a');
                    
                    fileLink.href = `xyz/${file}`;
                    fileLink.textContent = file;
                    fileLink.download = file;
                    
                    listItem.appendChild(fileLink);
                    fileList.appendChild(listItem);
                }
            });
        })
        .catch(error => console.error('Error fetching files:', error));
});
