import { apiRequest } from './api';

/**
 * Serviço de integração com PedidoController.java (/api/pedidos).
 * Fluxo: criar (gerador) → aceitar (freteiro) → concluir (freteiro) → comprovante (gerador).
 */
export const pedidoService = {
  /** POST /api/pedidos */
  criar({ geradorId, quantidadeSacos, enderecoColeta, bairro, fotoEntulho }) {
    return apiRequest('/api/pedidos', {
      method: 'POST',
      body: JSON.stringify({ geradorId, quantidadeSacos: Number(quantidadeSacos), enderecoColeta, bairro, fotoEntulho })
    });
  },

  /** GET /api/pedidos/pendentes */
  pendentes() {
    return apiRequest('/api/pedidos/pendentes');
  },

  /** GET /api/pedidos/gerador/{geradorId} */
  doGerador(geradorId) {
    return apiRequest(`/api/pedidos/gerador/${geradorId}`);
  },

  /** GET /api/pedidos/freteiro/{freteiroId} */
  doFreteiro(freteiroId) {
    return apiRequest(`/api/pedidos/freteiro/${freteiroId}`);
  },

  /** GET /api/pedidos/{id} */
  buscar(id) {
    return apiRequest(`/api/pedidos/${id}`);
  },

  /** POST /api/pedidos/{id}/aceitar  { freteiroId } — 409 se outro freteiro já aceitou */
  aceitar(id, freteiroId) {
    return apiRequest(`/api/pedidos/${id}/aceitar`, {
      method: 'POST',
      body: JSON.stringify({ freteiroId })
    });
  },

  /** POST /api/pedidos/{id}/concluir  { freteiroId, localDescarteId, fotoDescarga } */
  concluir(id, { freteiroId, localDescarteId, fotoDescarga }) {
    return apiRequest(`/api/pedidos/${id}/concluir`, {
      method: 'POST',
      body: JSON.stringify({ freteiroId, localDescarteId: Number(localDescarteId), fotoDescarga })
    });
  },

  /** GET /api/pedidos/{id}/comprovante — 409 se ainda não foi concluído */
  comprovante(id) {
    return apiRequest(`/api/pedidos/${id}/comprovante`);
  }
};

/**
 * Lê uma imagem do input e devolve uma data URL JPEG reduzida (lado maior ≤ 1024px),
 * para não mandar fotos de vários MB do celular para a API.
 */
export function comprimirImagem(file, ladoMax = 1024, qualidade = 0.75) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Selecione um arquivo de imagem.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Não foi possível ler a imagem.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem não suportado.'));
      img.onload = () => {
        const escala = Math.min(1, ladoMax / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', qualidade));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export const formatarMoeda = (v) =>
  `R$ ${Number(v ?? 0).toFixed(2).replace('.', ',')}`;

export const formatarData = (iso) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

export const STATUS_LABEL = {
  PENDENTE: { texto: 'Aguardando freteiro', classe: 'badge-accent' },
  ACEITO: { texto: 'Freteiro a caminho', classe: 'badge-secondary' },
  CONCLUIDO: { texto: 'Concluído', classe: 'badge-primary' }
};
