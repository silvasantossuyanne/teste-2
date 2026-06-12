/*
   script.js - Funcionalidades de Interação, Acessibilidade e Síntese de Voz Nativa
   Tema: Tecnologia e Meio Ambiente no Campo
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- CONTROLE DO PAINEL DE ACESSIBILIDADE ---
    const accToggle = document.getElementById('accToggle');
    const accPanel = document.getElementById('acessibilidade-painel');

    accToggle.addEventListener('click', () => {
        const isExpanded = accToggle.getAttribute('aria-expanded') === 'true';
        accToggle.setAttribute('aria-expanded', !isExpanded);
        accPanel.classList.toggle('active');
    });

    // Fechar painel se o utilizador clicar fora dele
    document.addEventListener('click', (e) => {
        if (!accPanel.contains(e.target)) {
            accPanel.classList.remove('active');
            accToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // --- ACESSIBILIDADE: ALTERNAR TAMANHO DA FONTE ---
    let escalaFonte = 100; 
    const btnAumentar = document.getElementById('btnAumentarFonte');
    const btnDiminuir = document.getElementById('btnDiminuirFonte');

    btnAumentar.addEventListener('click', () => {
        if (escalaFonte < 140) {
            escalaFonte += 10;
            document.documentElement.style.fontSize = `${escalaFonte}%`;
        }
    });

    btnDiminuir.addEventListener('click', () => {
        if (escalaFonte > 85) {
            escalaFonte -= 10;
            document.documentElement.style.fontSize = `${escalaFonte}%`;
        }
    });

    // --- ACESSIBILIDADE: ALTERNAR MODO CLARO / ESCURO ---
    const btnTema = document.getElementById('btnToggleTema');
    btnTema.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });

    // --- ACESSIBILIDADE: LEITURA POR VOZ (SpeechSynthesis API) ---
    const btnIniciarVoz = document.getElementById('btnIniciarVoz');
    const btnPararVoz = document.getElementById('btnPararVoz');
    let uttr = null;

    btnIniciarVoz.addEventListener('click', () => {
        // Interrompe qualquer leitura em execução
        window.speechSynthesis.cancel();

        // Captura o conteúdo relevante das seções principais (Manifesto e Benefícios)
        const secoesParaLer = document.querySelectorAll('#manifesto, #beneficios');
        let textoCompleto = "";

        secoesParaLer.forEach(secao => {
            const elementos = secao.querySelectorAll('h2, h3, p, blockquote');
            elementos.forEach(el => {
                textoCompleto += el.innerText + ". ";
            });
        });

        if (textoCompleto.trim().length > 0) {
            uttr = new SpeechSynthesisUtterance(textoCompleto);
            uttr.lang = 'pt-BR';
            uttr.rate = 1.0; 

            uttr.onstart = () => {
                btnIniciarVoz.disabled = true;
                btnPararVoz.disabled = false;
            };

            uttr.onend = () => { resetBotoesVoz(); };
            uttr.onerror = () => { resetBotoesVoz(); };

            window.speechSynthesis.speak(uttr);
        }
    });

    btnPararVoz.addEventListener('click', () => {
        window.speechSynthesis.cancel();
        resetBotoesVoz();
    });

    function resetBotoesVoz() {
        btnIniciarVoz.disabled = false;
        btnPararVoz.disabled = true;
    }

    // --- ÁREA DE COMENTÁRIOS INTEGRAÇÃO ---
    const formComentario = document.getElementById('formComentario');
    const txtComentario = document.getElementById('txtComentario');
    const listaComentarios = document.getElementById('listaComentarios');
    const placeholderComentario = document.getElementById('placeholderComentario');

    formComentario.addEventListener('submit', (e) => {
        e.preventDefault();

        const texto = txtComentario.value.trim();
        if (texto === "") return;

        if (placeholderComentario) {
            placeholderComentario.style.display = 'none';
        }

        const novoComentario = document.writeCommentNode(texto);
        listaComentarios.appendChild(novoComentario);

        txtComentario.value = "";
    });

    // Função auxiliar nativa para renderização limpa do nó do comentário
    document.writeCommentNode = function(texto) {
        const div = document.createElement('div');
        div.className = 'comment-item';
        
        const meta = document.createElement('div');
        meta.className = 'comment-meta';
        const agora = new Date();
        meta.innerText = `Leitor Conectado • Agora mesmo (${agora.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'})})`;
        
        const p = document.createElement('p');
        p.className = 'comment-text';
        p.innerText = texto;
        
        div.appendChild(meta);
        div.appendChild(p);
        return div;
    };
});
