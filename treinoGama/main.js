//PARA MASCARAR O CNPJ EM TEMPO REAL
const cnpjInput = document.getElementById('cnpj');

cnpjInput.addEventListener('input', function (e) {
    let value = e.target.value;

    //remove tudo, exceto números
    value = value.replace(/\D/g, "");

    //coloca a máscara de CNPJ em tempo real (por isso uma variável value por "." e "/" do cnpj)
    value = value.replace(/^(\d{2})(\d)/, "$1.$2");
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
    value = value.replace(/(\d{4})(\d)/, "$1-$2");

    e.target.value = value
});

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, "");

    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = 12;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);

    let soma = 0;
    let peso = 5;

    for (let i = 0; i < tamanho; i++) {
        soma += numeros[i] * peso;
        peso = (peso === 2) ? 9 : peso - 1;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos[0]) return false;

    // segundo dígito
    tamanho = 13;
    numeros = cnpj.substring(0, tamanho);

    soma = 0;
    peso = 6;

    for (let i = 0; i < tamanho; i++) {
        soma += numeros[i] * peso;
        peso = (peso === 2) ? 9 : peso - 1;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

    if (resultado != digitos[1]) return false;

    return true;
}

function buscarCNPJ() {
    const cnpj = document.getElementById('cnpj').value;

    if (validarCNPJ(cnpj)) {
        const cnpjLimpo = cnpj.replace(/\D/g, "");

        alert("CNPJ válido! Buscando informações...");

        fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);

                const resultado = document.getElementById("resultado");
                resultado.innerHTML = `
                <p><strong>Empresa:</strong> ${data.razao_social}</p>
                <p><strong>Cidade:</strong> ${data.municipio}</p>
                <p><strong>Estado:</strong> ${data.uf}</p>
                <p><strong>Situação:</strong> ${data.descricao_situacao_cadastral}</p>
                <p><strong>Bairro:</strong> ${data.bairro}</p>
                <p><strong>Início:</strong> ${data.data_inicio_atividade}</p>`;
            })
            .catch(error => {
                console.error("Erro:", error);
            });

    } else {
        alert("CNPJ inválido! Verifique os números digitados.");
    }
}
//Maneira alternativa de chamar eventos atraves de "cliques" em botões ou outros elementos do html:
//cria uma constante que seleciona o elemento "button" do html
const botao = document.querySelector("button");
//adiciona um evento de clique ao elemento atribuido a constante botao que é o "button" do html 
botao.addEventListener("click", buscarCNPJ);