try {
    //wait for window to load....
    window.addEventListener('load', function () {

    let tablink = window.location.toString()
    //console.log(`tablink: ${tablink}`)
    chrome.storage.sync.get(['newsJaceProKey'], function (result) {
        setTimeout(() => {
            var ssoOnlyUserName = tablink.includes('https://ssaasi.delta.com/');
            var ssoUserNameAndPass = tablink.includes('https://ssaa.delta.com/');
            //console.log(`username ${result.username}`)
            //console.log(`time ${result.time}`)
            //console.log(`ssoonlyuser ${ssoOnlyUserName}`)
            //console.log(`ssousernpass ${ssoUserNameAndPass}`)
            if (result.username) {
                if (ssoUserNameAndPass) {
                    document.getElementById('username').value = result.username
                }
                if (ssoOnlyUserName) {
                    console.log(`on sso only usre, setting username to ${result.username}`)
                    document.getElementById('identifierInput').value = result.username
                    //document.getElementById('identifierInput').value = result.username
                    //document.getElementById('identifierInput').value='test'
                    let isPasswordNotPresent = document.querySelector('#password') === null
                    if (isPasswordNotPresent) {

                        let button = document.querySelector('.ping-button')
                        //button.click();
                    }

                }
                let button = document.querySelector(".buttons>input");
                //button.click();
            }
        }, 1000 * parseInt(result.time, 10))
    });
})
} catch (error) {
    console.error(error)
}
