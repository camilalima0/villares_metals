import { useState } from 'react';
import { getAuthHeader } from './utils.ts';

const API_BASE_URL = 'http://localhost:8080/os';

type StatusProducao = 'FILA' | 'PRODUCAO' | 'PRONTO';

// 1. Definir a interface do Cliente (para o objeto aninhado)
interface Cliente {
  idCliente: number;
  nomeCliente: string;
  cnpjCliente: string;
  telefoneCliente: string;
  emailCliente: string;
} 
interface OrdemServicoData {
  idOS: number;
  dataEntrega: string;
  dataAprovacao: string;
  statusPagamento: boolean;
  statusProducao: StatusProducao;
  valorServico: number;
  descricao: string;
  cliente: {
    idCliente: number;
    nomeCliente: string;
    cnpjCliente?: string;
  };
}

// Interface para os filtros de busca
export interface SearchFilters {
  idOS?: number;
  nomeCliente?: string;
  cnpjCliente?: string;
  dataAprovacao?: string;
  dataEntregaInicio?: string;
  dataEntregaFim?: string;
  valorMinimo?: number;
  valorMaximo?: number;
  statusPagamento?: string; // 'true', 'false' ou ''
  statusProducao?: string;
  descricao?: string;
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

  // ✅ NOVA FUNÇÃO: Realiza a busca avançada com filtros
  const buscarOrdensAvancada = async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Cria o objeto URLSearchParams para montar a query string (ex: ?valorMin=10&descricao=teste)
      const params = new URLSearchParams();

      // 2. Adiciona cada filtro apenas se ele tiver valor
      if (filters.dataAprovacao) params.append('dataAprovacao', filters.dataAprovacao);

      if (filters.idOS) params.append('idOS', filters.idOS.toString());

      if (filters.nomeCliente) params.append('nomeCliente', filters.nomeCliente);
      if (filters.cnpjCliente) params.append('cnpjCliente', filters.cnpjCliente);

      if (filters.dataEntregaInicio) params.append('dataEntregaInicio', filters.dataEntregaInicio);
      if (filters.dataEntregaFim) params.append('dataEntregaFim', filters.dataEntregaFim);

      if (filters.valorMinimo !== undefined && filters.valorMinimo > 0)
        params.append('valorMinimo', filters.valorMinimo.toString());

      if (filters.valorMaximo !== undefined && filters.valorMaximo > 0)
        params.append('valorMaximo', filters.valorMaximo.toString());

      // Tratamento especial para selects: ignorar se for 'TODOS' ou 'all'
      if (filters.statusPagamento && filters.statusPagamento !== 'TODOS' && filters.statusPagamento !== 'all')
        params.append('statusPagamento', filters.statusPagamento);

      if (filters.statusProducao && filters.statusProducao !== 'TODOS' && filters.statusProducao !== 'all')
        params.append('statusProducao', filters.statusProducao);

      if (filters.descricao) params.append('descricao', filters.descricao);

      // 3. Faz o fetch para a rota de busca
      const response = await fetch(`${API_BASE_URL}/busca?${params.toString()}`, {
        headers: getAuthHeader()
      });

      if (response.ok) {
        const dados = await response.json();
        setOrdens(dados); // Atualiza a lista principal com os resultados filtrados
      } else {
        setError('Erro na busca avançada');
      }
    } catch (err) {
      setError('Erro de conexão na busca');
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
    buscarOrdensAvancada,
    atualizarOrdem,
    deletarOrdem
  };
};