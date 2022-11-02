let updateKey = () => {
  // set the chrome sync storage time to the 'select-time' value when 'button-update' is clicked
  let newsJaceProKey = document.querySelector('#select-key').value;
  chrome.storage.sync.set({ newsJaceProKey }, () => {
    console.log('newsJaceProKey is set to ' + newsJaceProKey);
    document.querySelector('#button-update').disabled = true;
    document.querySelector('#button-update').innerText = 'Key is set';
    setTimeout(() => {
      document.querySelector('#button-update').disabled = false;
      document.querySelector('#button-update').innerText = 'Save';
    }, 1000);
  });
}
let newsJaceProKey = false;
chrome.storage.sync.get(['newsJaceProKey'], function (data) {
  if (data.newsJaceProKey) {
    newsJaceProKey = data.newsJaceProKey;
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
    console.log('trying to set title to', currentTab.title)
    document.querySelector('#select-title').value = currentTab.title;
    document.querySelector('#select-url').value = currentTab.url;
}
let submitItem = () => {
    if (newsJaceProKey) {
      var data = {
        "method": "POST",
        "headers": {
          "Content-Type": "application/json",
          "submitKey": newsJaceProKey,
        },
        "body": JSON.stringify({
          "title": document.querySelector('#select-title').value || currentTab.title,
          "url": document.querySelector('#select-url').value || currentTab.url
        })
      }
      document.querySelector('#response').innerText = 'Sending data...' + '\n' + JSON.stringify(JSON.parse(data.body), null, ' ');
      console.log('snding data', JSON.parse(data.body))
      fetch("https://news.jace.pro/.redwood/functions/submitItem", data)
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