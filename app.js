document.getElementById('upload-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const documentFile = formData.get('document');

    // Send the document to your backend for analysis
    const response = await fetch('/analyze-document', {
        method: 'POST',
        body: documentFile,
    });

    if (response.ok) {
        alert('Analysis completed successfully.');
    } else {
        alert('Failed to analyze the document.');
    }
});
