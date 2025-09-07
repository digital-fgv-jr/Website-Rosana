window.addEventListener('DOMContentLoaded', (event) => {
    const cepInput = document.getElementById('id_cep');
    const logradouroInput = document.getElementById('id_logradouro');
    const bairroInput = document.getElementById('id_bairro');
    const cidadeInput = document.getElementById('id_cidade');
    const ufInput = document.getElementById('id_uf');
    const numeroInput = document.getElementById('id_numero'); 

    if (cepInput && logradouroInput && bairroInput && cidadeInput && ufInput && numeroInput) {
        
        cepInput.addEventListener('input', function (e) {
            let value = e.target.value;
            value = value.replace(/\D/g, '');
            value = value.substring(0, 8);
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5);
            }
            e.target.value = value;

            if (value.length === 9) {
                buscarCep(value);
            }
        });
        const buscarCep = (cep) => {
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
                .catch(error => {
                    console.error('Erro ao buscar o CEP:', error);
                });
        };
    }
});