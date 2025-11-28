import { useState, useEffect, MouseEvent } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useProdutos } from '../hooks/useProdutos'; // ✅ IMPORTAR HOOK

interface ProdutoData {
  idProduto: number;
  nomeProduto: string;
  pesoEntrada: number;
  pesoSaida: number;
}

export default function Produtos() {
  // ✅ USAR HOOK EM VEZ DE useState
  const { produtos, loading, error, carregarProdutos, adicionarProduto, atualizarProduto, deletarProduto } = useProdutos();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ProdutoData | null>(null);
  const [formData, setFormData] = useState<Partial<ProdutoData>>({});

  // ✅ CARREGAR PRODUTOS AO INICIAR
  useEffect(() => {
    carregarProdutos();
  }, []);

  // ✅ FILTRAR DADOS REAIS
  const filteredData = produtos.filter((item: any) => {
    // Cast para garantir tipagem
    const p = item as ProdutoData;
    return Object.values(p).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      const success = await deletarProduto(id);
      if (success) {
        setSelectedRow(null);
        carregarProdutos(); // Recarrega a lista
      } else {
        alert('Erro ao deletar produto');
      }
    }
  };

  const handleEdit = (item: ProdutoData) => {
    setEditingItem(item);
    setFormData(item);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const handleSave = async () => {
    try {
      if (editingItem) {
        // ✅ EDITAR PRODUTO EXISTENTE
        const success = await atualizarProduto(editingItem.idProduto, formData as ProdutoData);
        if (success) {
          carregarProdutos(); // Recarrega a lista
        }
      } else {
        // ✅ ADICIONAR NOVO PRODUTO
        const success = await adicionarProduto(formData as Omit<ProdutoData, 'idProduto'>);
        if (success) {
          carregarProdutos(); // Recarrega a lista
        }
      }
      setShowForm(false);
      setFormData({});
    } catch (err) {
      alert('Erro ao salvar produto');
    }
  };

  // ✅ ADICIONAR FEEDBACK DE CARREGAMENTO E ERRO
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p>Carregando produtos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">
          <h3 className="font-bold text-lg">Erro ao Carregar Dados</h3>
          <p className="text-sm mt-2">Detalhe: {error}</p>
          <Button onClick={carregarProdutos} className="mt-4">Tentar Novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Produtos</h1>
        <p className="text-slate-600">Gerencie o catálogo de produtos da empresa</p>

        {/* ✅ MOSTRAR CONTADOR DE PRODUTOS REAIS */}
        <p className="text-sm text-slate-500 mt-2">
          {produtos.length} produto(s) cadastrado(s)
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" onClick={() => setShowAdvancedSearch(true)}>
          <Filter className="h-4 w-4 mr-2" />
          Busca Avançada
        </Button>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Novo
        </Button>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow key="header-row">
              <TableHead>ID</TableHead>
              <TableHead>Nome do Produto</TableHead>
              <TableHead>Peso Entrada (kg)</TableHead>
              <TableHead>Peso Saída (kg)</TableHead>
              <TableHead>Perda (%)</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 && (
              <TableRow key="empty-row">
                <TableCell colSpan={6} className="text-center text-slate-500 py-10">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
            {filteredData.map((item: any) => {
              const p = item as ProdutoData;
              // ✅ CORREÇÃO: Verificações de segurança para evitar crash com null/undefined
              // ✅ CORREÇÃO: Converter para Number antes de usar.
                            // O backend está retornando strings ("5.00"), o que causa erro no .toFixed()
                            const pEntrada = Number(p.pesoEntrada) || 0;
                            const pSaida = Number(p.pesoSaida) || 0;

              // Cálculo de perda seguro (evita divisão por zero)
              const perda = pEntrada > 0
                ? ((pEntrada - pSaida) / pEntrada * 100).toFixed(2)
                : "0.00";

              return (
                <TableRow
                  key={p.idProduto}
                  className={selectedRow === p.idProduto ? 'bg-slate-100' : 'hover:bg-slate-50'}
                  onClick={() => setSelectedRow(p.idProduto)}
                >
                  <TableCell className="font-medium">{p.idProduto}</TableCell>
                  <TableCell>{p.nomeProduto}</TableCell>

                  {/* ✅ CORREÇÃO: Formatação segura */}
                  <TableCell>
                    {pEntrada.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {pSaida.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    <span className={parseFloat(perda) > 10 ? "text-red-600 font-bold" : "text-green-600"}>
                      {perda}%
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e: MouseEvent) => { e.stopPropagation(); handleEdit(p); }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e: MouseEvent) => { e.stopPropagation(); handleDelete(p.idProduto); }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Advanced Search Dialog */}
      <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Busca Avançada - Produtos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID Produto</Label>
              <Input type="number" placeholder="Filtrar por ID" />
            </div>
            <div className="space-y-2">
              <Label>Nome do Produto</Label>
              <Input placeholder="Nome do produto" />
            </div>
            <div className="space-y-2">
              <Label>Peso Entrada Mínimo (kg)</Label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Peso Entrada Máximo (kg)</Label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Peso Saída Mínimo (kg)</Label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label>Peso Saída Máximo (kg)</Label>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvancedSearch(false)}>Cancelar</Button>
            <Button onClick={() => setShowAdvancedSearch(false)}>Buscar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar' : 'Adicionar'} Produto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Produto</Label>
              <Input
                placeholder="Nome do produto"
                value={formData.nomeProduto || ''}
                onChange={(e) => setFormData({ ...formData, nomeProduto: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Peso de Entrada (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pesoEntrada || ''}
                  onChange={(e) => setFormData({ ...formData, pesoEntrada: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label>Peso de Saída (kg)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pesoSaida || ''}
                  onChange={(e) => setFormData({ ...formData, pesoSaida: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}