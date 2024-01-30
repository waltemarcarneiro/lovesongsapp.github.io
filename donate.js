/// Evento para abrir o popup quando o link 'pixLink' é clicado
document.getElementById('pixLink').addEventListener('click', function (event) {
    event.stopPropagation(); // Impede a propagação do clique para o documento
    openPopup();
});

// Função para abrir o popup
function openPopup() {
    var popup = document.getElementById('popup');
    popup.style.display = 'block';

    // Adiciona um evento de clique fora do popup para fechá-lo
    document.addEventListener('click', clickOutsidePopupHandler);
}
//FECHAR POPUP
// Função para fechar o popup
function closePopup() {
    var popup = document.getElementById('popup');
    popup.style.animation = 'slideDown 0.5s ease-out forwards';

    setTimeout(function () {
        popup.style.display = 'none';
        popup.style.animation = '';
    }, 500);
    // Aguarde o término da animação antes de ocultar o popup

    // Remove o evento de clique fora do popup ao fechar
    document.removeEventListener('click', clickOutsidePopupHandler);
}

// Função para lidar com o clique fora do popup
function clickOutsidePopupHandler(event) {
    var popup = document.getElementById('popup');
    var pixLink = document.getElementById('pixLink');

    if (event.target !== popup && !popup.contains(event.target) && event.target !== pixLink) {
        closePopup();
    }
}

//COPIA O TEXTO

function copyText(elementId) {
    var textToCopy = document.getElementById(elementId).innerText;

    // Cria um elemento de área de transferência temporário
    var tempInput = document.createElement('textarea');
    tempInput.value = textToCopy;
    document.body.appendChild(tempInput);

    // Seleciona o texto da área de transferência temporária
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    /* Para dispositivos móveis */

    // Copia o texto para a área de transferência
    document.execCommand('copy');

    // Remove o elemento de área de transferência temporário
    document.body.removeChild(tempInput);

    // Exibe um popup personalizado com o SweetAlert
    Swal.fire({
        title: elementId === 'pix' ? 'Chave copiada!' : 'Codigo Pix copiado com sucesso!',
        text: elementId === 'pix' ? 'Use a opção CHAVE ALEATÓRIA no app do seu banco.' : 'Use a opção COPIA e COLA no app do seu banco.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
            title: 'swal-title-custom',
            content: 'swal-text-custom'
        }
    });
}