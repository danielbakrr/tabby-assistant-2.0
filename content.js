//create highlighted selection
document.addEventListener('selectionchange', function() {
    const selected = window.getSelection();
    if (!selected) return;

    const text = selected.toString().trim();
    if (!text) return;
    
    try{
        const range = window.getSelection().getRangeAt(0);
        const highlightSpan = document.createElement('span');
        highlightSpan.style.backgroundColor = 'yellow';
        highlightSpan.dataset.tempHighlight = 'true'; // mark for removal later

        const contents = range.extractContents(); 
        highlightSpan.appendChild(contents);
        range.insertNode(highlightSpan);

        selected.removeAllRanges();
        chrome.runtime.sendMessage({ type: 'selected', text});
    } catch (e) {
        console.error('Error highlighting selection:', e);
    }
});


//remove highlighted selection upon click
document.addEventListener("click", () => {
  document.querySelectorAll("span[data-temp-highlight]").forEach(span => {
    span.replaceWith(...span.childNodes);
  });
});