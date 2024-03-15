document.addEventListener('DOMContentLoaded', () => {
    const signup_option = document.querySelector('#signup_option')
    const login_option = document.querySelector('#login_option')
    const Close_session = document.querySelector('#Close_session')
    
    const email = localStorage.getItem('email');
    if (email) {
        hidden_item(signup_option)
        hidden_item(login_option)
        show_item(Close_session)
    }else{
        show_item(signup_option)
        show_item(login_option)
        hidden_item(Close_session)
    }
})

const hidden_item = (item) =>{
    item.classList.remove('block')
    item.classList.add('hidden')
}
const show_item = (item) =>{
    item.classList.remove('hidden')
    item.classList.add('block')
}