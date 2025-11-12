import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Factory } from 'lucide-react';

interface LoginPageProps {
  onLogin: (username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginUsername && loginPassword) {
      // Mock authentication - in real app, verify against backend
      onLogin(loginUsername);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerUsername && registerPassword) {
      // Mock registration - in real app, save to backend
      onLogin(registerUsername);
    }
  };

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
                <Card>
                  <CardHeader>
                    <CardTitle>Entrar no Sistema</CardTitle>
                    <CardDescription>
                      Digite suas credenciais para acessar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-username">Usuário</Label>
                        <Input
                          id="login-username"
                          placeholder="Digite seu usuário"
                          value={loginUsername}
                          onChange={(e) => setLoginUsername(e.target.value)}
                          required
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
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Entrar
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle>Criar Conta</CardTitle>
                    <CardDescription>
                      Cadastre-se para acessar o sistema
                    </CardDescription>
                  </CardHeader>
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
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Cadastrar
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
