window.addEventListener('DOMContentLoaded', (event) => {
    const cpfInput = document.getElementById('id_cpf');

    if (cpfInput) {
        cpfInput.addEventListener('input', function (e) {
            let value = e.target.value;
            value = value.replace(/\D/g, '');
            e.target.value = value;
        });
    }
});