export class accordion {

    constructor(config) {
        this.accordionClassName = config.accordionClassName;
        this.sectionClassName = config.sectionClassName;
        this.activeSectionClassName = config.activeSectionClassName;
        this.sectionTitleClassName = config.sectionTitleClassName;
        this.sectionContentWrapperClassName = config.sectionContentWrapperClassName;
        this.sectionContentClassName = config.sectionContentClassName;
        this.showHideTime = config.showHideTime;
        this.onLoadActiveSectionNums = config.onLoadActiveSectionNums;
        this.subAccordions = config.subAccordions;
    }

    onLoad({
        sectionClassName, 
        activeSectionClassName,
        sectionContentWrapperClassName,
        sectionContentClassName,
        showHideTime, 
        onLoadActiveSectionNums
    }) {

        const sections = document.querySelectorAll(sectionClassName);
        const sectionContentWrappers = document.querySelectorAll(sectionContentWrapperClassName);
        const sectionContents = document.querySelectorAll(sectionContentClassName);

        sectionContentWrappers.forEach(sectionContentWrapper => {

            sectionContentWrapper.style.maxHeight = '0px';
            sectionContentWrapper.style.overflow = 'hidden';
            sectionContentWrapper.style.transition = `max-height ${showHideTime}ms ease`;

        });

        sectionContents.forEach(sectionContent => {

            sectionContent.style.display = 'none';

        });

        onLoadActiveSectionNums?.forEach(num => {

            if ( !(sections?.[num]) ) return;

            const contentWrapper = sections[num].querySelector(sectionContentWrapperClassName);
            const content = sections[num].querySelector(sectionContentClassName);

            sections[num].classList.add( activeSectionClassName.slice(1) );
            content.style.display = 'block';
            contentWrapper.style.maxHeight = '';

        } );
        
    }

    onClick({
        accordionClassName,
        sectionClassName, 
        activeSectionClassName, 
        sectionTitleClassName, 
        sectionContentWrapperClassName,
        sectionContentClassName,
        showHideTime, 
        subAccordions = [],
    }) {

        const accordion = document.querySelector(accordionClassName);
        const titles = document.querySelectorAll(sectionTitleClassName);

        titles.forEach(title => {

            title.addEventListener("click", function(event) {

                const activeSections = document.querySelectorAll(activeSectionClassName);
                const closestSection = event.target.closest(sectionClassName);
                const isActive = closestSection?.classList.contains( activeSectionClassName.slice(1) );

                accordion.style.pointerEvents = 'none';

                setTimeout(() => {
                    accordion.style.pointerEvents = 'auto';
                }, showHideTime);

                activeSections.forEach(activeSection => {

                    const activeSectionContentWrapper = activeSection.querySelector(sectionContentWrapperClassName);
                    const activeSectionContent = activeSection.querySelector(sectionContentClassName);

                    activeSection.classList.remove( activeSectionClassName.slice(1) );

                    activeSectionContentWrapper.style.maxHeight = activeSectionContent.offsetHeight + 'px';

                    setTimeout(() => {
                        activeSectionContentWrapper.style.maxHeight = '0px';
                    }, 0);

                    setTimeout(() => {
                        activeSectionContent.style.display = 'none';
                    }, showHideTime);               

                    subAccordions.forEach(subAccordion => {

                        if ( !(subAccordion?.activeSectionClassName)
                             || !(subAccordion?.sectionContentWrapperClassName) 
                             || !(subAccordion?.sectionContentClassName
                             || !(subAccordion?.showHideTime) ) ) return;
    
                        const activeSubSections = activeSection.querySelectorAll(subAccordion.activeSectionClassName);
    
                        activeSubSections.forEach(activeSubSection => {
    
                            const activeSubWrapper = activeSubSection.querySelector(subAccordion.sectionContentWrapperClassName);
                            const activeSubContent = activeSubSection.querySelector(subAccordion.sectionContentClassName);
    
                            activeSubSection.classList.remove( subAccordion.activeSectionClassName.slice(1) );
    
                            activeSubWrapper.style.maxHeight = activeSectionContent.offsetHeight + 'px';
    
                            setTimeout(() => {
                                activeSubWrapper.style.maxHeight = '0px';
                            }, 0);
    
                            setTimeout(() => {
                                activeSubContent.style.display = 'none';
                            }, subAccordion.showHideTime);
    
                        });

                    });

                });

                if (closestSection && !isActive) {

                    const closestSectionContentWrapper = closestSection.querySelector(sectionContentWrapperClassName);
                    const closestSectionContent = closestSection.querySelector(sectionContentClassName);

                    closestSection.classList.add( activeSectionClassName.slice(1) );
                    closestSectionContent.style.display = 'block';
                    closestSectionContentWrapper.style.maxHeight = closestSectionContent.offsetHeight + 'px';

                    setTimeout(() => {
                        closestSectionContentWrapper.style.maxHeight = '';
                    }, showHideTime);

                } 
            
            });

        });

    }
    
    init() {

        this.onLoad(this);
        this.onClick(this);

    }
}
