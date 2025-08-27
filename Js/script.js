let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];  // Recupera o carrinho armazenado ou cria um carrinho vazio
let totalCarrinho = parseFloat(localStorage.getItem('totalCarrinho')) || 0;  // Recupera o total ou define como 0

// Função para salvar o carrinho e o total no localStorage
function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    localStorage.setItem('totalCarrinho', totalCarrinho.toFixed(2));  // Salva o total como string com duas casas decimais
}

// Função para expandir a sacola
function expandirSacola() {
    const sacola = document.getElementById('sacola');
    const qtdCarrinho = document.getElementById('qtd-carrinho');
    
    // Mostrar a sacola e ajustar o total de itens no botão
    sacola.style.display = 'block';
    qtdCarrinho.textContent = calcularTotalItens();  // Atualiza o número total de itens no carrinho
    exibirItensCarrinho(); // Exibe os itens do carrinho na sacola
}

// Função para minimizar a sacola
function minimizarSacola() {
    const sacola = document.getElementById('sacola');
    sacola.style.display = 'none'; // Esconde a sacola
}

// Função para exibir uma mensagem temporária com contador
function exibirMensagem(mensagem, isError = false) {
    const mensagemDiv = document.createElement('div');
    mensagemDiv.className = 'mensagem-temporaria';
    if (isError) {
        mensagemDiv.classList.add('mensagem-erro');
    }
    mensagemDiv.innerHTML = `${mensagem} <span id="contador">3</span>s`;
    document.body.appendChild(mensagemDiv);

    let contador = 3;
    const intervalo = setInterval(() => {
        contador--;
        document.getElementById('contador').textContent = contador;
        if (contador === 0) {
            clearInterval(intervalo);
            mensagemDiv.remove();
        }
    }, 1000);
}

// Função para adicionar item no carrinho
function adicionar(nomeItem, preco) {
    // Verifica se o item já está no carrinho
    const itemExistente = carrinho.find(item => item.nome === nomeItem);
    if (itemExistente) {
        itemExistente.quantidade += 1; // Incrementa a quantidade do item existente
    } else {
        // Adiciona o item ao carrinho
        carrinho.push({ nome: nomeItem, preco: preco, quantidade: 1 });
    }
    totalCarrinho += preco; // Atualiza o total do carrinho

    // Exibe a mensagem temporária com o nome do produto e o preço
    exibirMensagem(`Produto Adicionado: ${nomeItem}\nPreço: R$ ${preco.toFixed(2)}`);

    // Atualiza a quantidade total de itens no botão de carrinho
    const qtdCarrinho = document.getElementById('qtd-carrinho');
    qtdCarrinho.textContent = calcularTotalItens();

    // Atualiza a quantidade total de itens na sacola flutuante
    const qtdItensSacola = document.getElementById('qtd-itens-sacola');
    if (qtdItensSacola) {
        qtdItensSacola.textContent = calcularTotalItens();
    }

    // Salva as mudanças no carrinho e no total
    salvarCarrinho();

    // Atualiza a exibição dos itens no carrinho
    exibirItensCarrinho();

    // Exibe a sacola flutuante
    mostrarSacolaFlutuante();
}

// Função para calcular o total de itens no carrinho
function calcularTotalItens() {
    return carrinho.reduce((total, item) => total + item.quantidade, 0);
}

// Função para exibir os itens do carrinho
function exibirItensCarrinho() {
    const itensCarrinhoDiv = document.getElementById('itens-carrinho');
    itensCarrinhoDiv.innerHTML = '';  // Limpa a lista de itens da sacola

    if (carrinho.length === 0) {
        itensCarrinhoDiv.innerHTML = '<p>Seu carrinho está vazio.</p>';
    } else {
        // Cria a tabela
        const tabela = document.createElement('table');
        tabela.innerHTML = `
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Qtd.P</th>
                    <th>Valor</th>
                    <th>Excluir</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = tabela.querySelector('tbody');

        // Adiciona os itens do carrinho na tabela
        carrinho.forEach((item, index) => {
            const linha = document.createElement('tr');
            const valorTotalItem = item.preco * item.quantidade;
            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>${valorTotalItem.toFixed(2)}</td>
                <td><button onclick="removerItem(${index})"><i class="fas fa-trash"></i></button></td>
            `;
            tbody.appendChild(linha);
        });

        itensCarrinhoDiv.appendChild(tabela);
    }

    // Atualiza o total
    const totalCarrinhoDiv = document.getElementById('total-carrinho');
    totalCarrinhoDiv.innerHTML = `<p>Total: R$ ${totalCarrinho.toFixed(2)}</p>`;
}

// Função para remover item do carrinho
function removerItem(index) {
    // Remove o item do carrinho
    const itemRemovido = carrinho.splice(index, 1)[0]; 
    totalCarrinho -= itemRemovido.preco * itemRemovido.quantidade;  // Atualiza o total

    // Garante que o total não seja negativo
    if (totalCarrinho < 0) {
        totalCarrinho = 0;
    }

    // Atualiza a quantidade total de itens no botão de carrinho
    const qtdCarrinho = document.getElementById('qtd-carrinho');
    qtdCarrinho.textContent = calcularTotalItens();

    // Atualiza a quantidade total de itens na sacola flutuante
    const qtdItensSacola = document.getElementById('qtd-itens-sacola');
    if (qtdItensSacola) {
        qtdItensSacola.textContent = calcularTotalItens();
    }

    // Salva as mudanças no carrinho e no total
    salvarCarrinho();

    // Atualiza a exibição dos itens do carrinho
    exibirItensCarrinho();
    exibirItensCarrinhoFinalizacao(); // Atualiza a tabela de pedidos na página de finalização

    // Exibe a sacola flutuante
    mostrarSacolaFlutuante();
}

// Função para finalizar a compra
function finalizarCompra() {
    if (carrinho.length === 0) {
        exibirMensagem('O carrinho está vazio. Adicione itens para finalizar a compra.', true);
        return;
    }

    // Salva os dados do pedido no localStorage
    localStorage.setItem('pedido', JSON.stringify(carrinho));
    localStorage.setItem('totalPedido', totalCarrinho.toFixed(2));

    // Exibe a mensagem temporária e redireciona para o formulário de pagamento
    exibirMensagem('Compra Finalizada! Redirecionando para o formulário de pagamento...');
    setTimeout(() => {
        window.location.href = 'formpagamento.html';  // Modifique para o seu link de pagamento real
    }, 3000);
}

// Função para atualizar a quantidade de itens no carrinho
function atualizarQtdCarrinho() {
    const qtdCarrinho = document.getElementById('qtd-carrinho');
    qtdCarrinho.textContent = calcularTotalItens();  // Atualiza a quantidade de itens no carrinho

    // Atualiza a quantidade total de itens na sacola flutuante
    const qtdItensSacola = document.getElementById('qtd-itens-sacola');
    qtdItensSacola.textContent = calcularTotalItens();
}

// Função para definir a página atual como ativa na navegação
function definirPaginaAtiva() {
    const linksNav = document.querySelectorAll('.link-nav');
    const paginaAtual = window.location.pathname.split('/').pop();

    linksNav.forEach(link => {
        if (link.getAttribute('href') === paginaAtual) {
            link.classList.add('active');
        } else {
            link.classList.remove('active'); // Remove a classe active dos outros links
        }
    });
}

// Função para exibir os itens do carrinho na página de finalização
function exibirItensCarrinhoFinalizacao() {
    const tabelaPedidos = document.getElementById('tabela-pedidos');
    tabelaPedidos.innerHTML = '';  // Limpa a tabela de pedidos

    if (carrinho.length === 0) {
        tabelaPedidos.innerHTML = '<tr><td colspan="4">Seu carrinho está vazio.</td></tr>';
        // Redireciona para a página inicial se o carrinho estiver vazio
        exibirMensagem('Seu carrinho está vazio. Redirecionando para a página inicial...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    } else {
        carrinho.forEach((item, index) => {
            const linha = document.createElement('tr');
            const valorTotalItem = item.preco * item.quantidade;
            linha.innerHTML = `
                <td>${item.nome}</td>
                <td>${item.quantidade}</td>
                <td>${valorTotalItem.toFixed(2)}</td>
                <td><button onclick="removerItemFinalizacao(${index})"><i class="fas fa-trash"></i></button></td>
            `;
            tabelaPedidos.appendChild(linha);
        });
    }

    // Atualiza o total
    const totalCarrinhoFinalizacao = document.getElementById('total-carrinho-finalizacao');
    totalCarrinhoFinalizacao.innerHTML = `<p>Total: R$ ${totalCarrinho.toFixed(2)}</p>`;
}

// Função para remover item do carrinho na página de finalização
function removerItemFinalizacao(index) {
    // Remove o item do carrinho
    const itemRemovido = carrinho.splice(index, 1)[0]; 
    totalCarrinho -= itemRemovido.preco * itemRemovido.quantidade;  // Atualiza o total

    // Garante que o total não seja negativo
    if (totalCarrinho < 0) {
        totalCarrinho = 0;
    }

    // Salva as mudanças no carrinho e no total
    salvarCarrinho();

    // Atualiza a exibição dos itens do carrinho
    exibirItensCarrinhoFinalizacao();  // Atualiza a tabela de pedidos na página de finalização

    // Atualiza a quantidade total de itens no botão de carrinho
    const qtdCarrinho = document.getElementById('qtd-carrinho');
    if (qtdCarrinho) {
        qtdCarrinho.textContent = calcularTotalItens();
    }

    // Atualiza a quantidade total de itens na sacola flutuante
    const qtdItensSacola = document.getElementById('qtd-itens-sacola');
    if (qtdItensSacola) {
        qtdItensSacola.textContent = calcularTotalItens();
    }
}

// Função para verificar campos obrigatórios
function verificarCamposObrigatorios(campos) {
    let todosPreenchidos = true;
    let camposFaltantes = [];

    campos.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (!campo.value.trim()) {
            todosPreenchidos = false;
            camposFaltantes.push(campoId);
        } else {
            campo.style.borderColor = 'black';
        }
    });

    if (!todosPreenchidos) {
        camposFaltantes.forEach(campoId => {
            const campo = document.getElementById(campoId);
            campo.style.borderColor = 'orange';
        });
        exibirMensagem(`Por favor, preencha os seguintes campos: ${camposFaltantes.join(', ')}`, true);
    }

    return todosPreenchidos;
}

// Função para selecionar a opção de entrega
function selecionarOpcao(opcao) {
    const camposObrigatorios = ['nome', 'telefone'];
    if (!verificarCamposObrigatorios(camposObrigatorios)) {
        return;
    }

    const botoes = document.querySelectorAll('.botao-entrega');
    botoes.forEach(botao => {
        botao.classList.remove('active');
    });

    const botaoSelecionado = document.querySelector(`.botao-entrega[onclick="selecionarOpcao('${opcao}')"]`);
    botaoSelecionado.classList.add('active');

    const inputOpcaoEntrega = document.getElementById('opcao_entrega');
    inputOpcaoEntrega.value = opcao;

    const enderecoEntrega = document.getElementById('endereco-entrega');
    const containerMetodoPagamento = document.getElementById('container-metodo-pagamento');
    if (opcao === 'entrega') {
        enderecoEntrega.style.display = 'block';
        containerMetodoPagamento.style.display = 'block';
    } else {
        enderecoEntrega.style.display = 'none';
        containerMetodoPagamento.style.display = 'none';
    }
}

// Função para selecionar o método de pagamento
function selecionarPagamento(metodo) {
    const camposObrigatorios = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];
    if (!verificarCamposObrigatorios(camposObrigatorios)) {
        return;
    }

    const botoes = document.querySelectorAll('.botao-pagamento');
    botoes.forEach(botao => {
        botao.classList.remove('active');
    });

    const botaoSelecionado = document.querySelector(`.botao-pagamento[onclick="selecionarPagamento('${metodo}')"]`);
    botaoSelecionado.classList.add('active');

    const inputMetodoPagamento = document.getElementById('metodo_pagamento');
    inputMetodoPagamento.value = metodo;
}

// Função para preencher automaticamente o endereço com base no CEP
function preencherEndereco() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep !== '') {
        const validacep = /^[0-9]{8}$/;
        if (validacep.test(cep)) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('rua').value = data.logradouro;
                        document.getElementById('bairro').value = data.bairro;
                        document.getElementById('cidade').value = data.localidade;
                        document.getElementById('uf').value = data.uf;
                    } else {
                        exibirMensagem('CEP não encontrado.');
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar o CEP:', error);
                    exibirMensagem('Erro ao buscar o CEP.');
                });
        } else {
            exibirMensagem('Formato de CEP inválido.');
        }
    }
}

// Função para capturar os dados do formulário e enviar a nota via WhatsApp
function enviarNotaWhatsApp(event) {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const opcaoEntrega = document.getElementById('opcao_entrega').value.trim();
    const metodoPagamento = document.getElementById('metodo_pagamento').value.trim();

    if (!nome || !telefone || !opcaoEntrega || !metodoPagamento) {
        exibirMensagem('Por favor, preencha todos os campos obrigatórios antes de confirmar o pedido.', true);
        return;
    }

    let mensagem = `*Nota do Pedido - Jhon Sushi*%0A`;
    mensagem += `*Nome:* ${nome}%0A`;
    mensagem += `*Telefone:* ${telefone}%0A`;
    mensagem += `*Opção de Entrega:* ${opcaoEntrega}%0A`;

    if (opcaoEntrega === 'entrega') {
        const cep = document.getElementById('cep').value.trim();
        const rua = document.getElementById('rua').value.trim();
        const numero = document.getElementById('numero').value.trim();
        const complemento = document.getElementById('complemento').value.trim();
        const bairro = document.getElementById('bairro').value.trim();
        const cidade = document.getElementById('cidade').value.trim();
        const uf = document.getElementById('uf').value.trim();

        if (!cep || !rua || !numero || !bairro || !cidade || !uf) {
            exibirMensagem('Por favor, preencha todos os campos de endereço para entrega.', true);
            return;
        }

        mensagem += `*Endereço:*%0A`;
        mensagem += `CEP: ${cep}%0A`;
        mensagem += `Rua: ${rua}, Nº: ${numero}%0A`;
        if (complemento) mensagem += `Complemento: ${complemento}%0A`;
        mensagem += `Bairro: ${bairro}%0A`;
        mensagem += `Cidade: ${cidade} - ${uf}%0A`;
    }

    mensagem += `*Método de Pagamento:* ${metodoPagamento}%0A%0A`;
    mensagem += `*Itens do Pedido:*%0A`;

    carrinho.forEach(item => {
        mensagem += `- ${item.nome} (Qtd: ${item.quantidade}) - R$ ${item.preco.toFixed(2)}%0A`;
    });

    mensagem += `%0A*Total do Pedido:* R$ ${totalCarrinho.toFixed(2)}`;

    // Redirecionar para o WhatsApp
    const numeroWhatsApp = '5588997962265'; // Substitua pelo número do WhatsApp do restaurante
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;
    window.open(urlWhatsApp, '_blank');

    // Limpa o carrinho após finalizar o pedido
    carrinho = [];
    totalCarrinho = 0;
    salvarCarrinho();
    exibirItensCarrinho();
    exibirMensagem('Pedido confirmado e enviado via WhatsApp!');
}

// Adiciona evento de verificação aos campos obrigatórios
document.addEventListener('DOMContentLoaded', function() {
    const camposObrigatorios = ['nome', 'telefone', 'cep', 'rua', 'bairro', 'cidade', 'uf'];
    camposObrigatorios.forEach(campoId => {
        const campo = document.getElementById(campoId);
        campo.addEventListener('input', () => {
            campo.style.borderColor = 'black';
        });
    });

    // Esconder métodos de pagamento inicialmente
    document.getElementById('container-metodo-pagamento').style.display = 'none';
});

// Quando a página for carregada, exibir os itens do carrinho na finalização
window.addEventListener('load', function() {
    exibirItensCarrinho();
    atualizarQtdCarrinho();  // Atualiza a quantidade de itens no carrinho logo ao carregar a página
    definirPaginaAtiva();  // Define a página atual como ativa na navegação
    if (carrinho.length > 0) {
        mostrarSacolaFlutuante();  // Exibe a sacola flutuante se houver itens no carrinho
    }
    exibirItensCarrinhoFinalizacao();  // Exibe os itens do carrinho na página de finalização
});

// Exibir a sacola flutuante quando houver itens no carrinho
function mostrarSacolaFlutuante() {
    var sacola = document.getElementById('floating-bar');
    if (sacola) {
        sacola.style.display = 'block';
        atualizarQtdCarrinho();  // Atualiza a quantidade de itens na sacola flutuante
    }
}

// Ocultar a sacola flutuante
function esconderSacolaFlutuante() {
    var sacola = document.getElementById('floating-bar');
    if (sacola) {
        sacola.style.display = 'none';
    }
}

// Recuperar os dados do pedido na página de pagamento
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('formpagamento.html')) {
        const pedido = JSON.parse(localStorage.getItem('pedido')) || [];
        const totalPedido = parseFloat(localStorage.getItem('totalPedido')) || 0;

        const tabelaPedidos = document.getElementById('tabela-pedidos');
        tabelaPedidos.innerHTML = '';  // Limpa a tabela de pedidos

        if (pedido.length === 0) {
            tabelaPedidos.innerHTML = '<tr><td colspan="4">Seu carrinho está vazio.</td></tr>';
        } else {
            pedido.forEach((item, index) => {
                const linha = document.createElement('tr');
                const valorTotalItem = item.preco * item.quantidade;
                linha.innerHTML = `
                    <td>${item.nome}</td>
                    <td>${item.quantidade}</td>
                    <td>${valorTotalItem.toFixed(2)}</td>
                    <td><button onclick="removerItemFinalizacao(${index})"><i class="fas fa-trash"></i></button></td>
                `;
                tabelaPedidos.appendChild(linha);
            });
        }

        // Atualiza o total
        const totalPedidoDiv = document.getElementById('total-carrinho-finalizacao');
        totalPedidoDiv.innerHTML = `<p>Total: R$ ${totalPedido.toFixed(2)}</p>`;
    }
});

// Redirecionar para a página inicial se a sacola estiver vazia
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('formpagamento.html')) {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        if (carrinho.length === 0) {
            alert('Seu carrinho está vazio. Redirecionando para a página inicial...');
           window.location.href = 'index.html';
        }
    }
});