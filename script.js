const URL_API =
  "https://script.google.com/macros/s/AKfycbzUi5xWRm0_AoMpJyzrkYUhUga954Sks7xer-2T1WgD-TOHILI8BmL3h7eVubbiDUM-/exec";

const LINK_FORMULARIO =
  "https://docs.google.com/forms/d/e/1FAIpQLSeO2-SQ0hEDoEjtcCVWoBjE1TwVvt84fDv_iFhRJH4LGUuL2g/viewform";

async function mostrarPendencias() {
  const nome = document.getElementById("nomeRecebedor").value.trim();
  const turno = document.getElementById("turnoRecebido").value;
  const area = document.getElementById("areaPendencias");
  const lista = document.getElementById("listaPendencias");

  if (!nome || !turno) {
    mostrarMensagem("Preencha seu nome e selecione o turno.");
    return;
  }

  area.classList.remove("escondido");
  lista.innerHTML = "<p>Carregando pendências...</p>";

  try {
    const resposta = await fetch(URL_API);

    if (!resposta.ok) {
      throw new Error("Não foi possível acessar o Apps Script.");
    }

    const dados = await resposta.json();

    if (dados.erro) {
      throw new Error(dados.mensagem);
    }

    if (!Array.isArray(dados) || dados.length === 0) {
      lista.innerHTML = "<p>Nenhuma pendência encontrada.</p>";
      return;
    }

    lista.innerHTML = dados.map(item => {
      const valores = Object.entries(item)
        .filter(([_, valor]) => String(valor).trim() !== "")
        .map(([campo, valor]) =>
          `<p><strong>${campo}:</strong> ${valor}</p>`
        )
        .join("");

      return `<div class="pendencia">${valores}</div>`;
    }).join("");

  } catch (erro) {
    console.error(erro);
    lista.innerHTML = `
      <p>Erro ao carregar as pendências.</p>
      <small>${erro.message}</small>
    `;
  }
}

function salvarProblema() {
  window.open(LINK_FORMULARIO, "_blank");
}

function confirmarRecebimento() {
  const confirmado =
    document.getElementById("confirmacaoRecebimento").checked;

  if (!confirmado) {
    mostrarMensagem("Marque a confirmação de recebimento.");
    return;
  }

  mostrarMensagem("Recebimento confirmado com sucesso!");
}

function mostrarMensagem(texto) {
  document.getElementById("mensagem").textContent = texto;
}