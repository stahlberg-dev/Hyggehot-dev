import { Fancybox } from "@fancyapps/ui/dist/fancybox/fancybox.esm.js";

export function gallery() {
    
    Fancybox.bind('[data-fancybox="gallery"]', {
        loop: true,
        closeButton: true,
        hideScrollbar: true,
        Thumbs: false,
        Toolbar: false,
    });
        
}

export function showGallery(
    buttonClassName, 
    wrapperClassName, 
    galleryClassName,
    headerClassName,
    showTime
) {

    const button = document.querySelector(buttonClassName);
    const wrapper = document.querySelector(wrapperClassName);
    const gallery = document.querySelector(galleryClassName);
    const header = document.querySelector(headerClassName);

    if (!button || !wrapper || !gallery) return;

    wrapper.style.maxHeight = '0px';
    wrapper.style.overflow = 'hidden';
    wrapper.style.transition = `max-height ${showTime}ms ease`;
    gallery.style.visibility = 'hidden';

    button.addEventListener("click", event => {

        gallery.style.visibility = 'visible';
        wrapper.style.maxHeight = gallery.offsetHeight + 'px';

        const headerHeight = header?.offsetHeight ?? 0;
        const goto = wrapper.getBoundingClientRect().top - headerHeight - 10;

        setTimeout(() => {

            window.scrollBy({
                top: goto,
                behavior: "smooth",
            });

        }, showTime * 0.3);
        
        setTimeout(() => {
            button.style.display = 'none';
        }, showTime);

    });

}
