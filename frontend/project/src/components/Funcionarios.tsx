import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useFuncionarios } from '../hooks/useFuncionarios';

// ✅ INTERFACE CORRIGIDA - Campos da sua API
interface FuncionarioData {
  id_funcionario: number;
  userFuncionario: string;  // ✅ Campo correto da sua API
  senhaFuncionario: string; // ✅ Campo correto da sua API
}

export default function Funcionarios() {
  const { funcionarios, loading, error, carregarFuncionarios, adicionarFuncionario, atualizarFuncionario, deletarFuncionario } = useFuncionarios();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FuncionarioData | null>(null);
  const [formData, setFormData] = useState<Partial<FuncionarioData>>({});

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const filteredData = funcionarios.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      const success = await deletarFuncionario(id);
      if (success) {
        setSelectedRow(null);
        carregarFuncionarios();
      } else {
        alert('Erro ao deletar funcionário');
      }
    }
  };

  const handleEdit = (item: FuncionarioData) => {
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
        const success = await atualizarFuncionario(editingItem.id_funcionario, formData as FuncionarioData);
        if (success) {
          carregarFuncionarios();
        }
      } else {
        const success = await adicionarFuncionario(formData as Omit<FuncionarioData, 'id_funcionario'>);
        if (success) {
          carregarFuncionarios();
        }
      }
      setShowForm(false);
      setFormData({});
    } catch (err) {
      alert('Erro ao salvar funcionário');
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p>Carregando funcionários...</p>
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
        <h1 className="text-3xl mb-2">Funcionários</h1>
        <p className="text-slate-600">Gerencie os funcionários e seus acessos ao sistema</p>
        <p className="text-sm text-slate-500 mt-2">
          {funcionarios.length} funcionário(s) cadastrado(s)
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar funcionários..."
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
              <TableHead>Username</TableHead>
              <TableHead>Senha</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id_funcionario}
                className={selectedRow === item.id_funcionario ? 'bg-slate-50' : ''}
                onDoubleClick={() => setSelectedRow(item.id_funcionario)}
              >
                <TableCell>{item.id_funcionario}</TableCell>
                <TableCell>{item.userFuncionario}</TableCell>
                <TableCell>{item.senhaFuncionario}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id_funcionario)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Advanced Search Dialog */}
      <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Busca Avançada - Funcionários</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>ID Funcionário</Label>
              <Input type="number" placeholder="Filtrar por ID" />
            </div>
            <div className="space-y-2">
              <Label>Username</Label>
              <Input placeholder="Nome de usuário" />
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
            <DialogTitle>{editingItem ? 'Editar' : 'Adicionar'} Funcionário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <Input
                placeholder="Nome de usuário"
                value={formData.userFuncionario || ''}
                onChange={(e) => setFormData({ ...formData, userFuncionario: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="Digite a senha"
                value={formData.senhaFuncionario || ''}
                onChange={(e) => setFormData({ ...formData, senhaFuncionario: e.target.value })}
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