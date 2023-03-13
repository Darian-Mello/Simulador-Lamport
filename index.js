var totalProcessos = 5;
var totalIncrementos = 15;
var mensagemEnviada = false;
var tempoEnvio = 10;
var processos = [];
var emissor;
var receptor;
var clockEnviado;

function criaProcessos () {
    if (processos.length == 0) {
        for (let i = 0; i < totalProcessos; i++) {
            processos.push([]);
            simular(i);
        }
    } else {
        let aux = processos;
        processos = [];
        for (let i = 0; i < totalProcessos; i++) {
            if (aux[i]) {
                processos.push([aux[i][aux[i].length - 1]]);
                simular(i);
            } else {
                processos.push([]);
                simular(i);
            }
        }
    }
}

function clock (index) {
    return new Promise((resolve, reject) => {
        let tempo = index + 1;
        setTimeout(() => {
            if (processos[index].length == 0) {
                processos[index].push(0);
            } else {
                let tempoAtualizado = (processos[index][processos[index].length - 1]) + tempo;
                if (mensagemEnviada && receptor == index) {
                    if (clockEnviado >= tempoAtualizado) {
                        $('#explicacao-troca_mensagens')
                            .html(`Processo emissor: P${emissor + 1};
                                <br>Processo Receptor: P${receptor + 1} 
                                <br>Tempo do envio: ${tempoEnvio}. 
                                <br>Clock enviado pelo emissor: ${clockEnviado}
                                <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                <br>O relógio do receptor foi atualizado de acordo com o do emissor`);
                    
                        processos[index].push(clockEnviado);
                        mensagemEnviada = false;
                    } else {
                        $('#explicacao-troca_mensagens')
                            .html(`Processo emissor: P${emissor + 1};
                                    <br>Processo Receptor: P${receptor + 1} 
                                    <br>Tempo do envio: ${tempoEnvio}. 
                                    <br>Clock enviado pelo emissor: ${clockEnviado}
                                    <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                    <br>O relógio do receptor não foi atualizado de acordo com o do emissor`);
                        
                        processos[index].push(tempoAtualizado);
                        mensagemEnviada = false;
                    }
                } else {
                    processos[index].push(tempoAtualizado);
                }
            }
            if (processos[index].length == tempoEnvio && emissor == index) {
                clockEnviado = (processos[index][processos[index].length - 1]) + 1;
                mensagemEnviada = true;
                if (processos[receptor].length == totalIncrementos) {
                    tempoAtualizado = (processos[receptor][processos[receptor].length - 1]) + receptor + 1;
                    if (clockEnviado >= tempoAtualizado) {
                        $('#explicacao-troca_mensagens')
                            .html(`Processo emissor: P${emissor + 1};
                                <br>Processo Receptor: P${receptor + 1} 
                                <br>Tempo do envio: ${tempoEnvio}. 
                                <br>Clock enviado pelo emissor: ${clockEnviado}
                                <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                <br>O relógio do receptor foi atualizado de acordo com o do emissor`);
                    
                        processos[receptor].push(clockEnviado);
                        mensagemEnviada = false;
                    } else {
                        $('#explicacao-troca_mensagens')
                            .html(`Processo emissor: P${emissor + 1};
                                    <br>Processo Receptor: P${receptor + 1} 
                                    <br>Tempo do envio: ${tempoEnvio}. 
                                    <br>Clock enviado pelo emissor: ${clockEnviado}
                                    <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                    <br>O relógio do receptor não foi atualizado de acordo com o do emissor`);
                        
                        processos[receptor].push(tempoAtualizado);
                        mensagemEnviada = false;
                    }
                }
            }
            resolve();
        }, tempo * 100);
    });
}

function simular (index) {
    clock(index).then(function () {
        atualizaSimulacao();
        if (processos[index].length < totalIncrementos) {
            simular(index);
        }
        if (processos[processos.length - 1].length == totalIncrementos) {
            $('#btn-simular').prop('disabled', false);
        }
    });
}

function atualizaSimulacao () {
    let conteudo = '';
    processos.forEach((element, index) => {
        conteudo += `P${index + 1}: {${element.join(', ')}}<br><br>`;
    });
    $('#simulacao-processos').html(conteudo);
}

function validaFormulario () {
    let val = $('#total-processos').val();
    let val1 = $('#emissor').val();
    let val2 = $('#receptor').val();
    let num = $('#tempo-envio').val();
    if (val < val1 || val < val2) {
        alert('O processo escolhido como emissor ou receptor não será criado. Verifique o total de processos');
        return false;
    } else if (val1 === val2) {
        alert('O emissor e receptor não podem ser o mesmo processo');
        return false;
    } else if (num < 1 || num > 15) {
        alert('O tempo de envio deve estar entre 1 e 15');
        return false;
    } else {
        return true;
    }
}

$('#btn-simular').click(function (e) {
    e.stopPropagation();
    e.preventDefault();
    if (validaFormulario()) {
        $('#btn-simular').prop('disabled', true);
        emissor = $('#emissor').val() - 1;
        receptor = $('#receptor').val() - 1;
        totalProcessos = $('#total-processos').val();
        tempoEnvio = $('#tempo-envio').val();
        mensagemEnviada = false;
        clockEnviado = 0;
        $('#explicacao-troca_mensagens').html('');
        criaProcessos();
    }
})

$('#btn-resetar').click(function (e) {
    location.reload();
})