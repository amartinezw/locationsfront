const loader = document.querySelector('.overlay');

export function  showLoader(){
    loader.classList.remove('overlay--hide');
    loader.classList.add('overlay--show');
}
export function hideLoader(){
    loader.classList.remove('overlay--show');
    loader.classList.add('overlay--hide');
}