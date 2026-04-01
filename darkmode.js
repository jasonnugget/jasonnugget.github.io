let darkMode = localStorage.getItem('darkMode') // stored locally, so checks local whether darkmode is on or off by default
const themeSwitch = document.getElementsByClassName('theme-switch')[0]

const enableDarkmode = () => {
    document.body.classList.add('darkMode')
    localStorage.setItem('darkMode', 'active')
    darkMode = 'active'
}

const disableDarkmode = () => {
    document.body.classList.remove('darkMode')
    localStorage.setItem('darkMode', null)
    darkMode = null
}

if(darkMode === 'active') enableDarkmode()

themeSwitch.addEventListener("click", () => { // addEventListener waits for something to happen to element. waiting to be clicked
    darkMode == localStorage.getItem('darkMode')
    darkMode !== "active" ? enableDarkmode() : disableDarkmode()
})