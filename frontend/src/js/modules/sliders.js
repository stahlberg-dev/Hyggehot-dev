import Swiper, {Navigation, Pagination, EffectFade, Autoplay, Scrollbar} from 'swiper';

// ----- Title slider ----------------------------------------------------------------

export function swiperTitleSlider() {

    if (!document.querySelector('.title-screen__slider')) return;
    if (!document.querySelector('.title-screen__slider-pagination')) return;
    if (!document.querySelector('.title-screen__slider-prev-button')) return;
    if (!document.querySelector('.title-screen__slider-next-button')) return;

    const titleScreenSlider = new Swiper('.title-screen__slider', {
        modules: [Navigation, Pagination, EffectFade, Autoplay],
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 1500,
        loop: true,
        navigation: {
            nextEl: '.title-screen__slider-next-button',
            prevEl: '.title-screen__slider-prev-button',
        },
        pagination: {
            el: '.title-screen__slider-pagination',
            type: 'bullets',
            clickable: true,
            renderBullet: function (index, className) {
                return `<div class="` + className + `"><span>`+ ++index +`</span></div>`;
            },
        },
        breakpoints: {
        
        }
    });

    titleScreenSlider.on('slideChangeTransitionStart', function () {
            
        const slides = document.querySelectorAll('.title-screen__slider .swiper-slide');
        const activeSlide = document.querySelector('.title-screen__slider .swiper-slide-active');
        const ativeSlideNumber = activeSlide.getAttribute('data-swiper-slide-index');

        slides.forEach(slide => {

            slide.classList.remove('title-screen__slide_active');

            if (slide.getAttribute('data-swiper-slide-index') === ativeSlideNumber) {

                slide.classList.add('title-screen__slide_active');

            }

        });

    });

}

//------------------------------------------------------------------------------------------- 

// ----- Category title slider --------------------------------------------------------------

export function swiperCategoryTitleSlider() {

    if (!document.querySelector('.category-title-screen__slider')) return;
    if (!document.querySelector('.category-title-screen__slider-pagination')) return;
    if (!document.querySelector('.category-title-screen__slider-prev-button')) return;
    if (!document.querySelector('.category-title-screen__slider-next-button')) return;

    const titleScreenSlider = new Swiper('.category-title-screen__slider', {
        modules: [Navigation, Pagination, EffectFade, Autoplay],
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'fade',
        fadeEffect: {
            crossFade: true,
        },
        observer: true,
        observeParents: true,
        observeSlideChildren: true,
        slidesPerView: 1,
        spaceBetween: 0,
        watchOverflow: true,
        speed: 1500,
        loop: true,
        navigation: {
            nextEl: '.category-title-screen__slider-next-button',
            prevEl: '.category-title-screen__slider-prev-button',
        },
        pagination: {
            el: '.category-title-screen__slider-pagination',
            type: 'bullets',
            clickable: true,
            renderBullet: function (index, className) {
                return `<div class="` + className + `"><span>`+ ++index +`</span></div>`;
            },
        },
        breakpoints: {
        
        }
    });

    titleScreenSlider.on('slideChangeTransitionStart', function () {
            
        const slides = document.querySelectorAll('.category-title-screen__slider .swiper-slide');
        const activeSlide = document.querySelector('.category-title-screen__slider .swiper-slide-active');
        const ativeSlideNumber = activeSlide.getAttribute('data-swiper-slide-index');

        slides.forEach(slide => {

            slide.classList.remove('category-title-screen__slide_active');

            if (slide.getAttribute('data-swiper-slide-index') === ativeSlideNumber) {

                slide.classList.add('category-title-screen__slide_active');

            }

        });

    });

}
//------------------------------------------------------------------------------------------- 

// ----- Card slider maker ------------------------------------------------------------------

export class cardSliderMaker {

    constructor(config) {
        this.sliderClassName = config.sliderClassName;
        this.noSliderClassName = config.noSliderClassName;
        this.slideClassName = config.slideClassName;
        this.scrollbarClassName = config.scrollbarClassName;
        this.bigMobile = config.bigMobile;
        this.cardSlider = null;
    }

    initSlider(sliderClassName, scrollbarClassName) {

        this.cardSlider = new Swiper(sliderClassName, {
            modules: [Navigation, Pagination, Scrollbar],
            observer: true,
            observeParents: true,
            observeSlideChildren: true,
            slidesPerView: 1.1,
            spaceBetween: 20,
            watchOverflow: true,
            speed: 500,
            preloadImages: false,
            grabCursor: true,
            scrollbar: {
                el: scrollbarClassName,
                draggable: true,
            },
            breakpoints: {
                414: { 
                    slidesPerView: 1.3,
                },
                501: { 
                    slidesPerView: 1.4,
                },
                601: { 
                    slidesPerView: 2.1,
                },
            }
        });

    }

    destroySlider(sliderBlock, noSliderClassName) {

        this.cardSlider.destroy();
        this.cardSlider = null;
        sliderBlock.classList.add(noSliderClassName.slice(1));

    }

    createDestroySlider(
        sliderClassName, 
        noSliderClassName,
        scrollbarClassName,
        sliderBlock,
        NumberOfSlides,
        bigMobile
    ) {

        const mediaQueryTablet = window.matchMedia('(min-width: 768.02px)');
        const mediaQueryBigMobile = window.matchMedia('(min-width: 600.02px)');

        if (mediaQueryTablet.matches) {

            if (this.cardSlider) {
                this.destroySlider(sliderBlock, noSliderClassName);
            }

        } else if (mediaQueryBigMobile.matches) {

            if ((NumberOfSlides > 2) && bigMobile) {

                if (!this.cardSlider) {
                    sliderBlock.classList.remove(noSliderClassName.slice(1));
                    this.initSlider(sliderClassName, scrollbarClassName);
                } 

            } else {

                if (this.cardSlider) {
                    this.destroySlider(sliderBlock, noSliderClassName);
                }

            }

        } else {

            if (NumberOfSlides > 1) {

                if (!this.cardSlider) {
                    sliderBlock.classList.remove(noSliderClassName.slice(1));
                    this.initSlider(sliderClassName, scrollbarClassName);
                } 

            } else {

                if (this.cardSlider) {
                    this.destroySlider(sliderBlock, noSliderClassName);
                }

            }

        }
    
    }

    init() {

        const sliderBlock = document.querySelector(this.sliderClassName);

        if (!sliderBlock) return;
        if (!document.querySelector(this.scrollbarClassName)) return;

        const NumberOfSlides = sliderBlock.querySelectorAll(this.slideClassName).length;
        const bigMobile = this.bigMobile ?? true;

        this.createDestroySlider(
            this.sliderClassName, 
            this.noSliderClassName,
            this.scrollbarClassName,
            sliderBlock,
            NumberOfSlides,
            bigMobile
        );

        window.addEventListener('resize', event => {

            this.createDestroySlider(
                this.sliderClassName, 
                this.noSliderClassName,
                this.scrollbarClassName,
                sliderBlock,
                NumberOfSlides,
                bigMobile
            );
    
        });

    }

}

//-------------------------------------------------------------------------------------------

// ----- Blinds slider maker ----------------------------------------------------------------

export class blindsSlider {

    constructor(config) {
        this.sliderClassName = config.slider;
        this.sliderWrapperClassName = config.sliderWrapper;
        this.slideClassName = config.slide;
        this.activeSlideClassName = config.activeSlide;
        this.activeSlideIndex = config.startSlide;
        this.sliceClassName = config.slice;
        this.sliceNumber = config.sliceNumber;
        this.sliceGap = config.sliceGap;
        this.navigation = config.navigation;
        this.speed = config.speed;
        this.timeShift = config.timeShift;
        this.loop = config.loop;
        this.autoplay = config.autoplay;
        this.lockAutoplay = false;
    }

    setSlideProperties(
        slicesMap, 
        activeSlideClassName,
        speed,
        timeShift
    ) {

        let i = -1;

        slicesMap.forEach((innerSlides, slice) => {

            i++;

            setTimeout(() => {

                slice.style.transform = 'scale(0, 1)';

            }, i * timeShift);


            setTimeout(() => {

                slice.style.transform = 'scale(1, 1)';

            }, speed * 0.5 + i * timeShift);

            innerSlides.forEach((innerSlide, innerSlideIndex) => {

                if (innerSlideIndex === this.activeSlideIndex) {
    
                    innerSlide.classList.add(activeSlideClassName.slice(1));
    
                    setTimeout(() => {
    
                        innerSlide.style.opacity = '1';
    
                    }, speed * 0.5 + i * timeShift);
        
                } else {
        
                    innerSlide.classList.remove(activeSlideClassName.slice(1));
    
                    setTimeout(() => {
    
                        innerSlide.style.opacity = '0';
    
                    }, speed * 0.5 + i * timeShift);
        
                }

            });

        });

    }

    initNavigation(
        prevElement, 
        nextElement, 
        slicesMap, 
        activeSlideClassName,
        slidesNumber, 
        loop,
        speed,
        timeShift
    ) {

        if (prevElement) {

            prevElement.addEventListener("click", () => {

                this.lockAutoplay = true;

                this.activeSlideIndex = (this.activeSlideIndex > 0) ? 
                    this.activeSlideIndex - 1 : loop ? 
                    slidesNumber - 1 : this.activeSlideIndex;

                this.setSlideProperties(slicesMap, activeSlideClassName, speed, timeShift);

            });

        }

        if (nextElement) {
            
            nextElement.addEventListener("click", () => {

                this.lockAutoplay = true;

                this.activeSlideIndex = (this.activeSlideIndex < slidesNumber - 1) ? 
                    this.activeSlideIndex + 1 : loop ? 
                    0 : this.activeSlideIndex;

                    this.setSlideProperties(slicesMap, activeSlideClassName, speed, timeShift);

            });

        }
    
    }

    initAutoplay(
        slicesMap, 
        slidesNumber,
        activeSlideClassName, 
        fullDelay,
        loop,
        speed,
        timeShift
    ) {

        if (loop) {

            setInterval(() => {
    
                if (!this.lockAutoplay) {

                    this.activeSlideIndex = (this.activeSlideIndex < slidesNumber - 1) ? 
                            this.activeSlideIndex + 1 : 0;
        
                    this.setSlideProperties(slicesMap, activeSlideClassName, speed, timeShift);

                } else {
                    this.lockAutoplay = false;
                }
    
            }, fullDelay);

        } else {

            let autoplayTimerID = setInterval(() => {
    
                if (this.activeSlideIndex < slidesNumber - 1) { 

                    if (!this.lockAutoplay) {

                        this.activeSlideIndex++;
            
                        this.setSlideProperties(slicesMap, activeSlideClassName, speed, timeShift);

                    } else {
                        this.lockAutoplay = false;
                    }

                } else {

                    clearInterval(autoplayTimerID);

                }

            }, fullDelay);

        }

    }

    init() {

        const slider = document.querySelector(this.sliderClassName);
        if (!slider) return;

        const sliderWrapper = slider.querySelector(this.sliderWrapperClassName);
        if (!sliderWrapper) return;

        const slides = sliderWrapper.querySelectorAll(this.slideClassName);       
        if (slides.length <= 1) return;

        const slidesNumber = slides.length;

        this.activeSlideIndex = !Number.isFinite(this.activeSlideIndex) ? 0 :
            ( (this.activeSlideIndex > 0) && (this.activeSlideIndex < slidesNumber) ) ?
            Math.floor(this.activeSlideIndex) : 0;

        const activeSlideClassName = this.activeSlideClassName ?? this.slideClassName + '_active';

        const sliceClassName = this.sliceClassName ?? this.sliderClassName + '-slice';

        const sliceNumber = !Number.isFinite(this.sliceNumber) ? 1 : 
            (this.sliceNumber > 1) ? Math.floor(this.sliceNumber) : 1;

        let sliceGap;

        if (Number.isFinite(this.sliceGap)) {

            if ( (this.sliceGap > 0) && (this.sliceGap < sliderWrapper.offsetWidth / (sliceNumber - 1)) ) {
                sliceGap = this.sliceGap + 'px';
            } else {
                sliceGap = '0px';
            }

        } else {

            if (typeof(this.sliceGap) === 'string' && this.sliceGap.endsWith('%')) {
                
                let sliceGapValue = this.sliceGap.slice(0, -1);

                if ((sliceGapValue > 0) && (sliceGapValue < 100 / (sliceNumber - 1))) {
                    sliceGap = this.sliceGap;
                } else {
                    sliceGap = '0px';
                }

            }

        }

        const speed = !Number.isFinite(this.speed) ? 0 : (this.speed > 0) ? this.speed : 0;

        const timeShift = !Number.isFinite(this.timeShift) ? 0 : (this.timeShift > 0) ? this.timeShift : 0;

        const loop = (this.loop === true) ? true : false;

        sliderWrapper.style.display = 'flex';
        sliderWrapper.style.position = 'relative';
        sliderWrapper.style.flexDirection = 'row';
        sliderWrapper.style.flexWrap = 'nowrap';
        sliderWrapper.style.justifyContent = 'space-between';
        sliderWrapper.style.alignItems = 'stretch';
        sliderWrapper.style.gap = sliceGap;
        sliderWrapper.style.width = '100%';
        sliderWrapper.style.height = '100%';

        const slicesMap = new Map();

        for (let i = 0; i < sliceNumber; i++) {

            const slice = document.createElement('div');
            slice.className = sliceClassName.slice(1);

            slice.style.position = 'relative';
            slice.style.overflow = 'hidden';
            slice.style.flexGrow = '1';
            slice.style.flexShrink = '1';
            slice.style.flexBasis = 'auto';
            slice.style.transitionProperty = 'transform';
            slice.style.transitionDuration = `${speed * 0.5}ms`;
            slice.style.transitionTimingFunction ='linear';

            slides.forEach((slide) => {

                const innerSlide = slide.cloneNode(true);
                slice.append(innerSlide);

                innerSlide.style.position = 'absolute';
                innerSlide.style.top = '0px';
                innerSlide.style.left = `${-i * (sliderWrapper.offsetWidth / sliceNumber)}px`;
                innerSlide.style.width = `${sliderWrapper.offsetWidth}px`;
                innerSlide.style.height = '100%';
    
            });

            sliderWrapper.append(slice);

            const innerSlides = slice.querySelectorAll(this.slideClassName);
            slicesMap.set(slice, innerSlides);

        }

        slides.forEach((slide) => {
            slide.remove();
        });

        this.setSlideProperties(
            slicesMap, 
            activeSlideClassName,
            speed,
            timeShift
        );

        window.addEventListener('resize', () => {

            let i = -1;

            slicesMap.forEach((innerSlides) => {
    
                i++; 

                innerSlides.forEach((innerSlide) => {
    
                    innerSlide.style.left = `${-i * (sliderWrapper.offsetWidth / sliceNumber)}px`;
                    innerSlide.style.width = `${sliderWrapper.offsetWidth}px`;
    
                });
    
            });
    
        });

        const prevElementClassName = this.navigation?.prevElement;
        const nextElementClassName = this.navigation?.nextElement;
        const prevElement = document.querySelector(prevElementClassName);
        const nextElement = document.querySelector(nextElementClassName);

        this.initNavigation(
            prevElement, 
            nextElement, 
            slicesMap, 
            activeSlideClassName, 
            slidesNumber,
            loop,
            speed,
            timeShift
        );

        if (this.autoplay === true) {

            const fullDelay = speed;

            this.initAutoplay(
                slicesMap, 
                slidesNumber,
                activeSlideClassName, 
                fullDelay,
                loop,
                speed,
                timeShift
            );

        } else if (this.autoplay?.delay) {

            const fullDelay = !Number.isFinite(this.autoplay.delay) ? 
                speed : (this.autoplay.delay > 0) ? 
                this.autoplay.delay + speed : speed;

            this.initAutoplay(
                slicesMap, 
                slidesNumber,
                activeSlideClassName, 
                fullDelay,
                loop,
                speed,
                timeShift
            );

        }
        
    }

}

//-------------------------------------------------------------------------------------------