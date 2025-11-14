// hooks/useClientes.ts - VERSÃO COMPLETA
import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/clientes';

interface ClienteData {
  id_cliente: number;
  nome_cliente: string;
  cnpj_cliente: string;
  telefone_cliente: string;
  email_cliente: string;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const dados = await response.json();
        setClientes(dados);
      } else {
        setError('Erro ao carregar clientes');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const adicionarCliente = async (cliente: Omit<ClienteData, 'id_cliente'>): Promise<boolean> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      
      return response.ok;
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err);
      return false;
    }
  };

  const atualizarCliente = async (id: number, cliente: ClienteData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cliente),
      });
      
      return response.ok;
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      return false;
    }
  };

  const deletarCliente = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      return false;
    }
  };

  return { 
    clientes, 
    loading, 
    error, 
    carregarClientes,
    adicionarCliente,
    atualizarCliente,
    deletarCliente
  };
};