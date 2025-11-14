import { useState } from 'react';
import { verifyLogin, registerUser, checkIfUserExists } from '../api/authService';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userFuncionario: string, senhaFuncionario: string): Promise<boolean> => {
    console.log('🔐 [useAuth] Iniciando processo de login...', { userFuncionario });
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('📡 [useAuth] Chamando verifyLogin...');
      const success = await verifyLogin({ userFuncionario, senhaFuncionario });
      
      console.log('📡 [useAuth] Resposta do verifyLogin:', success);
      
      if (success) {
        console.log('✅ [useAuth] Login válido! Salvando no localStorage...');
        localStorage.setItem('currentUser', userFuncionario);
        return true;
      } else {
        console.log('❌ [useAuth] Login inválido - Credenciais rejeitadas');
        setError('Credenciais inválidas');
        return false;
      }
    } catch (err) {
      console.error('💥 [useAuth] Erro no login:', err);
      setError('Erro de conexão com o servidor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userFuncionario: string, senhaFuncionario: string): Promise<boolean> => {
    console.log('📝 [useAuth] Iniciando processo de cadastro...', { userFuncionario });
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 [useAuth] Verificando se usuário já existe...');
      const userExists = await checkIfUserExists(userFuncionario);
      
      if (userExists) {
        console.log('❌ [useAuth] Usuário já existe');
        setError('Usuário já existe');
        return false;
      }

      console.log('📤 [useAuth] Cadastrando novo usuário...');
      const success = await registerUser({ userFuncionario, senhaFuncionario });
      
      if (success) {
        console.log('✅ [useAuth] Cadastro bem-sucedido');
        return true;
      } else {
        console.log('❌ [useAuth] Erro no cadastro');
        setError('Erro ao cadastrar usuário');
        return false;
      }
    } catch (err) {
      console.error('💥 [useAuth] Erro no cadastro:', err);
      setError('Erro de conexão com o servidor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { login, register, loading, error };
};