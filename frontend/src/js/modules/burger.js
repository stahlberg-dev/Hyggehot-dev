import {lockBody, unlockBody} from "./functions.js";

export class burger {

    constructor(config) {
        this.buttonClassName = config.buttonClassName; 
        this.activeButtonClassName = config.activeButtonClassName;
        this.menuClassName = config.menuClassName; 
        this.activeMenuClassName = config.activeMenuClassName;
        this.menuLinkClassName = config.menuLinkClassName; 
        this.lockPaddingElementClassName = config.lockPaddingElementClassName;
        this.showHideTime = config.showHideTime;
    }

    onButtonClick(button, 
                  activeButtonClassName,
                  menu, 
                  activeMenuClassName,
                  lockPaddingElements,
                  showHideTime) {

        if (!button || !menu) return;

        button.addEventListener("click", function() {
                
            if (button.classList.contains( activeButtonClassName.slice(1)) ) {
                
                unlockBody(lockPaddingElements, showHideTime);
                
            } else {
                
                lockBody(lockPaddingElements, showHideTime);
                
            }

            button.classList.toggle( activeButtonClassName.slice(1) );
            menu.classList.toggle( activeMenuClassName.slice(1) );
    
        });

    }

    onLinkClick(button, 
                activeButtonClassName,
                menu, 
                activeMenuClassName,
                menuLinkClassName,
                lockPaddingElements,
                showHideTime) {

        if (!button || !menu) return;

        menu.addEventListener("click", event => {

            if(!event.target.closest(menuLinkClassName)) return;

            if (button.classList.contains( activeButtonClassName.slice(1) )) {

                button.classList.remove( activeButtonClassName.slice(1) );
                menu.classList.remove( activeMenuClassName.slice(1) );
                unlockBody(lockPaddingElements, showHideTime);

            } 

        });

    }

    init() {

        window.addEventListener('load', () => {

            const button = document.querySelector(this.buttonClassName);
            const activeButtonClassName = this.activeButtonClassName;
            const menu = document.querySelector(this.menuClassName);
            const activeMenuClassName = this.activeMenuClassName;
            const menuLinkClassName = this.menuLinkClassName;
            const lockPaddingElements = document.querySelectorAll(this.lockPaddingElementClassName);
            const showHideTime = this.showHideTime;
    
            this.onButtonClick(button, 
                               activeButtonClassName,
                               menu, 
                               activeMenuClassName,
                               lockPaddingElements,
                               showHideTime);
    
            this.onLinkClick(button, 
                             activeButtonClassName,
                             menu, 
                             activeMenuClassName,
                             menuLinkClassName, 
                             lockPaddingElements,
                             showHideTime);

        });

    }
}
