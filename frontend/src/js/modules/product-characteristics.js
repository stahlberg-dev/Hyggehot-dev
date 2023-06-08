export function showProductCharacteristics(
    buttonClassName, 
    shownButtonClassName, 
    wrapperClassName, 
    listClassName,
    headerClassName,
    showTime
) {

    const button = document.querySelector(buttonClassName);
    const wrapper = document.querySelector(wrapperClassName);
    const list = document.querySelector(listClassName);
    const header = document.querySelector(headerClassName);

    if (!button || !wrapper || !list) return;

    wrapper.style.maxHeight = '0px';
    wrapper.style.overflow = 'hidden';
    wrapper.style.transition = `max-height ${showTime}ms ease`;
    list.style.visibility = 'hidden';

    button.addEventListener("click", event => {

        button.classList.toggle( shownButtonClassName.slice(1) );

        if (button.classList.contains( shownButtonClassName.slice(1) )) {

            list.style.visibility = 'visible';
            wrapper.style.maxHeight = list.offsetHeight + 'px';

            const headerHeight = header?.offsetHeight ?? 0;
            const goto = wrapper.getBoundingClientRect().top - headerHeight - 10;

            setTimeout(() => {

                window.scrollBy({
                    top: goto,
                    behavior: "smooth",
                });

            }, showTime * 0.3);

        } else {

            wrapper.style.maxHeight = '0px';
            
            setTimeout(() => {
                list.style.visibility = 'hidden';
            }, showTime);
            
        }

    });

}