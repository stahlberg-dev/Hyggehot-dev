import IMask from 'imask';

export function phoneMask(phoneInputClassName) {

    const phoneInputs = document.querySelectorAll(phoneInputClassName);

    for (let phoneInput of phoneInputs) {

        let phoneMaskOptions = {
            mask: [
                {mask: '+0 (000) 000-00-00', startsWith: '7'},
                {mask: '0 (000) 000-00-00', startsWith: '8'},
                {mask: /^\d+$/, startsWith: null},
            ],
            dispatch: function (appended, dynamicMasked) {
                var number = (dynamicMasked.value + appended).replace(/\D/g,'');
          
                return dynamicMasked.compiledMasks.find(function (m) {
                    return !m.startsWith || number.indexOf(m.startsWith) === 0;
                });
            },
        };

        let mask = IMask(phoneInput, phoneMaskOptions);

    }

}