import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { login, loading, error } = useAuth();

  useEffect(() => {
    console.log('🔍 [App] Verificando usuário no localStorage...');

    // --- CORREÇÃO DA LÓGICA DE INICIALIZAÇÃO ---
    // O que REALMENTE importa é o token de autenticação (authBasic),
    // não apenas o nome do usuário.
    const authHash = localStorage.getItem('authBasic');
    const user = localStorage.getItem('currentUser');

    if (authHash && user) {
      console.log('✅ [App] Token de autenticação e usuário encontrados:', user);
      setIsAuthenticated(true);
      setCurrentUser(user);
    } else {
      console.log('ℹ️ [App] Nenhum token de autenticação ou usuário encontrado.');
      // Limpa tudo por segurança, caso um esteja faltando
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authBasic');
    }
    // ------------------------------------------
  }, []);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    console.log('🚀 [App] Iniciando processo de login...', { username });

    const success = await login(username, password); // Supondo que useAuth.ts faz o fetch
    if (success) {
      console.log('🎉 [App] Login bem-sucedido! Atualizando estado...');
      setIsAuthenticated(true);
      setCurrentUser(username);
      localStorage.setItem('currentUser', username);

      // --- CORREÇÃO ADICIONADA AQUI ---
      // O hook useOrdensServico DEPENDE deste item para autenticar
      const credentials = `${username}:${password}`;
      const encodedCredentials = btoa(credentials);
      localStorage.setItem('authBasic', encodedCredentials);

      return true;
    } else {
      console.log('❌ [App] Falha no login');
      return false;
    }
  };

  const handleLogout = () => {
    console.log('👋 [App] Fazendo logout...');
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    // CORREÇÃO: Limpar o hash de autenticação
    localStorage.removeItem('authBasic');
  };

  console.log('🔄 [App] Renderizando - isAuthenticated:', isAuthenticated, 'currentUser:', currentUser);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
}