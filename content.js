//create highlighted selection
document.addEventListener('selectionchange', function() {
    const selected = window.getSelection().toString();
    if (!selected) return;

    const text = selected ? selected.toString().trim() : '';
    if (selected) {
        const range = window.getSelection().getRangeAt(0);
        const highlightSpan = document.createElement('span');
        highlightSpan.style.backgroundColor = 'yellow';
        range.surroundContents(highlightSpan); // easier to see
        highlightSpan.dataset.tempHighlight = 'true'; // mark for removal later

        const contents = range.extractContents();
        highlightSpan.appendChild(contents);
        range.insertNode(highlightSpan);

        selected.removeAllRanges();
        chrome.runtime.sendMessage({ type: 'selection', text});

}});


//remove highlighted selection upon click
document.addEventListener("click", () => {
  document.querySelectorAll("span[data-temp-highlight]").forEach(span => {
    span.replaceWith(...span.childNodes);
  });
});