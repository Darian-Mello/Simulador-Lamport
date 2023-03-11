var totalProcessos = 5
var totalIncrementos = 15
var processos = []
var emissor = 4
var receptor = 3
var tempoEnvio = 5
var mensagemEnviada = false
var clockEnviado

function criaProcessos () {
    for (let i = 0; i < totalProcessos; i++) {
        processos.push([])
        simular(i)
    }
}

function clock (index) {
    return new Promise((resolve, reject) => {
        let tempo = index + 1
        setTimeout(() => {
            if (processos[index].length == 0) {
                processos[index].push(0)
            } else {
                let tempoAtualizado = (processos[index][processos[index].length - 1]) + tempo
                if (mensagemEnviada && receptor == index) {
                    if (clockEnviado >= tempoAtualizado) {
                        $('#explicacao-troca_mensagens')
                            .html(`O processo emissor: P${emissor + 1};
                                <br>Processo Receptor: P${receptor + 1} 
                                <br>Tempo do envio: ${tempoEnvio}. 
                                <br>Clock enviado pelo emissor: ${clockEnviado}
                                <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                <br>O relógio do receptor foi atualizado de acordo com o do emissor`)
                    
                        processos[index].push(clockEnviado)
                        mensagemEnviada = false
                    } else {
                        $('#explicacao-troca_mensagens')
                            .html(`O processo emissor: P${emissor + 1};
                                    <br>Processo Receptor: P${receptor + 1} 
                                    <br>Tempo do envio: ${tempoEnvio}. 
                                    <br>Clock enviado pelo emissor: ${clockEnviado}
                                    <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                    <br>O relógio do receptor não foi atualizado de acordo com o do emissor`)
                        
                        processos[index].push(tempoAtualizado)
                        mensagemEnviada = false
                    }
                } else {
                    processos[index].push(tempoAtualizado)
                }
            }
            if (processos[index].length == tempoEnvio && emissor == index) {
                clockEnviado = (processos[index][processos[index].length - 1]) + 1
                mensagemEnviada = true
                if (processos[receptor].length == totalIncrementos) {
                    tempoAtualizado = (processos[receptor][processos[receptor].length - 1]) + tempo
                    if (clockEnviado >= tempoAtualizado) {
                        $('#explicacao-troca_mensagens')
                            .html(`O processo emissor: P${emissor + 1};
                                <br>Processo Receptor: P${receptor + 1} 
                                <br>Tempo do envio: ${tempoEnvio}. 
                                <br>Clock enviado pelo emissor: ${clockEnviado}
                                <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                <br>O relógio do receptor foi atualizado de acordo com o do emissor`)
                    
                        processos[receptor].push(clockEnviado)
                        mensagemEnviada = false
                    } else {
                        $('#explicacao-troca_mensagens')
                            .html(`O processo emissor: P${emissor + 1};
                                    <br>Processo Receptor: P${receptor + 1} 
                                    <br>Tempo do envio: ${tempoEnvio}. 
                                    <br>Clock enviado pelo emissor: ${clockEnviado}
                                    <br>Clock do receptor no momento do recebimento: ${tempoAtualizado}
                                    <br>O relógio do receptor não foi atualizado de acordo com o do emissor`)
                        
                        processos[receptor].push(tempoAtualizado)
                        mensagemEnviada = false
                    }
                }
            }
            resolve()
        }, tempo * 500)
    })
}

function simular (index) {
    clock(index).then(function () {
        atualizaSimulacao()
        if (processos[index].length < totalIncrementos) {
            simular(index)
        }
        if (processos[processos.length - 1].length == totalIncrementos) {
            processos = []
            $('#btn-simular').prop('disabled', false)
        }
    })
}

function atualizaSimulacao () {
    let conteudo = ''
    processos.forEach((element, index) => {
        conteudo += `P${index + 1}: {${element.join(', ')}}<br><br>`
    })
    $('#simulacao-processos').html(conteudo)
}

function validaFormulario () {
    let val = $('#total-processos').val()
    let val1 = $('#emissor').val()
    let val2 = $('#receptor').val()
    if (val < val1 || val < val2) {
        alert('O processo escolhido como emissor ou receptor não será criado. Verifique o total de processos')
        return false
    } else if (val1 === val2) {
        alert('O emissor e receptor não podem ser o mesmo processo')
        return false
    } else {
        return true
    }
}

$('#btn-simular').click(function (e) {
    e.stopPropagation()
    e.preventDefault() 
    if (validaFormulario()) {
        $('#btn-simular').prop('disabled', true)
        emissor = $('#emissor').val() - 1
        receptor = $('#receptor').val() - 1
        totalProcessos = $('#total-processos').val()
        tempoEnvio = $('#tempo-envio').val()
        mensagemEnviada = false
        clockEnviado = 0
        $('#explicacao-troca_mensagens').html('')
        criaProcessos()
    }
})