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
        v = v.substring(0, 14);        if (v.length > 12) {
            v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, '$1.$2.$3/$4-$5');
        } else if (v.length > 8) {
            v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{0,4}).*/, '$1.$2.$3/$4');
        } else if (v.length > 5) {
            v = v.replace(/^(\d{2})(\d{3})(\d{0,3}).*/, '$1.$2.$3');
        } else if (v.length > 2) {
            v = v.replace(/^(\d{2})(\d{0,3}).*/, '$1.$2');
        }
        return v;
    };

    const maskCpf = (value) => {
        let v = value.replace(/\D/g, '');
        v = v.substring(0, 11);
        return v;
    };    
    
    const maskInstagram = (value) => {
        if (!value) {
            return '';
        }
        let username = value.replace(/\s/g, '').replace(/@/g, '');
        return `@${username}`;
    };
    
    const applyMask = (selector, maskFunction) => {
        const input = document.querySelector(selector);
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.value = maskFunction(e.target.value);
            });
        }
    };    

    applyMask('input[name$="-whatsapp"]', maskPhone);
    applyMask('input[name$="-telefone"]', maskPhone);
    applyMask('input[name$="-cnpj"]', maskCnpj);
    applyMask('#id_cpf', maskCpf);
    applyMask('input[name$="-instagram"]', maskInstagram);});