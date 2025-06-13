document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('myButton');
    button.addEventListener('click', function() {
        chrome.runtime.sendMessage({ action: 'buttonClicked' }, function(response) {
            console.log('Response from background:', response);
        });
    });
});