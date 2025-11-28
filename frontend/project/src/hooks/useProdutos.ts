import { useState } from 'react';
import { getAuthHeader } from './utils.ts';

const API_BASE_URL = 'http://localhost:8080/produtos';

interface ProdutoData {
  idProduto: number;
  nomeProduto: string;
  pesoEntrada: number;
  pesoSaida: number;
}

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<ProdutoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      // 2. USE A FUNÇÃO HELPER EM TODAS AS CHAMADAS 'fetch'
      const response = await fetch(API_BASE_URL, {
        headers: getAuthHeader()
      });
      if (response.ok) {
        const dados = await response.json();
        setProdutos(dados);
      } else {
        setError('Erro ao carregar produtos');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const adicionarProduto = async (produto: Omit<ProdutoData, 'idProduto'>): Promise<boolean> => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getAuthHeader(),
        method: 'POST',
        body: JSON.stringify(produto),
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao adicionar produto:', err);
      return false;
    }
  };

  const atualizarProduto = async (id: number, produto: ProdutoData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify(produto),
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      return false;
    }
  };

  const deletarProduto = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: getAuthHeader(),
        method: 'DELETE',
      });

      return response.ok;
    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      return false;
    }
  };

  return {
    produtos,
    loading,
    error,
    carregarProdutos,
    adicionarProduto,
    atualizarProduto,
    deletarProduto
  };
};