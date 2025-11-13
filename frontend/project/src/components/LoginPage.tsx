import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Factory } from 'lucide-react';
import { verifyLogin, registerUser } from '../api/authService';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [error, setError] = useState<string | null>(null); // Novo estado para mensagens de erro
  const [isLoading, setIsLoading] = useState<boolean>(false); // Novo estado para carregamento

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    if (loginUsername && loginPassword) {
      const success = await verifyLogin({
        userFuncionario: loginUsername,
        senhaFuncionario: loginPassword
      });
      setIsLoading(false);

      if (success) {
        // Sucesso: Chama o onLogin do App.tsx, que persiste o usuário
        onLogin(loginUsername);
      } else {
        // Falha: Spring Security devolveu 401 Unauthorized
        setError('Credenciais inválidas. Usuário ou senha incorretos.');
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (registerUsername && registerPassword) {
      // Lógica para verificar se o usuário já existe (opcional)
      // const userExists = await checkIfUserExists(registerUsername);
      // if (userExists) { setError('Usuário já cadastrado.'); setIsLoading(false); return; }

      const success = await registerUser({
        userFuncionario: registerUsername,
        senhaFuncionario: registerPassword
      });

      setIsLoading(false);

      if (success) {
        setError('✅ Cadastro realizado com sucesso! Use a aba Login.');
        // Limpa o formulário de registro
        setRegisterUsername('');
        setRegisterPassword('');
        // Se você quiser que o usuário vá diretamente para o dashboard após o cadastro:
        onLogin(registerUsername);
      } else {
        // Este erro pode ser de rede ou se o backend rejeitar (ex: 409 Conflict)
        setError('❌ Falha no cadastro. O usuário pode já existir ou houve um erro no servidor.');
      }
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Factory className="h-8 w-8 text-orange-500" />
          <span className="text-white text-xl">Villares Metals</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Hero content */}
          <div className="text-white space-y-6">
            <h1 className="text-5xl">
              Sistema de Gestão <span className="text-orange-500">Villares Metals</span>
            </h1>
            <p className="text-slate-300 text-lg">
              Gerencie suas ordens de serviço, produtos, clientes e equipe de forma
              eficiente e integrada. Controle total da sua operação metalúrgica em
              um só lugar.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="text-orange-500 text-3xl mb-2">📊</div>
                <h3 className="text-sm mb-1">Ordens de Serviço</h3>
                <p className="text-xs text-slate-400">Controle completo de produção</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="text-orange-500 text-3xl mb-2">📦</div>
                <h3 className="text-sm mb-1">Gestão de Produtos</h3>
                <p className="text-xs text-slate-400">Inventário e especificações</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="text-orange-500 text-3xl mb-2">🤝</div>
                <h3 className="text-sm mb-1">Clientes</h3>
                <p className="text-xs text-slate-400">Cadastro e relacionamento</p>
              </div>
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                <div className="text-orange-500 text-3xl mb-2">👥</div>
                <h3 className="text-sm mb-1">Funcionários</h3>
                <p className="text-xs text-slate-400">Equipe e acessos</p>
              </div>
            </div>
          </div>

          {/* Right side - Login/Register Form */}
          <div className="flex justify-center">
            <Tabs defaultValue="login" className="w-full max-w-md">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Cadastro</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <Card className="border-slate-300">
                  <CardHeader>
                    <CardTitle>Entrar no Sistema</CardTitle>
                    <CardDescription className="text-slate-400">
                      Digite suas credenciais para acessar
                    </CardDescription>
                  </CardHeader>
                  {/* Adicione o bloco de erro/loading aqui */}
                  {error && <p className="text-sm text-red-500 p-2">{error}</p>}
                  <CardContent>
                    {/* Bloco de erro */}
                    {error && <p className="text-sm text-red-500 p-2 mb-4 bg-red-900/30 rounded-md">{error}</p>}

                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Usuário</Label>
                        <Input
                          id="login-username"
                          placeholder="Digite seu usuário"
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          required
                          className="bg-white border-slate-300 text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Senha</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Digite sua senha"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          className="bg-white border-slate-300 text-gray-900"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Aguarde...' : 'Entrar'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card className="border-slate-300">
                  <CardHeader>
                    <CardTitle>Criar Conta</CardTitle>
                    <CardDescription className="text-slate-400">
                      Cadastre-se para acessar o sistema
                    </CardDescription>
                  </CardHeader>
                  {/* Adicione o bloco de erro/loading aqui */}
                  {error && <p className="text-sm text-red-500 p-2">{error}</p>}

                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-username">Usuário</Label>
                        <Input
                          id="register-username"
                          placeholder="Escolha um usuário"
                          value={registerUsername}
                          onChange={(e) => setRegisterUsername(e.target.value)}
                          required
                          className="bg-white border-slate-300 text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Senha</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Escolha uma senha"
                          value={registerPassword}
                          onChange={(e) => setRegisterPassword(e.target.value)}
                          required
                          className="bg-white border-slate-300 text-gray-900"
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Aguarde...' : 'Cadastrar'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
