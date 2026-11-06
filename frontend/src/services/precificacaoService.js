import { apiRequest } from './api';

/**
 * Serviço de integração com o endpoint de Precificação.
 * Controlador Backend: PrecificacaoController.java (/api/precificacao)
 */
export const precificacaoService = {
  /**
   * Calcula o volume, a faixa e os valores da coleta com base no número de sacos.
   * Endpoint: POST /api/precificacao/calcular
   * Contrato DTO: { quantidadeSacos: Integer }
   * 
   * @param {number} quantidadeSacos - Quantidade de sacos de ráfia (entre 1 e 50)
   * @returns {Promise<{
   *   quantidadeSacos: number,
   *   volumeEstimado: number,
   *   faixaPreco: 'P' | 'M' | 'G',
   *   valorTotal: number,
   *   valorRepasse: number,
   *   taxaEcoObra: number
   * }>}
   */
  async calcularPreco(quantidadeSacos) {
    const sacosNum = Number(quantidadeSacos);
    
    // Validação preventiva no cliente respeitando a regra de negócio do backend
    if (!Number.isInteger(sacosNum) || sacosNum < 1 || sacosNum > 50) {
      throw new Error('A quantidade de sacos deve ser um número inteiro entre 1 e 50.');
    }

    return await apiRequest('/api/precificacao/calcular', {
      method: 'POST',
      body: JSON.stringify({ quantidadeSacos: sacosNum })
    });
  }
};
