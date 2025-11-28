import { useState } from 'react';
import { Button } from './ui/button';
import { Factory, LogOut, FileText, Package, Users, UserCog, BarChart3 } from 'lucide-react';
import OrdemServico from './OrdemServico';
import Produtos from './Produtos';
import Clientes from './Clientes';
import Funcionarios from './Funcionarios';

interface DashboardProps {
  currentUser: string | null;
  onLogout: () => void;
}

type Page = 'ordens' | 'produtos' | 'clientes' | 'funcionarios' | 'desempenho';

export default function Dashboard({ currentUser, onLogout }: DashboardProps) {
  const [currentPage, setCurrentPage] = useState<Page>('ordens');

  const menuItems = [
    { id: 'ordens' as Page, label: 'Ordem de Serviço', icon: FileText },
    { id: 'produtos' as Page, label: 'Produtos', icon: Package },
    { id: 'clientes' as Page, label: 'Clientes', icon: Users },
    { id: 'funcionarios' as Page, label: 'Funcionários', icon: UserCog },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'ordens':
        return <OrdemServico />;
      case 'produtos':
        return <Produtos />;
      case 'clientes':
        return <Clientes />;
      case 'funcionarios':
        return <Funcionarios />;
      default:
        return <OrdemServico />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Factory className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-sm">Villares Metals</div>
              <div className="text-xs text-slate-400">Sistema de Gestão</div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <div className="text-slate-400">Logado como</div>
              <div>{currentUser}</div>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
