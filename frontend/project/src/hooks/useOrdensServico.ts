import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/os';

// Helper function to get auth header
const getAuthHeader = (): Record<string, string> => {
  const encodedCredentials = localStorage.getItem('authBasic');
  if (encodedCredentials) {
    return {
      'Authorization': `Basic ${encodedCredentials}`,
      'Content-Type': 'application/json',
    };
  }
  return {
    'Content-Type': 'application/json',
  };
};

interface OrdemServicoData {
  n_os: number;
  data_entrega: string;
  data_aprovacao: string;
  status_pagamento: boolean;
  status_producao: 'FILA' | 'PRODUCAO' | 'PRONTO';
  valor_servico: number;
  descricao_pedido: string;
  id_cliente: number;
  nome_cliente: string;
}

export const useOrdensServico = () => {
  const [ordens, setOrdens] = useState<OrdemServicoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarOrdens = async () => {
    setLoading(true);
    setError(null);
    try {
      // CORREÇÃO: Adicionar o cabeçalho de autenticação
      const response = await fetch(API_BASE_URL, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const dados = await response.json();
        setOrdens(dados);
      } else {
        setError('Erro ao carregar ordens de serviço');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const adicionarOrdem = async (ordem: Omit<OrdemServicoData, 'n_os'>): Promise<boolean> => {
    try {
      // CORREÇÃO: Adicionar o cabeçalho de autenticação
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(ordem),
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao adicionar ordem de serviço:', err);
      return false;
    }
  };

  const atualizarOrdem = async (n_os: number, ordem: OrdemServicoData): Promise<boolean> => {
    try {
      // CORREÇÃO: Adicionar o cabeçalho de autenticação
      const response = await fetch(`${API_BASE_URL}/${n_os}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(ordem),
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao atualizar ordem de serviço:', err);
      return false;
    }
  };

  const deletarOrdem = async (n_os: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${n_os}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao deletar ordem de serviço:', err);
      return false;
    }
  };

  return {
    ordens,
    loading,
    error,
    carregarOrdens,
    adicionarOrdem,
    atualizarOrdem,
    deletarOrdem
  };
};