//create highlighted selection
document.addEventListener('mouseup', function() {
    const selected = window.getSelection();
    if (!selected) return;

    const text = selected.toString().trim();
    if (!text) return;
    
    try{
        chrome.runtime.sendMessage({ type: 'selected', text});
    } catch (e) {
        console.error('Error highlighting selection:', e);
    }
});