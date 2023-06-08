export class clickScroller {

    constructor(config) {
        this.linkAttributeName = config.linkAttributeName;
        this.headerClassName = config.headerClassName;
        this.maxHeaderHeight = config.maxHeaderHeight;
        this.lockedSections = config.lockedSections;
        this.callbacks = config.callbacks;
    }

    lockSection(gotoBlockName, sectionClassName, lockedClassName, unlockDelay) {
    
        const sections = document.querySelectorAll(sectionClassName);
            
        sections.forEach(section => {

            if (!section.closest(gotoBlockName)) {
    
                section.classList.add( lockedClassName.slice(1) );
    
                setTimeout(() => {
                    section.classList.remove( lockedClassName.slice(1) );
                }, unlockDelay);
    
            }

        });
    
    }

    onClick({
        linkAttributeName, 
        headerClassName, 
        maxHeaderHeight = document.documentElement.clientHeight,
        lockedSections = [], 
        callbacks = [],
    }) {

        document.addEventListener("click", event => {
    
            const scrollLink = event.target.closest(`[${linkAttributeName}]`);
    
            if(!scrollLink) return;
    
            const gotoBlockName = scrollLink.getAttribute(linkAttributeName);
            const gotoBlock = document.querySelector(gotoBlockName);

            if (gotoBlock) {

                let headerHeight = document.querySelector(headerClassName).offsetHeight;
                headerHeight = (headerHeight > maxHeaderHeight) ? maxHeaderHeight : headerHeight;

                const gotoBlockValue = gotoBlock.getBoundingClientRect().top - headerHeight;

                window.scrollBy({
                    top: gotoBlockValue,
                    behavior: "smooth",
                });

                lockedSections.forEach( item => {
                    this.lockSection(gotoBlockName, item.sectionClassName, item.lockedClassName, item.unlockDelay ?? 0);
                });

                callbacks.forEach(item => item(gotoBlock));

            }

            //event.preventDefault();
    
        });

    }

    init() {

        this.onClick(this);

    }
}
