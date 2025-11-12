import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';

//useState: Estado do componente
//O React usa esses hooks para gerenciar dados que podem mudar ao longo do tempo.

//[isAuthenticated, ...]	
// O estado que guarda se o usuário está logado (false por padrão) e a função para alterá-lo.
//[currentUser, ...]	
// O estado que guarda o username do usuário logado (inicialmente null) e a função para alterá-lo.
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  //useEffect(() => { ... }, [])	
  // Este hook é executado apenas uma vez após a primeira renderização do componente 
  // (indicado pelo [] vazio), agindo como um inicializador.
  //localStorage.getItem('currentUser')	Tenta buscar o nome do usuário salvo no armazenamento 
  // local do navegador (onde dados persistem entre recarregamentos).
  //if (user) { ... }	Se um usuário for encontrado no localStorage, 
  // a aplicação assume que o usuário já está logado, restaurando o estado (setIsAuthenticated(true)).
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
    localStorage.setItem('currentUser', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard currentUser={currentUser} onLogout={handleLogout} />;
}
