export class clickAnimator {

    constructor(config) {
        this.clickableElementConfigs = config;
    }

    onClick({clickableElementClassName, 
            clickedElementClassName, 
            duration = 300, 
            clickCoordinates}) {

        const mediaQueryHover = window.matchMedia('(any-hover: none)');

        let downEvent = 'mousedown';
        let upEvent = 'mouseup';
        
        if (mediaQueryHover.matches) {
        
            downEvent = 'touchstart';
            upEvent = 'touchend';
        
        }

        const clickableElements = document.querySelectorAll(clickableElementClassName);

        clickableElements.forEach(clickableElement => {

            if (clickCoordinates) {

                clickableElement.style.setProperty("--x", "0px");
                clickableElement.style.setProperty("--y", "0px");
                clickableElement.style.setProperty("--r", "0px");

                if (!mediaQueryHover.matches) {

                    clickableElement.addEventListener('mousemove', event => {

                        let hoverX = event.offsetX;
                        let hoverY = event.offsetY;

                        clickableElement.style.setProperty("--hx", hoverX + "px");
                        clickableElement.style.setProperty("--hy", hoverY + "px");

                    });

                }

            }

            clickableElement.addEventListener(downEvent, event => {

                event.stopPropagation();

                clickableElement.classList.add(clickedElementClassName.slice(1));

                if (clickCoordinates) {

                    let clickX = (mediaQueryHover.matches) 
                                 ? (event.changedTouches[0].clientX - clickableElement.getBoundingClientRect().left) 
                                 : event.offsetX;
                    let clickY = (mediaQueryHover.matches)
                                 ? (event.changedTouches[0].clientY - clickableElement.getBoundingClientRect().top)
                                 : event.offsetY;
                    let clickR = Math.max(clickX, clickY, 
                                 clickableElement.offsetWidth - clickX, clickableElement.offsetHeight - clickY);

                    clickableElement.style.setProperty("--x", clickX + "px");
                    clickableElement.style.setProperty("--y", clickY + "px");
                    clickableElement.style.setProperty("--r", clickR + "px");

                }

                window.addEventListener(upEvent, () => {

                    setTimeout(() => {

                        clickableElement.classList.remove(clickedElementClassName.slice(1));
    
                    }, duration);

                }, {once: true});

            });

            clickableElement.addEventListener("dragstart", event => {
                event.preventDefault();
            });

        });                            

    }

    init() {

        const clickableElementConfigs = this.clickableElementConfigs;

        clickableElementConfigs.forEach(item => {

            this.onClick(item);

        });

    }

}
