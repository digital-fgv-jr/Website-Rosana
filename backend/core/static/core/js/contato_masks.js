window.addEventListener('DOMContentLoaded', (event) => {        
    const maskPhone = (value) => {
        let v = value.replace(/\D/g, '');
        v = v.substring(0, 11);        if (v.length > 2) {
            v = `(${v.substring(0, 2)}) ${v.substring(2)}`;
        }
        if (v.length > 9) {
             v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
        } else if (v.length > 6) {
             v = v.replace(/(\d{4})(\d{4})$/, '$1-$2');
        }
        return v;
    };    

    const maskCnpj = (value) => {
        let v = value.replace(/\D/g, '');
        let verif = value.replace(/[^0-9Xx]/g, '').substring(12, 14).toUpperCase();
        v = v.substring(0, 12);
        let masked = v;
        if (v.length > 8) {
            masked = `${v.substring(0,2)}.${v.substring(2,5)}.${v.substring(5,8)}/${v.substring(8,12)}`;
        } else if (v.length > 5) {
            masked = `${v.substring(0,2)}.${v.substring(2,5)}.${v.substring(5,8)}`;
        } else if (v.length > 2) {
            masked = `${v.substring(0,2)}.${v.substring(2,5)}`;
        } 
        if (verif.length > 0) {
            masked += `-${verif}`;
        }
        return masked;
    };


    const maskCpf = (value) => {
        let v = value.replace(/\D/g, '');
        let verif = value.replace(/[^0-9Xx]/g, '').substring(9, 11).toUpperCase();
        v = v.substring(0, 9);
        let masked = v;
        if (v.length > 6) {
            masked = `${v.substring(0,3)}.${v.substring(3,6)}.${v.substring(6,9)}`;
        } else if (v.length > 3) {
            masked = `${v.substring(0,3)}.${v.substring(3,6)}`;
        }
        if (verif.length > 0) {
            masked += `-${verif}`;
        }
        return masked;
    };   
    
    const maskInstagram = (value) => {
        if (!value) {
            return '';
        }
        let username = value.replace(/\s/g, '').replace(/@/g, '');
        return `@${username}`;
    };
    
    const applyMask = (selector, maskFunction) => {
        const inputs = document.querySelectorAll(selector);
        inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', (e) => {
                    e.target.value = maskFunction(e.target.value);
                });
            }
        });
    }; 

    applyMask('input[name$="-whatsapp"]', maskPhone);
    applyMask('input[name$="-cnpj"]', maskCnpj);
    applyMask('input[name$="cpf"]', maskCpf);
    applyMask('input[name$="-instagram"]', maskInstagram);
});
