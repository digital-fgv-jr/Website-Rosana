window.addEventListener('DOMContentLoaded', (event) => {

    const buscarCep = (cepInputElement) => {
        const cep = cepInputElement.value;

        const formContainer = cepInputElement.closest('.inline-related, .module');
        if (!formContainer) return;

        const logradouroInput = formContainer.querySelector('input[name$="logradouro"]');
        const bairroInput = formContainer.querySelector('input[name$="bairro"]');
        const cidadeInput = formContainer.querySelector('input[name$="cidade"]');
        const ufInput = formContainer.querySelector('select[name$="uf"]');
        const numeroInput = formContainer.querySelector('input[name$="numero"]');

        if (!logradouroInput || !bairroInput || !cidadeInput || !ufInput || !numeroInput) {
            console.warn("Aviso: Nem todos os campos de endereço foram encontrados para o autopreenchimento.");
            return;
        }

        const cepLimpo = cep.replace('-', '');
        const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    logradouroInput.value = data.logradouro;
                    bairroInput.value = data.bairro;
                    cidadeInput.value = data.localidade;
                    ufInput.value = data.uf;
                    numeroInput.focus();
                }
            })
            .catch(error => console.error('Erro ao buscar o CEP:', error));
    };

    const allCepInputs = document.querySelectorAll('input[name$="cep"]');
    allCepInputs.forEach(cepInput => {
        cepInput.addEventListener('input', (e) => {
            const currentCepInput = e.target;
            let value = currentCepInput.value;

            value = value.replace(/\D/g, '').substring(0, 8);
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            currentCepInput.value = value;

            if (value.length === 9) {
                buscarCep(currentCepInput);
            }
        });
    });
});