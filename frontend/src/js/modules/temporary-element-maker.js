export class temporaryElementMaker {

    constructor(config) {
        this.temporaryElementConfigs = config;
    }

    setTemporaryElement(parentElementClassMame, 
                        startDateString, 
                        endDateString, 
                        elementString) {

        const startDate = new Date( Date.parse(startDateString) );
        const endDate = new Date( Date.parse(endDateString) );
        const now = new Date();

        if ((now >= startDate) && (now < endDate)) {

            const parentElements = document.querySelectorAll(parentElementClassMame);

            parentElements.forEach(parentElement => {

                parentElement.childNodes.forEach(item => {
                    item.remove();
                });

                parentElement.insertAdjacentHTML('beforeend', elementString);

            });

        }

    }

    init() {

        const temporaryElementConfigs = this.temporaryElementConfigs;

        temporaryElementConfigs.forEach(item => {

            this.setTemporaryElement(item.parentElementClassMame, 
                                     item.startDateString, 
                                     item.endDateString, 
                                     item.elementString);

        });

    }

}