//create highlighted selection
document.addEventListener('selectionChange', function() {
    const selected = window.getSelection().toString();
    if (!selected) return;

    const text = selected ? selected.toString().trim() : '';
    if (selected) {
        const range = window.getSelection().getRangeAt(0);
        const highlightSpan = document.createElement('span');
        highlightSpan.style.backgroundColor = 'yellow';
        range.surroundContents(highlightSpan); // easier to see
}});
