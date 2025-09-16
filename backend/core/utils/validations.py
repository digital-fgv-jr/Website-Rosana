from django.core.exceptions import ValidationError

def produtoArrays(arr1, arr2):
    if len(arr1) == len(arr2):
        return [arr1[i] * arr2[i] for i in range(len(arr1))]
    else:
        raise ValueError('Erro no produto de arrays: tamanhos diferentes.')

def CPFValidator(cpf):
    cpf = ''.join(filter(str.isdigit, str(cpf)))
    if len(cpf) != 11 or cpf == cpf[0] * 11:
        raise ValidationError('CPF inválido.')
    arraySemVerificador = [int(e) for e in cpf[:-2]]
    verificadores = [int(e) for e in cpf[-2:]]
    resto1 = sum(produtoArrays(arraySemVerificador, list(range(10, 1, -1)))) % 11
    digito1 = 0 if resto1 < 2 else 11 - resto1
    arrayComVerificador1 = arraySemVerificador + [digito1]
    resto2 = sum(produtoArrays(arrayComVerificador1, list(range(11, 1, -1)))) % 11
    digito2 = 0 if resto2 < 2 else 11 - resto2
    if [digito1, digito2] != verificadores:
        raise ValidationError('CPF inválido.')