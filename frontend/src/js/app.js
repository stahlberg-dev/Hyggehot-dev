import {fixBitrixButton} from "./modules/functions.js";
import {scrollLocker} from "./modules/scroll-locker.js";
import * as sliders from "./modules/sliders.js";
import {gallery, showGallery} from "./modules/gallery.js";
import {showProductCharacteristics} from "./modules/product-characteristics.js";
import * as forms from "./modules/forms.js";
import {headerScrollObserver, elementScrollObserver} from "./modules/scroll-observer.js";
import {burger} from "./modules/burger.js";
import {popupsMaker} from "./modules/popups-maker.js";
import {labelLinksMaker} from "./modules/label-links.js";
import {phoneMask} from "./modules/masks.js";
import {clickScroller} from "./modules/click-scroller.js";
import {clickAnimator} from "./modules/click-animation.js";
import {parallax} from "./modules/parallax.js";
import {accordion} from "./modules/accordion.js";
import {temporaryElementMaker} from "./modules/temporary-element-maker.js";
 

//----- Scroll locking ----------------------------------------------------------------------

/* new scrollLocker({
    lockingElementClassName: '.observing', 
    lockedClassName: '.observing_locked',
    intersectingClassName: '.observing_shown', 
    unlockDelay: 1000,
}).init(); */

//-------------------------------------------------------------------------------------------

//----- Fix Bitrix button -------------------------------------------------------------------

fixBitrixButton(
    '.b24-widget-button-position-bottom-right',
    '.footer',
    '.lock-padding'
);

//-------------------------------------------------------------------------------------------

// ----- Gallery ----------------------------------------------------------------------------

gallery();

showGallery(
    '.gallery__button',
    '.gallery__images-wrapper',
    '.gallery__images_hidden',
    '.header__wrapper',
    1000
);

//-------------------------------------------------------------------------------------------

// ----- Product characteristics ------------------------------------------------------------

showProductCharacteristics(
    '.product-characteristics__button',
    '.product-characteristics__button_shown',
    '.product-characteristics__characteristic-list-wrapper',
    '.product-characteristics__characteristic-list_hidden',
    '.header__wrapper',
    500
);

//-------------------------------------------------------------------------------------------

// ----- Title slider -----------------------------------------------------------------------

sliders.swiperTitleSlider();

//------------------------------------------------------------------------------------------- 

// ----- Production slider ------------------------------------------------------------------

new sliders.blindsSlider({
    slider: '.production__slider',
    sliderWrapper: '.production__slider-wrapper',
    slide: '.production__slider-slide',
    activeSlide: '.production__slider-slide_active',
    slice: '.production__slider-slice',
    sliceNumber: 20,
    sliceGap: '0.4%',
    speed: 500,
    timeShift: 15,
    startSlide: 0,
    loop: true,
    autoplay: {
        delay: 5000,
    },
}).init();

//------------------------------------------------------------------------------------------- 

// ----- Category title slider --------------------------------------------------------------

sliders.swiperCategoryTitleSlider();

//------------------------------------------------------------------------------------------- 

// ----- Category cards slider --------------------------------------------------------------

new sliders.cardSliderMaker({
    sliderClassName: '.category-catalog__cards',
    noSliderClassName: '.cards_no-slider',
    slideClassName: '.category-catalog__card',
    scrollbarClassName: '.category-catalog__cards-scrollbar',
}).init();

//-------------------------------------------------------------------------------------------

// ----- Catalog camp cards slider ----------------------------------------------------------

new sliders.cardSliderMaker({
    sliderClassName: '.catalog-camp__cards',
    noSliderClassName: '.cards_no-slider',
    slideClassName: '.catalog-camp__card',
    scrollbarClassName: '.catalog-camp__cards-scrollbar',
}).init();

//------------------------------------------------------------------------------------------- 

// ----- Catalog heating cards slider -------------------------------------------------------

new sliders.cardSliderMaker({
    sliderClassName: '.catalog-heating__cards',
    noSliderClassName: '.cards_no-slider',
    slideClassName: '.catalog-heating__card',
    scrollbarClassName: '.catalog-heating__cards-scrollbar',
}).init();

//------------------------------------------------------------------------------------------- 

// ----- Catalog bath cards slider ----------------------------------------------------------

new sliders.cardSliderMaker({
    sliderClassName: '.catalog-bath__cards',
    noSliderClassName: '.cards_no-slider',
    slideClassName: '.catalog-bath__card',
    scrollbarClassName: '.catalog-bath__cards-scrollbar',
}).init();

//------------------------------------------------------------------------------------------- 

// ----- Product features slider ------------------------------------------------------------

new sliders.cardSliderMaker({
    sliderClassName: '.product-features__content',
    noSliderClassName: '.product-features__content_no-slider',
    slideClassName: '.product-features__image',
    scrollbarClassName: '.product-features__scrollbar',
    bigMobile: false,
}).init();

//-------------------------------------------------------------------------------------------

//----- Header scroll -----------------------------------------------------------------------

new headerScrollObserver({
    elementClassName: '.header',
    scrolledClassName: '.header_scroll',
}).init();

//-------------------------------------------------------------------------------------------

//----- Appearing scrolling elements --------------------------------------------------------

/* new elementScrollObserver({
    elementClassName: '.observing',
    intersectingClassName: '.observing_shown',
    lockedElementClassName: '.observing_locked',
    headerClassName: '.header__wrapper',
}).init(); */

//-------------------------------------------------------------------------------------------

// ----- Burger -----------------------------------------------------------------------------
  
new burger({
    buttonClassName: '.burger',
    activeButtonClassName: '.burger_active',
    menuClassName: '.menu__body',
    activeMenuClassName: '.menu__body_active',
    menuLinkClassName: '.menu__link',
    lockPaddingElementClassName: '.lock-padding',
    showHideTime: 300,
}).init();

//-------------------------------------------------------------------------------------------

// ----- Popups -----------------------------------------------------------------------------

popupsMaker.init();

//-------------------------------------------------------------------------------------------

// ----- Forms ------------------------------------------------------------------------------

forms.startForms();

//-------------------------------------------------------------------------------------------

// ----- Phone mask -------------------------------------------------------------------------

phoneMask('.form__input_phone-mask');

//------------------------------------------------------------------------------------------- 

//----- Click scroller ----------------------------------------------------------------------

/* 
new clickScroller({
    linkAttributeName: 'data-goto',
    headerClassName: '.header__wrapper',
    maxHeaderHeight: 50,
    lockedSections: [
        {
            sectionClassName: '.observing', 
            lockedClassName: '.observing_locked', 
            unlockDelay: 1000,
        },
    ],
}).init(); 
*/

//-------------------------------------------------------------------------------------------

//----- Click animation ---------------------------------------------------------------------

new clickAnimator([
    {
        clickableElementClassName: '.burger',
        clickedElementClassName: '.burger_clicked',
    },
    {
        clickableElementClassName: '.header__link',
        clickedElementClassName: '.header__link_clicked',
    },
    {
        clickableElementClassName: '.footer__link',
        clickedElementClassName: '.footer__link_clicked',
    },
    {
        clickableElementClassName: '.title-screen__slider-button',
        clickedElementClassName: '.title-screen__slider-button_clicked',
    },
    {
        clickableElementClassName: '.category-title-screen__slider-button',
        clickedElementClassName: '.category-title-screen__slider-button_clicked',
    },
    {
        clickableElementClassName: '.button',
        clickedElementClassName: '.button_clicked',
    },
    {
        clickableElementClassName: '.popup__close',
        clickedElementClassName: '.popup__close_clicked',
    },
]).init();

//-------------------------------------------------------------------------------------------

// ----- Parallax effects -------------------------------------------------------------------

/* parallax([
    {
        imageClassName: '.about__background',
        imageStartPosition: -0.7,
        speedCoefficient: 0.2,
        durationTime: 1000,
    },
    {
        imageClassName: '.complectation__background',
        imageStartPosition: 0.3,
        speedCoefficient: 0.2,
        durationTime: 1000,
    },
    {
        imageClassName: '.companion__background',
        imageStartPosition: -0.8,
        speedCoefficient: 0.2,
        durationTime: 1000,
    },
]); */

//-------------------------------------------------------------------------------------------

// ----- Questions --------------------------------------------------------------------------

/* const questionSubAccordion = new accordion({
    accordionClassName: '.accordion', 
    sectionClassName: '.accordion__subsection', 
    activeSectionClassName: '.accordion__subsection_active', 
    sectionTitleClassName: '.accordion__subsection-title', 
    sectionContentWrapperClassName: '.accordion__subsection-content',
    sectionContentClassName: '.accordion__subsection-text',
    showHideTime: 500,
    onLoadActiveSectionNums: [0],
});

questionSubAccordion.init();

const questionAccordion = new accordion({
    accordionClassName: '.accordion',
    sectionClassName: '.accordion__section', 
    activeSectionClassName: '.accordion__section_active', 
    sectionTitleClassName: '.accordion__section-title', 
    sectionContentWrapperClassName: '.accordion__section-list-wrapper',
    sectionContentClassName: '.accordion__section-list',
    showHideTime: 1000,
    onLoadActiveSectionNums: [0, 1],
    subAccordions: [questionSubAccordion],
});

questionAccordion.init(); */

//------------------------------------------------------------------------------------------- 