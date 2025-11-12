import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search, Plus, Edit, Trash2, Filter } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';

interface OrdemServicoData {
  n_os: number;
  data_entrega: string;
  data_aprovacao: string;
  status_pagamento: boolean;
  status_producao: 'FILA' | 'PRODUCAO' | 'PRONTO';
  valor_servico: number;
  descricao_pedido: string;
  id_cliente: number;
  nome_cliente: string;
}

// Mock data
const initialData: OrdemServicoData[] = [
  {
    n_os: 1,
    data_entrega: '2025-12-01',
    data_aprovacao: '2025-11-10 10:30:00',
    status_pagamento: true,
    status_producao: 'PRODUCAO',
    valor_servico: 15000.00,
    descricao_pedido: 'Peças metálicas especiais - lote 100 unidades',
    id_cliente: 1,
    nome_cliente: 'Industria ABC Ltda'
  },
  {
    n_os: 2,
    data_entrega: '2025-11-25',
    data_aprovacao: '2025-11-08 14:20:00',
    status_pagamento: false,
    status_producao: 'FILA',
    valor_servico: 8500.00,
    descricao_pedido: 'Componentes automotivos',
    id_cliente: 2,
    nome_cliente: 'Auto Parts S.A.'
  }
];

export default function OrdemServico() {
  const [data, setData] = useState<OrdemServicoData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<OrdemServicoData | null>(null);
  const [formData, setFormData] = useState<Partial<OrdemServicoData>>({});

  const filteredData = data.filter(item =>
    Object.values(item).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleDelete = (n_os: number) => {
    if (confirm('Tem certeza que deseja deletar esta ordem de serviço?')) {
      setData(data.filter(item => item.n_os !== n_os));
      setSelectedRow(null);
    }
  };

  const handleEdit = (item: OrdemServicoData) => {
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
      setData(data.map(item => item.n_os === editingItem.n_os ? { ...item, ...formData } as OrdemServicoData : item));
    } else {
      const newItem = {
        ...formData,
        n_os: Math.max(...data.map(d => d.n_os), 0) + 1,
        data_aprovacao: new Date().toISOString(),
      } as OrdemServicoData;
      setData([...data, newItem]);
    }
    setShowForm(false);
    setFormData({});
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl mb-2">Ordens de Serviço</h1>
        <p className="text-slate-600">Gerencie todas as ordens de serviço da empresa</p>
      </div>

      {/* Search and Actions */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Buscar ordens de serviço..."
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

      {/* Table */}
      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nº OS</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data Entrega</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status Produção</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow
                key={item.n_os}
                className={selectedRow === item.n_os ? 'bg-slate-50' : ''}
                onDoubleClick={() => setSelectedRow(item.n_os)}
              >
                <TableCell>{item.n_os}</TableCell>
                <TableCell>{item.nome_cliente}</TableCell>
                <TableCell>{new Date(item.data_entrega).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>R$ {item.valor_servico.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.status_producao === 'PRONTO' ? 'default' :
                    item.status_producao === 'PRODUCAO' ? 'secondary' : 'outline'
                  }>
                    {item.status_producao}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.status_pagamento ? 'default' : 'destructive'}>
                    {item.status_pagamento ? 'Pago' : 'Pendente'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(item.n_os)}
                    >
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
            <DialogTitle>Busca Avançada - Ordens de Serviço</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número OS</Label>
              <Input type="number" placeholder="Filtrar por número" />
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input placeholder="Nome do cliente" />
            </div>
            <div className="space-y-2">
              <Label>Data Entrega (De)</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Data Entrega (Até)</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Status Produção</Label>
              <Select>
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
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Pago</SelectItem>
                  <SelectItem value="false">Pendente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Valor Mínimo</Label>
              <Input type="number" placeholder="R$ 0,00" />
            </div>
            <div className="space-y-2">
              <Label>Valor Máximo</Label>
              <Input type="number" placeholder="R$ 0,00" />
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingItem ? 'Editar' : 'Adicionar'} Ordem de Serviço</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input
                placeholder="Nome do cliente"
                value={formData.nome_cliente || ''}
                onChange={(e) => setFormData({ ...formData, nome_cliente: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Entrega</Label>
              <Input
                type="date"
                value={formData.data_entrega || ''}
                onChange={(e) => setFormData({ ...formData, data_entrega: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Valor do Serviço</Label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.valor_servico || ''}
                onChange={(e) => setFormData({ ...formData, valor_servico: parseFloat(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Status Produção</Label>
              <Select
                value={formData.status_producao}
                onValueChange={(value: any) => setFormData({ ...formData, status_producao: value })}
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
                value={formData.status_pagamento?.toString()}
                onValueChange={(value) => setFormData({ ...formData, status_pagamento: value === 'true' })}
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
                value={formData.descricao_pedido || ''}
                onChange={(e) => setFormData({ ...formData, descricao_pedido: e.target.value })}
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
