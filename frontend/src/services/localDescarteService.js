import { apiRequest } from './api';

/**
 * Serviço de integração com o endpoint de Locais de Descarte Autorizados.
 * Controlador Backend: LocalDescarteController.java (/api/locais-descarte)
 */
export const localDescarteService = {
  /**
   * Lista todos os ecopontos e locais de descarte autorizados e ativos.
   * Endpoint: GET /api/locais-descarte
   * 
   * @returns {Promise<Array<{
   *   id: number,
   *   nome: string,
   *   descricao: string,
   *   endereco: string,
   *   bairro: string,
   *   cidade: string
   * }>>}
   */
  async listarAtivos() {
    return await apiRequest('/api/locais-descarte', {
      method: 'GET'
    });
  },

  /**
   * Obtém detalhes de um local de descarte autorizado por seu ID.
   * Endpoint: GET /api/locais-descarte/{id}
   * 
   * @param {number|string} id - Identificador do local
   * @returns {Promise<{
   *   id: number,
   *   nome: string,
   *   descricao: string,
   *   endereco: string,
   *   bairro: string,
   *   cidade: string
   * }>}
   */
  async buscarPorId(id) {
    if (!id) {
      throw new Error('ID do local de descarte é obrigatório.');
    }
    return await apiRequest(`/api/locais-descarte/${id}`, {
      method: 'GET'
    });
  }
};
