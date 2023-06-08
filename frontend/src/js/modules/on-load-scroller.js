export function onLoadScrollTo(linkAttributeName, elementClassNames) {

    window.addEventListener('load', function() {

        const hashMatches = window.location.hash.match(/^#(.*)/);

        elementClassNames.forEach(elementClassName => {

            if (hashMatches?.[0]?.slice(1) === elementClassName?.slice(1)) {

                const link = document.querySelector(`[${linkAttributeName}="${elementClassName}"]`);

                let clickEvent = new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                });

                link.dispatchEvent(clickEvent);

            }

        });
        
    });

}