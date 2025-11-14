import { useState } from 'react';

const API_BASE_URL = 'http://localhost:8080/funcionarios';

interface FuncionarioData {
  id_funcionario: number;
  userFuncionario: string;  // ✅ Campo correto
  senhaFuncionario: string; // ✅ Campo correto
}

export const useFuncionarios = () => {
  const [funcionarios, setFuncionarios] = useState<FuncionarioData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarFuncionarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL);
      if (response.ok) {
        const dados = await response.json();
        setFuncionarios(dados);
      } else {
        setError('Erro ao carregar funcionários');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const adicionarFuncionario = async (funcionario: Omit<FuncionarioData, 'id_funcionario'>): Promise<boolean> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(funcionario),
      });
      
      return response.ok;
    } catch (err) {
      console.error('Erro ao adicionar funcionário:', err);
      return false;
    }
  };

  const atualizarFuncionario = async (id: number, funcionario: FuncionarioData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(funcionario),
      });
      
      return response.ok;
    } catch (err) {
      console.error('Erro ao atualizar funcionário:', err);
      return false;
    }
  };

  const deletarFuncionario = async (id: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      
      return response.ok;
    } catch (err) {
      console.error('Erro ao deletar funcionário:', err);
      return false;
    }
  };

  return { 
    funcionarios, 
    loading, 
    error, 
    carregarFuncionarios,
    adicionarFuncionario,
    atualizarFuncionario,
    deletarFuncionario
  };
};