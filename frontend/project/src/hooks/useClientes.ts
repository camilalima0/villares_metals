// hooks/useClientes.ts - VERSÃO COMPLETA
import { useState } from 'react';
import { getAuthHeader } from './utils.ts';

const API_BASE_URL = 'http://localhost:8080/clientes';

interface ClienteData {
  idCliente: number;
  nomeCliente: string;
  cnpjCliente: string;
  telefoneCliente: string;
  emailCliente: string;
}

export const useClientes = () => {
  const [clientes, setClientes] = useState<ClienteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getAuthHeader(),
      });
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

  const adicionarCliente = async (cliente: Omit<ClienteData, 'idCliente'>): Promise<boolean> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeader(),
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
        headers: getAuthHeader(),
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
        headers: getAuthHeader(),
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