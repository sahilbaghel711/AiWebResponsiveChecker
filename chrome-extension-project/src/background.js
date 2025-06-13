// This file is intended for background scripts that run in the background of the Chrome extension. 
// It can handle events and manage long-running tasks.

chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'someAction') {
        // Handle the action
        sendResponse({status: 'success'});
    }
});