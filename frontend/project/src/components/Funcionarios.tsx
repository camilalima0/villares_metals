import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';

interface FuncionarioData {
  id_funcionario: number;
  username: string;
  senha_hash: string;
}

const initialData: FuncionarioData[] = [
  { id_funcionario: 1, username: 'admin', senha_hash: '****' },
  { id_funcionario: 2, username: 'joao.silva', senha_hash: '****' },
  { id_funcionario: 3, username: 'maria.santos', senha_hash: '****' },
];

export default function Funcionarios() {
  const [data, setData] = useState<FuncionarioData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FuncionarioData | null>(null);
  const [formData, setFormData] = useState<Partial<FuncionarioData>>({});

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar este funcionário?')) {
      setData(data.filter(item => item.id_funcionario !== id));
      setSelectedRow(null);
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

  const handleSave = () => {
    if (editingItem) {
      setData(data.map(item => item.id_funcionario === editingItem.id_funcionario ? { ...item, ...formData } as FuncionarioData : item));
    } else {
      const newItem = {
        ...formData,
        id_funcionario: Math.max(...data.map(d => d.id_funcionario), 0) + 1,
        senha_hash: '****', // In real app, this would be hashed
      } as FuncionarioData;
      setData([...data, newItem]);
    }
    setShowForm(false);
    setFormData({});
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Funcionários</h1>
        <p className="text-slate-600">Gerencie os funcionários e seus acessos ao sistema</p>
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
                <TableCell>{item.username}</TableCell>
                <TableCell>{item.senha_hash}</TableCell>
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
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Senha</Label>
              <Input
                type="password"
                placeholder="Digite a senha"
                value={formData.senha_hash || ''}
                onChange={(e) => setFormData({ ...formData, senha_hash: e.target.value })}
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
