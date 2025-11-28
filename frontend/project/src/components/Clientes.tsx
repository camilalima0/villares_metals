import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useClientes } from '../hooks/useClientes'; // ✅ IMPORTAR HOOK

interface ClienteData {
  idCliente: number;
  nomeCliente: string;
  cnpjCliente: string;
  telefoneCliente: string;
  emailCliente: string;
}

// ❌ REMOVER initialData - vamos usar dados do backend

export default function Clientes() {
  // ✅ USAR HOOK EM VEZ DE useState
  const { clientes, loading, error, carregarClientes, adicionarCliente, atualizarCliente, deletarCliente } = useClientes();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<ClienteData | null>(null);
  const [formData, setFormData] = useState<Partial<ClienteData>>({});

  // ✅ CARREGAR CLIENTES AO INICIAR
  useEffect(() => {
    carregarClientes();
  }, []);

  // ✅ FILTRAR DADOS REAIS
  const filteredData = clientes.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
      const success = await deletarCliente(id);
      if (success) {
        setSelectedRow(null);
        carregarClientes(); // Recarrega a lista
      } else {
        alert('Erro ao deletar cliente');
      }
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

  const handleSave = async () => {
    try {
      if (editingItem) {
        // ✅ EDITAR CLIENTE EXISTENTE
        const success = await atualizarCliente(editingItem.idCliente, formData as ClienteData);
        if (success) {
          carregarClientes(); // Recarrega a lista
        }
      } else {
        // ✅ ADICIONAR NOVO CLIENTE
        const success = await adicionarCliente(formData as ClienteData);
        if (success) {
          carregarClientes(); // Recarrega a lista
        }
      }
      setShowForm(false);
      setFormData({});
    } catch (err) {
      alert('Erro ao salvar cliente');
    }
  };

  // ✅ ADICIONAR FEEDBACK DE CARREGAMENTO E ERRO
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <p>Carregando clientes...</p>
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
        <h1 className="text-3xl mb-2">Clientes</h1>
        <p className="text-slate-600">Gerencie os clientes da empresa</p>

        {/* ✅ MOSTRAR CONTADOR DE CLIENTES REAIS */}
        <p className="text-sm text-slate-500 mt-2">
          {clientes.length} cliente(s) cadastrado(s)
        </p>
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
            <TableRow key="header-row">
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
                key={item.idCliente}
                className={selectedRow === item.idCliente ? 'bg-slate-50' : ''}
                onDoubleClick={() => setSelectedRow(item.idCliente)}
              >
                <TableCell>{item.idCliente}</TableCell>
                <TableCell>{item.nomeCliente}</TableCell>
                <TableCell>{item.cnpjCliente}</TableCell>
                <TableCell>{item.telefoneCliente}</TableCell>
                <TableCell>{item.emailCliente}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(item.idCliente)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* ... (restante do código permanece igual - Advanced Search Dialog e Form Dialog) ... */}
      {/* Advanced Search Dialog */}
      <Dialog open={showAdvancedSearch} onOpenChange={setShowAdvancedSearch}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Busca Avançada - Clientes</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ID Cliente</Label>
              <Input type="number" placeholder="Ex. 2" />
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input placeholder="Ex. Loja do João" />
            </div>
            <div className="space-y-2">
              <Label>CNPJ</Label>
              <Input placeholder="Ex. 04.036.070/0001-37" />
            </div>
            <div className="space-y-2">
              <Label>Telefone</Label>
              <Input placeholder="Ex. (19) 98716-6891" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input placeholder="Ex. joão@loja.com" />
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
              <Label>Nome</Label>
              <Input placeholder="Ex. Loja do João"
                value={formData.nomeCliente || ''}
                onChange={(e) => setFormData({ ...formData, nomeCliente: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input placeholder="Ex. 04.036.070/0001-37"
                  value={formData.cnpjCliente || ''}
                  onChange={(e) => setFormData({ ...formData, cnpjCliente: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input placeholder="Ex. (19) 98716-6891"
                  value={formData.telefoneCliente || ''}
                  onChange={(e) => setFormData({ ...formData, telefoneCliente: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input placeholder="Ex. joão@loja.com"
                  value={formData.emailCliente || ''}
                  onChange={(e) => setFormData({ ...formData, emailCliente: e.target.value })}
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