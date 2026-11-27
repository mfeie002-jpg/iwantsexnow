// Runs before profile markup is parsed; never interpolates user data.
export const IMAGE_VISIBILITY_BOOTSTRAP = "try{if(sessionStorage.getItem('iwsn.images-hidden.session')==='1')document.body.dataset.nightImagesHidden='true'}catch(e){}";
