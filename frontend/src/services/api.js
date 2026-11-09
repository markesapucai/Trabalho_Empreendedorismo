/**
 * Cliente HTTP centralizado para comunicação com a API do EcoObra.
 * Respeita os contratos, métodos e códigos HTTP do backend Spring Boot.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * Função utilitária genérica para chamadas HTTP
 */
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Tratamento para respostas sem conteúdo
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      // Com o backend desligado, o proxy do Vite responde 500/502/504 com corpo vazio.
      // Isso NÃO é um erro da API: tratamos como falha de conexão.
      if (response.status >= 500 && (data === '' || data == null)) {
        const netErr = new Error('offline');
        netErr.isNetworkError = true;
        throw netErr;
      }
      const errorMessage = data?.message || (typeof data === 'string' && data) || `Erro HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // Se for erro de rede (backend fora do ar)
    if (!error.status || error.isNetworkError) {
      error.isNetworkError = true;
      error.status = undefined;
      error.message = 'Não foi possível conectar ao servidor backend (porta 8080). Verifique se a aplicação Spring Boot está em execução.';
    }
    throw error;
  }
}

/**
 * Verifica o status de conectividade com o backend
 */
export async function checkBackendHealth() {
  try {
    // Testa o endpoint de locais de descarte como indicador de saúde
    await apiRequest('/api/locais-descarte', { method: 'GET' });
    return { online: true, message: 'Backend conectado com sucesso' };
  } catch (err) {
    if (err.isNetworkError) {
      return { online: false, message: 'Backend offline ou inacessível em localhost:8080' };
    }
    // Se respondeu mesmo que com 404/500, o servidor está online
    return { online: true, message: `Backend online (Status: ${err.status})` };
  }
}
