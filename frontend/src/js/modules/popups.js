import {lockBody, unlockBody} from "./functions.js";

export class popups {

    constructor(config) {
        this.linkAttributeName = config.linkAttributeName;
        this.popupAttributeName = config.popupAttributeName;
        this.popupContentClassName = config.popupContentClassName;
        this.openedPopupClassName = config.openedPopupClassName;
        this.popupCloseButtonClassName = config.popupCloseButtonClassName;
        this.lockPaddingElementClassName = config.lockPaddingElementClassName;
        this.showHideTime = config.showHideTime;
        this.video = config.video;
    }

    addVideo(currentPopup, popupName, videoClassName, mp4Path, ogvPath) {

        if (currentPopup.getAttribute(this.popupAttributeName) == popupName &&
            !currentPopup.querySelector('video')) {
    
            const mp4Source = document.createElement('source');
            mp4Source.setAttribute('src', mp4Path);
            mp4Source.setAttribute('type', "video/mp4");
    
            const ogvSource = document.createElement('source');
            ogvSource.setAttribute('src', ogvPath);
            ogvSource.setAttribute('type', "video/ogg");
    
            const videoFrame = document.createElement('video');
            videoFrame.className = videoClassName.slice(1);
            videoFrame.setAttribute('autoplay', 'autoplay');
            videoFrame.setAttribute('controls', 'controls');
    
            videoFrame.append(mp4Source);
            videoFrame.append(ogvSource);
            currentPopup.querySelector(this.popupContentClassName)?.append(videoFrame);
    
        }

    }

    getPopup(popupName) {
        return document.querySelector(`[${this.popupAttributeName}="${popupName}"]`);
    }
    
    openPopup(currentPopup) {
        
        if (typeof currentPopup === 'string') {
            currentPopup = this.getPopup(currentPopup);
        }
        
        if (!currentPopup) return;
        
        const popupActive = document.querySelector(this.openedPopupClassName);
        
        if (popupActive) {
            
            this.closePopup(popupActive, false);
            
        } else {
            
            const lockPaddingElements = document.querySelectorAll(this.lockPaddingElementClassName);
            lockBody(lockPaddingElements, this.showHideTime);
            
        }
    
        currentPopup.classList.add( this.openedPopupClassName.slice(1) );

        this.video?.forEach(item => {

            this.addVideo(currentPopup, item.popupName, item.videoClassName, item.mp4Path, item.ogvPath);

        });
    
    }
    
    closePopup(popupActive, doUnlock = true) {
    
        setTimeout(() => {
    
            popupActive?.querySelectorAll('video').forEach(element => element.pause());
            popupActive?.querySelectorAll('form').forEach(popupForm => popupForm.reset());
    
        }, this.showHideTime);
        
        popupActive?.classList.remove(this.openedPopupClassName.slice(1));
        
        const lockPaddingElements = document.querySelectorAll(this.lockPaddingElementClassName);
    
        if (doUnlock) {
            unlockBody(lockPaddingElements, this.showHideTime);
        }
    
    }

    init() {

        const linkAttributeName = this.linkAttributeName;
        const popupAttributeName = this.popupAttributeName;
        const popupContentClassName = this.popupContentClassName;
        const openedPopupClassName = this.openedPopupClassName; 
        const popupCloseButtonClassName = this.popupCloseButtonClassName; 

        const popupLinks = document.querySelectorAll(`[${linkAttributeName}]`);
        const popups = document.querySelectorAll(`[${popupAttributeName}]`);
        const popupCloseButtons = document.querySelectorAll(popupCloseButtonClassName);

        popupLinks.forEach(item => {

            item.addEventListener("click", () => {

                const popupName = item.getAttribute(linkAttributeName);
                const currentPopup = document.querySelector(`[${popupAttributeName}="${popupName}"]`);
                this.openPopup(currentPopup);

            });

        });

        popupCloseButtons.forEach(item => {

            item.addEventListener("click", () => {

                this.closePopup( item.closest(`[${popupAttributeName}]`) );

            });

        });

        popups.forEach(item => {

            item.addEventListener("click", event => {

                if (!event.target.closest(popupContentClassName)) {

                    this.closePopup( event.target.closest(`[${popupAttributeName}]`) );

                }

            });

        });

        document.addEventListener('keydown', event => {

            if (event.which === 27) {

                const popupActive = document.querySelector(openedPopupClassName);
                this.closePopup(popupActive);

            }

        });

    }
}
