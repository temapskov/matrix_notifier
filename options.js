// Saves options to chrome.storage
const saveOptions = () => {
    const token = document.getElementById('token').value;

    chrome.storage.sync.set(
        { token: token },
        () => {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Токен установлен';
            setTimeout(() => {
                status.innerText = '';
            }, 1000);
        }
    );
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    chrome.storage.sync.get(
        { token: token },
        (items) => {
            document.getElementById('token').value = items.token;
        }
    );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);