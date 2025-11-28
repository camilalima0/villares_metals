import { useState, useEffect, MouseEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { useClientes } from '../hooks/useClientes';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { useOrdensServico, SearchFilters } from '../hooks/useOrdensServico';
import { ClienteSelect } from './ClienteSelect';
// Importa o componente de seleção de produtos e a interface ItemPedido
import { ProdutosOSSelect, ItemPedido } from './ProdutosOSSelect';

type StatusProducao = 'FILA' | 'PRODUCAO' | 'PRONTO';

// Interface para o Cliente (CamelCase - igual ao JSON)
interface Cliente {
  idCliente: number;
  nomeCliente: string;
  cnpjCliente: string;
  telefoneCliente: string;
  emailCliente: string;
}

// Interface para a OS (CamelCase - igual ao JSON)
interface OrdemServicoData {
  idOS: number;
  dataEntrega: string;
  dataAprovacao: string;
  statusPagamento: boolean;
  statusProducao: StatusProducao;
  valorServico: number;
  descricao: string;
  cliente: Cliente; // Objeto cliente aninhado
  // Adiciona a lista de itens do pedido na interface da OS
  itensDoPedido: ItemPedido[];
}

export default function OrdemServico() {
  // O hook deve retornar os dados. Se o hook ainda usar snake_case internamente,
  // o cast "as OrdemServicoData" ajuda o TypeScript a entender o formato novo.
  const { ordens, loading, error, carregarOrdens, buscarOrdensAvancada, adicionarOrdem, atualizarOrdem, deletarOrdem } = useOrdensServico();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<OrdemServicoData | null>(null);
  const [formData, setFormData] = useState<Partial<OrdemServicoData>>({});


  // Carrega a lista inicial ao montar o componente
  useEffect(() => {
    carregarOrdens();
  }, []);

  // Filtro atualizado para acessar as propriedades em CamelCase
  const filteredData = ordens.filter((item: any) => {
    const os = item as OrdemServicoData;
    const searchLower = searchTerm.toLowerCase();
    const clienteMatch = os.cliente?.nomeCliente?.toLowerCase().includes(searchLower);
    // Usa idOS (ou fallback para n_os se o hook for antigo)
    const idMatch = os.idOS?.toString().includes(searchLower);
    const statusMatch = os.statusProducao?.toLowerCase().includes(searchLower);

    return clienteMatch || idMatch || statusMatch;
  });

  // --- Funções de CRUD (Adicionar, Editar, Deletar) ---

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar esta ordem de serviço?')) {
      const success = await deletarOrdem(id);
      if (success) {
        setSelectedRow(null);
        carregarOrdens();
      } else {
        alert('Erro ao deletar ordem de serviço');
      }
    }
  };

  const handleEdit = (item: any) => {
    const os = item as OrdemServicoData;
    setEditingItem(os);
    // Formata data para YYYY-MM-DD
    const formattedItem = {
      ...os,
      dataEntrega: os.dataEntrega ? new Date(os.dataEntrega).toISOString().split('T')[0] : '',

      // Garante que itensDoPedido seja carregado ou inicializado como vazio
      itensDoPedido: os.itensDoPedido || []
    };
    setFormData(formattedItem);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      cliente: undefined,
      dataEntrega: '',
      valorServico: 0,
      statusProducao: 'FILA',
      statusPagamento: false,
      descricao: '',
      // Inicializa a lista de produtos vazia
      itensDoPedido: []
    });
    setShowForm(true);
  };

  // Recebe o cliente do componente ClienteSelect e atualiza o formData
  const handleClienteSelect = (clienteSelecionado: any) => {
    if (clienteSelecionado) {
      setFormData(prev => ({
        ...prev,
        cliente: clienteSelecionado
      }));
    } else {
      setFormData(prev => ({ ...prev, cliente: undefined }));
    }
  };

  // Handler para atualizar a lista de produtos no formulário
  const handleProdutosChange = (novosItens: ItemPedido[]) => {
    setFormData(prev => ({
      ...prev,
      itensDoPedido: novosItens
    }));
  };

  const handleNavigateToClientes = () => {
    alert("Por favor, vá até a aba 'Clientes' para cadastrar um novo cliente.");
    setShowForm(false);
  };

  // ✅ Esta é a função que o ProdutosOSSelect vai chamar
  const handleNavigateToProdutos = () => {
    alert("Por favor, vá até a aba 'Produtos' para cadastrar um novo item no catálogo.");
    // Se estivesse usando react-router: navigate('/produtos');
    setShowForm(false);
  };

  const handleFormChange = (field: keyof OrdemServicoData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleSave = async () => {
    try {
      if (!formData.cliente?.idCliente || !formData.dataEntrega || (formData.valorServico === undefined)) {
        alert("Cliente, Data de Entrega e Valor são obrigatórios.");
        return;
      }

      const dadosParaSalvar = { ...formData } as OrdemServicoData;

      if (editingItem) {
        // Garante o uso do ID correto
        const id = editingItem.idOS;
        const success = await atualizarOrdem(id, dadosParaSalvar);
        if (success) {
          carregarOrdens();
        }
      } else {
        // Remove ID para criação
        const { idOS, ...dadosSemId } = dadosParaSalvar;
        // Remove n_os se existir no objeto por compatibilidade
        const { n_os, ...dadosLimpos } = dadosSemId as any;

        const success = await adicionarOrdem(dadosLimpos);
        if (success) {
          carregarOrdens();
        }
      }
      setShowForm(false);
      setFormData({});
    } catch (err) {
      alert('Erro ao salvar ordem de serviço');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-[calc(100vh-100px)]">
        <p className="text-xl animate-pulse">Carregando ordens de serviço...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">
          <h3 className="font-bold text-lg">Erro ao Carregar Dados</h3>
          <p>Não foi possível carregar as ordens de serviço.</p>
          <p className="text-sm mt-2">Detalhe: {error}</p>
          <Button onClick={carregarOrdens} className="mt-4">Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Ordens de Serviço</h1>
        <p className="text-slate-600">Gerencie todas as ordens de serviço da empresa</p>
        <p className="text-sm text-slate-500 mt-2">
          {ordens.length} ordem(ns) de serviço cadastrada(s)
        </p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 relative min-w-[250px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar ordens de serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo
        </Button>
      </div>

      <div className="border rounded-lg bg-white overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow key="header-row">
              <TableHead>Nº OS</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data Entrega</TableHead>
              <TableHead>Data Aprovação</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status Produção</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 && (
              <TableRow key="empty-row">
                <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                  Nenhuma ordem de serviço encontrada.
                </TableCell>
              </TableRow>
            )}
            {filteredData.map((item: any) => {
              const os = item as OrdemServicoData;
              // Fallback para idOS ou n_os
              const id = os.idOS || (os as any).n_os;
              return (
                <TableRow
                  key={id}
                  className={selectedRow === id ? 'bg-slate-100' : 'hover:bg-slate-50'}
                  onClick={() => setSelectedRow(id)}
                >
                  <TableCell className="font-medium">{id}</TableCell>
                  <TableCell>{os.cliente?.nomeCliente || 'N/A'}</TableCell>

                  <TableCell>
                    {os.dataEntrega
                      ? new Date(os.dataEntrega).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : 'N/A'}
                  </TableCell>

                  <TableCell>
                    {os.dataAprovacao
                      ? new Date(os.dataAprovacao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })
                      : 'Pendente'}
                  </TableCell>

                  <TableCell>
                    {os.valorServico !== null && os.valorServico !== undefined
                      ? `R$ ${os.valorServico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                      : 'R$ 0,00'}
                  </TableCell>

                  <TableCell>
                    <Badge variant={
                      os.statusProducao === 'PRONTO' ? 'default' :
                        os.statusProducao === 'PRODUCAO' ? 'secondary' : 'outline'
                    } className="capitalize">
                      {os.statusProducao?.toLowerCase() || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={os.statusPagamento ? 'default' : 'destructive'}>
                      {os.statusPagamento ? 'Pago' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e: MouseEvent) => { e.stopPropagation(); handleEdit(os); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e: MouseEvent) => { e.stopPropagation(); handleDelete(id); }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="p-6 pb-4 border-b bg-white z-10">
            <DialogTitle>{editingItem ? 'Editar' : 'Adicionar'} Ordem de Serviço</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Cliente</Label>
                {/* Componente de Seleção Integrado */}
                <ClienteSelect
                  value={formData.cliente}
                  onChange={handleClienteSelect}
                  onAddNew={handleNavigateToClientes}
                />
              </div>
              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Input
                  type="date"
                  value={formData.dataEntrega || ''}
                  onChange={(e) => handleFormChange('dataEntrega', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Valor do Serviço</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.valorServico || ''}
                  onChange={(e) => handleFormChange('valorServico', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status Produção</Label>
                <Select
                  value={formData.statusProducao ?? 'FILA'}
                  onValueChange={(value: StatusProducao) => handleFormChange('statusProducao', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FILA">Fila</SelectItem>
                    <SelectItem value="PRODUCAO">Produção</SelectItem>
                    <SelectItem value="PRONTO">Pronto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status Pagamento</Label>
                <Select
                  value={formData.statusPagamento?.toString() ?? 'false'}
                  onValueChange={(value: string) => handleFormChange('statusPagamento', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Pago</SelectItem>
                    <SelectItem value="false">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Descrição do Pedido</Label>
                <Textarea
                  placeholder="Detalhes do pedido..."
                  value={formData.descricao || ''}
                  onChange={(e) => handleFormChange('descricao', e.target.value)}
                />
              </div>
              {/* ✅ NOVA SEÇÃO: Seleção de Produtos */}
              <div className="space-y-2 col-span-2 border-t pt-4 mt-2">
                <Label className="text-base font-semibold">Produtos da OS</Label>
                <p className="text-xs text-slate-500 mb-2">Adicione os produtos e quantidades relacionados a este serviço.</p>
                <ProdutosOSSelect
                  itens={formData.itensDoPedido || []}
                  onChange={handleProdutosChange}
                  onAddNew={handleNavigateToProdutos}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-4 border-t bg-white z-10 mt-auto">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}