import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';

interface ClienteData {
  id_cliente: number;
  nome_cliente: string;
  cnpj_cliente: string;
  telefone_cliente: string;
  email_cliente: string;
}

const initialData: ClienteData[] = [
  {
    id_cliente: 1,
    nome_cliente: 'Industria ABC Ltda',
    cnpj_cliente: '12.345.678/0001-90',
    telefone_cliente: '(11) 98765-4321',
    email_cliente: 'contato@industriaabc.com.br'
  },
  {
    id_cliente: 2,
    nome_cliente: 'Auto Parts S.A.',
    cnpj_cliente: '98.765.432/0001-10',
    telefone_cliente: '(11) 91234-5678',
    email_cliente: 'compras@autoparts.com.br'
  },
  {
    id_cliente: 3,
    nome_cliente: 'Metalúrgica XYZ',
    cnpj_cliente: '45.678.901/0001-23',
    telefone_cliente: '(11) 97777-8888',
    email_cliente: 'pedidos@metalurgicaxyz.com.br'
  },
];

export default function Clientes() {
  const [data, setData] = useState<ClienteData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ClienteData | null>(null);
  const [formData, setFormData] = useState<Partial<ClienteData>>({});

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      setData(data.filter(item => item.id_cliente !== id));
      setSelectedRow(null);
    }
  };

  const handleEdit = (item: ClienteData) => {
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
      setData(data.map(item => item.id_cliente === editingItem.id_cliente ? { ...item, ...formData } as ClienteData : item));
    } else {
      const newItem = {
        ...formData,
        id_cliente: Math.max(...data.map(d => d.id_cliente), 0) + 1,
      } as ClienteData;
      setData([...data, newItem]);
    }
    setShowForm(false);
    setFormData({});
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Clientes</h1>
        <p className="text-slate-600">Gerencie os clientes da empresa</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar clientes..."
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
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.id_cliente}
                className={selectedRow === item.id_cliente ? 'bg-slate-50' : ''}
                onDoubleClick={() => setSelectedRow(item.id_cliente)}
              >
                <TableCell>{item.id_cliente}</TableCell>
                <TableCell>{item.nome_cliente}</TableCell>
                <TableCell>{item.cnpj_cliente}</TableCell>
                <TableCell>{item.telefone_cliente}</TableCell>
                <TableCell>{item.email_cliente}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.id_cliente)}>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Busca Avançada - Clientes</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID Cliente</Label>
              <Input type="number" placeholder="Filtrar por ID" />
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input placeholder="00.000.000/0000-00" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="(00) 00000-0000" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Email</Label>
              <Input type="email" placeholder="email@exemplo.com" />
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
            <DialogTitle>{editingItem ? 'Editar' : 'Adicionar'} Cliente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Cliente</Label>
              <Input
                placeholder="Razão social"
                value={formData.nome_cliente || ''}
                onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input
                placeholder="00.000.000/0000-00"
                value={formData.cnpj_cliente || ''}
                onChange={(e) => setFormData({ ...formData, cnpj_cliente: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input
                placeholder="(00) 00000-0000"
                value={formData.telefone_cliente || ''}
                onChange={(e) => setFormData({ ...formData, telefone_cliente: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email_cliente || ''}
                onChange={(e) => setFormData({ ...formData, email_cliente: e.target.value })}
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
