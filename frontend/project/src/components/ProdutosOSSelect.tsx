import { useState, useEffect, useRef } from 'react';
import { Plus, Search, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useProdutos } from '../hooks/useProdutos';

// Interface do Produto vindo da API
interface Produto {
    idProduto: number;
    nomeProduto: string;
}

// Interface do Item na OS (Produto + Quantidade)
export interface ItemPedido {
    produto: Produto;
    quantidade: number;
}

interface ProdutosOSSelectProps {
    itens: ItemPedido[];
    onChange: (itens: ItemPedido[]) => void;
    onAddNew?: () => void;
}

export function ProdutosOSSelect({ itens, onChange, onAddNew }: ProdutosOSSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { produtos, carregarProdutos } = useProdutos();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Carrega produtos ao abrir o dropdown
    useEffect(() => {
        if (open && produtos.length === 0) {
            carregarProdutos();
        }
    }, [open]);

    // Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const filteredProdutos = produtos.filter((p: any) =>
        p.nomeProduto.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduto = (produto: Produto) => {
        // Verifica se já existe
        const existe = itens.find(i => i.produto.idProduto === produto.idProduto);
        if (existe) {
            // Se existe, incrementa quantidade
            handleUpdateQuantidade(produto.idProduto, existe.quantidade + 1);
        } else {
            // Se não, adiciona novo com qtd 1
            onChange([...itens, { produto, quantidade: 1 }]);
        }
        setOpen(false);
        setSearchTerm('');
    };

    const handleRemoveProduto = (idProduto: number) => {
        onChange(itens.filter(i => i.produto.idProduto !== idProduto));
    };

    const handleUpdateQuantidade = (idProduto: number, novaQtd: number) => {
        if (novaQtd < 1) return;
        onChange(itens.map(i =>
            i.produto.idProduto === idProduto ? { ...i, quantidade: novaQtd } : i
        ));
    };

    return (
        <div className="space-y-3">
            {/* Botão para abrir busca de produtos */}
            <div className="relative" ref={wrapperRef}>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setOpen(!open)}
                >
                    <span>Adicionar Produto...</span>
                    <Plus className="h-4 w-4 opacity-50" />
                </Button>

                {open && (
                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white text-slate-950 shadow-md">
                        <div className="sticky top-0 bg-white p-2 border-b border-slate-100">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                                <Input
                                    placeholder="Buscar produto..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8 border-0 focus-visible:ring-0 bg-slate-50"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="p-1">
                            {filteredProdutos.length === 0 ? (
                                <div className="py-4 text-center text-sm text-slate-500">
                                    <p className="mb-2">Nenhum produto encontrado.</p>
                                    {/* ✅ Botão Adicionar Novo Produto */}
                                    {onAddNew && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e: any) => {
                                                e.stopPropagation();
                                                onAddNew();
                                                setOpen(false);
                                            }}
                                            className="w-full border-dashed"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Cadastrar Novo Produto
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                filteredProdutos.map((produto: any) => (
                                    <div
                                        key={produto.idProduto}
                                        className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-slate-100"
                                        onClick={() => handleAddProduto(produto as Produto)}
                                    >
                                        <span>{produto.nomeProduto}</span>
                                        <Plus className="h-4 w-4 opacity-50" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Lista de Produtos Selecionados */}
            {itens.length > 0 && (
                <div className="rounded-md border max-h-[250px] overflow-y-auto">
                    <Table>
                        <TableHeader className="bg-slate-50 sticky top-0">
                            <TableRow>
                                <TableHead>Produto</TableHead>
                                <TableHead className="w-[100px]">Qtd</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {itens.map((item) => (
                                <TableRow key={item.produto.idProduto}>
                                    <TableCell className="font-medium">{item.produto.nomeProduto}</TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            min="1"
                                            className="h-8 w-20"
                                            value={item.quantidade}
                                            onChange={(e) => handleUpdateQuantidade(item.produto.idProduto, parseInt(e.target.value) || 1)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveProduto(item.produto.idProduto)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}