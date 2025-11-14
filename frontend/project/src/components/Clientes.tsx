import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { useClientes } from '../hooks/useClientes'; // ✅ IMPORTAR HOOK

interface ClienteData {
  id_cliente: number;
  nome_cliente: string;
  cnpj_cliente: string;
  telefone_cliente: string;
  email_cliente: string;
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
        const success = await atualizarCliente(editingItem.id_cliente, formData as ClienteData);
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

      {/* ... (restante do código permanece igual - Advanced Search Dialog e Form Dialog) ... */}
    </div>
  );
}