const url = new URL("https://matrix.mqcore.io/_matrix/client/v3/sync")

chrome.runtime.onInstalled.addListener(() => {
    fetchDataFromUrl()
    setInterval(fetchDataFromUrl, 15000); // 15000 миллисекунд = 15 секунд
});

chrome.action.onClicked.addListener(tab => {
    chrome.tabs.create({ url: "https://app.element.io/#/room/!eznhkKvvuScdfyImHy:matrix.mqcore.io" });
});

function getToken() {
    return new Promise((resolve) => {
        chrome.storage.sync.get({ token: "" }, (items) => {
            resolve(items.token);
        });
    });
}

async function whereIsMyToken() {
    const token = await getToken();
    return token
}

async function fetchDataFromUrl() {
    try {
        const token = await getToken(); // Получаем токен асинхронно
        const response = await fetch(url, {
            method: "GET", // default, so we can ignore,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': '*/*'
            }
        });


        if (!response.ok) {
            // Обрабатываем ошибку, если запрос не успешен
            throw new Error('Network response was not ok');
        }

        const json = await response.json();


        let notifications = 0;

        for (const key in json.rooms.join) {
            notifications += json.rooms.join[key].unread_notifications.notification_count;
        }

        setUnread(notifications);
    } catch (error) {
        // Обрабатываем ошибку, если что-то пошло не так
        console.error('Error fetching data:', error);
    }
}


function setUnread(count) {
    if (typeof count !== 'number') {
        console.warn("Not number", count);
        return;
    }
    if (count > 10) {
        chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 128] });
    }
    if (Number.isInteger(count)) {
        if (count == 0) {
            return
        }
        if (count > 9) {
            count = "10+"
        }
        
        chrome.action.setBadgeText({
            text: '' + count,
        });
    }
}

