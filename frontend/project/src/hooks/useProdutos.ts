import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/produtos';

interface ProdutoData {
  id_produto: number;
  nome_produto: string;
  peso_entrada: number;
  peso_saida: number;
}

export const useProdutos = () => {
  const [produtos, setProdutos] = useState<ProdutoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarProdutos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
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

  const adicionarProduto = async (produto: Omit<ProdutoData, 'id_produto'>): Promise<boolean> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        headers: {
          'Content-Type': 'application/json',
        },
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