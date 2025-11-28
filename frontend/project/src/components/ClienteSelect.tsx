import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Plus, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useClientes } from '../hooks/useClientes';

interface Cliente {
    idCliente: number;
    nomeCliente: string;
    cnpjCliente: string;
    telefoneCliente: string;
    emailCliente: string;
}

interface ClienteSelectProps {
    value?: { idCliente: number; nomeCliente: string };
    onChange: (cliente: Cliente | null) => void;
    onAddNew?: () => void; // Callback para quando clicar em "Adicionar Novo"
}

export function ClienteSelect({ value, onChange, onAddNew }: ClienteSelectProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const { clientes, carregarClientes, loading } = useClientes();
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Carrega clientes ao montar (ou foca em buscar sob demanda)
    useEffect(() => {
        if (open && clientes.length === 0) {
            carregarClientes();
        }
    }, [open]);

    // Fecha o dropdown ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Filtra clientes baseado na busca (nome, cnpj, telefone, email)
    const filteredClientes = clientes.filter((cliente: any) => {
        const c = cliente as Cliente;
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            c.nomeCliente?.toLowerCase().includes(search) ||
            c.cnpjCliente?.includes(search) ||
            c.telefoneCliente?.includes(search) ||
            c.emailCliente?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <span className={!value ? "text-slate-500" : ""}>
                    {value ? value.nomeCliente : "Selecione um cliente..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </div>

            {open && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white text-slate-950 shadow-md">
                    <div className="sticky top-0 bg-white p-2 border-b border-slate-100">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                placeholder="Buscar (Nome, CNPJ, Tel...)"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 border-0 focus-visible:ring-0 bg-slate-50"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="p-1">
                        {loading ? (
                            <div className="py-2 text-center text-sm text-slate-500">Carregando...</div>
                        ) : filteredClientes.length === 0 ? (
                            <div className="py-4 text-center text-sm text-slate-500">
                                <p className="mb-2">Nenhum cliente encontrado.</p>
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
                                        Adicionar Novo Cliente
                                    </Button>
                                )}
                            </div>
                        ) : (
                            filteredClientes.map((cliente: any) => {
                                const c = cliente as Cliente;
                                return (

                                    <div
                                        key={c.idCliente}
                                        className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-slate-100 hover:text-slate-900 ${value?.idCliente === cliente.idCliente ? "bg-slate-100" : ""
                                            }`}
                                        onClick={() => {
                                            onChange(c); // Passa o objeto cliente completo ou mapeia conforme necessário
                                            setOpen(false);
                                            setSearchTerm('');
                                        }}
                                    >
                                        <div className="flex flex-col items-start">
                                            <span>{c.nomeCliente}</span>
                                            <span className="text-xs text-slate-500">
                                                CNPJ: {c.cnpjCliente} | Tel: {c.telefoneCliente}
                                            </span>
                                        </div>
                                        {value?.idCliente === c.idCliente && (
                                            <Check className="ml-auto h-4 w-4 opacity-50" />
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}