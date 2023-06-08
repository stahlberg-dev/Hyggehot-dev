export function lockBody (lockPaddingElements, disablePointerDelay = 0) {

    if (!document.body.classList.contains('locked')) {

        const lockPaddingValue = window.innerWidth - document.documentElement.clientWidth + 'px';

        document.body.classList.add('locked');
        document.body.style.paddingRight = lockPaddingValue;

        lockPaddingElements.forEach(item => {
            item.style.paddingRight = lockPaddingValue;
        });

        let scroller = document.createElement('div');
        scroller.className = 'scroller disable-pointer';
        document.body.append(scroller);

        setTimeout(function() {

            scroller.classList.remove('disable-pointer');

        }, disablePointerDelay);

    }

}

export function unlockBody (lockPaddingElements, unlockDelay = 0) {

    if (document.body.classList.contains('locked')) {

        const scroller = document.querySelector('.scroller');
        scroller?.classList.add('disable-pointer');

        setTimeout(function() {
            
            document.body.classList.remove('locked');
            document.body.style.paddingRight = '0px';

            lockPaddingElements.forEach(item => {
                item.style.paddingRight = '0px';
            });
            
            scroller?.remove();
    
        }, unlockDelay);

    } 

}

export function fixBitrixButton (
    bitrixButtonClassName, 
    footerClassName, 
    lockPaddingElementClassName
) {

    window.addEventListener('load', function() {

        const bitrixButton = document.querySelector(bitrixButtonClassName);
        const footer = document.querySelector(footerClassName);

        bitrixButton.classList.add( lockPaddingElementClassName.slice(1) );
        bitrixButton.style.bottom = '100px';

        window.addEventListener('scroll', function() {

            const footerCoordinate = document.documentElement.clientHeight - footer.getBoundingClientRect().top;
    
            if (footerCoordinate > 0) {
    
                const bitrixButtonCoordinate = 100 + footerCoordinate + 'px';
                bitrixButton.style.bottom = bitrixButtonCoordinate;
    
            } else {
                bitrixButton.style.bottom = '100px';
            }

        });
        
    });

}
