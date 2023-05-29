let updateKey = () => {
  // set the chrome sync storage time to the 'select-time' value when 'button-update' is clicked
  let newsJaceProKey = document.querySelector('#select-key').value;
  let domain = document.querySelector('#select-domain').value || 'https://news.jace.pro';
  chrome.storage.sync.set({ newsJaceProKey, domain }, () => {
    console.log('newsJaceProKey is set to ' + newsJaceProKey);
    document.querySelector('#button-update').disabled = true;
    document.querySelector('#button-update').innerText = 'Key is set';
    setTimeout(() => {
      document.querySelector('#button-update').disabled = false;
      document.querySelector('#button-update').innerText = 'Save';
    }, 1000);
  });
}
let setDomainOnLoad = () => {
  chrome.storage.sync.get(['domain'], function (data) {
    if (data.domain) {
      document.querySelector('#select-domain').value = data.domain;
    }
  });
}
setDomainOnLoad();
setKeyOnLoad = () => {
  chrome.storage.sync.get(['newsJaceProKey'], function (data) {
    if (data.newsJaceProKey) {
      document.querySelector('#select-key').value = data.newsJaceProKey;
    }
  });
}
setKeyOnLoad();
let newsJaceProKey = false;
chrome.storage.sync.get(['newsJaceProKey', 'domain'], function (data) {
  if (data.newsJaceProKey) {
    newsJaceProKey = data.newsJaceProKey;
  }
  if (data.domain) {
    domain = data.domain;
  }
});
let currentTab = false;
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  currentTab =  tabs[0];
});
let getDetails = () => {
  console.log('newsJaceProKey', newsJaceProKey);
  console.log('currentTab', currentTab)
    let titleInput = document.querySelector('#select-title').value
    let urlInput = document.querySelector('#select-url').value
    console.log({currentTab, titleInput, urlInput})
    document.querySelector('#select-title').value = currentTab.title;
    document.querySelector('#select-url').value = currentTab.url;
    // get the seo details
    fetch(currentTab.url)
      .then(response => response.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const meta = doc.querySelector('meta[name="description"]');
        const description = meta ? meta.getAttribute('content') : '';
        console.log({doc, meta, description});
       // document.querySelector('#select-description').value = description;
      }
      )
}
let submitItem = () => {
  console.log({function: 'submitItem', newsJaceProKey, currentTab, domain})
    if (!newsJaceProKey) {
      document.querySelector('#response').innerText = 'Please set a key first';
      return;
    }
    if (!domain) {
      document.querySelector('#response').innerText = 'Please set a domain first';
      return;
    }
    if (newsJaceProKey) {
      var data = {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "*",
          "submitKey": newsJaceProKey,
        },
        "body": JSON.stringify([{
          "title": document.querySelector('#select-title').value || currentTab.title,
          "url": document.querySelector('#select-url').value || currentTab.url
        }])
      }
      document.querySelector('#response').innerText = 'Sending data...' + '\n' + JSON.stringify(JSON.parse(data.body), null, ' ');
      console.log('snding data', JSON.parse(data.body))
      fetch(`${domain}/.redwood/functions/submitItem`, data)
        .then(response => {
          console.log('response', response);
          document.querySelector('#response').innerText = 'response: \n' + JSON.stringify(response, null, ' ');
        })
        .catch(err => {
          console.error('err', err);
          document.querySelector('#response').innerText = 'error: \n' + JSON.stringify(err, null, ' ');
        });
    }
    

}
// add event listener to 'button-update'
document.querySelector('#button-update').addEventListener('click', updateKey);
document.querySelector('#button-submit').addEventListener('click', submitItem);
document.querySelector('#button-getter').addEventListener('click', getDetails);