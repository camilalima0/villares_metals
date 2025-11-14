import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useProdutos } from '../hooks/useProdutos'; // ✅ IMPORTAR HOOK

interface ProdutoData {
  id_produto: number;
  nome_produto: string;
  peso_entrada: number;
  peso_saida: number;
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
  const filteredData = produtos.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
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
        const success = await atualizarProduto(editingItem.id_produto, formData as ProdutoData);
        if (success) {
          carregarProdutos(); // Recarrega a lista
        }
      } else {
        // ✅ ADICIONAR NOVO PRODUTO
        const success = await adicionarProduto(formData as Omit<ProdutoData, 'id_produto'>);
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
        <div className="text-red-500 bg-red-100 p-4 rounded-lg">
          Erro: {error}
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
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nome do Produto</TableHead>
              <TableHead>Peso Entrada (kg)</TableHead>
              <TableHead>Peso Saída (kg)</TableHead>
              <TableHead>Perda (%)</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => {
              const perda = ((item.peso_entrada - item.peso_saida) / item.peso_entrada * 100).toFixed(2);
              return (
                <TableRow
                  key={item.id_produto}
                  className={selectedRow === item.id_produto ? 'bg-slate-50' : ''}
                  onDoubleClick={() => setSelectedRow(item.id_produto)}
                >
                  <TableCell>{item.id_produto}</TableCell>
                  <TableCell>{item.nome_produto}</TableCell>
                  <TableCell>{item.peso_entrada.toFixed(2)}</TableCell>
                  <TableCell>{item.peso_saida.toFixed(2)}</TableCell>
                  <TableCell>{perda}%</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id_produto)}>
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
                value={formData.nome_produto || ''}
                onChange={(e) => setFormData({ ...formData, nome_produto: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Peso de Entrada (kg)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.peso_entrada || ''}
                onChange={(e) => setFormData({ ...formData, peso_entrada: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Peso de Saída (kg)</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.peso_saida || ''}
                onChange={(e) => setFormData({ ...formData, peso_saida: parseFloat(e.target.value) })}
              />
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