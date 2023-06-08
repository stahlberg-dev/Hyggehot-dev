import {popups} from "./popups.js";

export const popupsMaker = new popups({
    linkAttributeName: 'data-popup',
    popupAttributeName: 'data-popup-name',
    popupContentClassName: '.popup__content',
    openedPopupClassName: '.popup_opened',
    popupCloseButtonClassName: '.popup__close',
    lockPaddingElementClassName: '.lock-padding',
    showHideTime: 300,
});