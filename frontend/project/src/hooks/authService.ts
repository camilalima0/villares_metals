// src/api/authService.ts

// Define a URL base para as requisições, apontando para o seu backend Spring Boot.
const API_BASE_URL = 'http://localhost:8080/funcionarios'; 
const API_LOGIN_TEST_URL = 'http://localhost:8080/funcionarios';

// -----------------------------------------------------------------------------
// 1. Definição de Tipos (Interfaces)
// -----------------------------------------------------------------------------

// Interface que define o formato dos dados de funcionário esperados nas requisições POST.
// Garante a segurança de tipo (Type Safety) do TypeScript.
interface FuncionarioData {
    userFuncionario: string;
    senhaFuncionario: string;
}

// -----------------------------------------------------------------------------
// 2. Função de Cadastro (registerUser)
// -----------------------------------------------------------------------------

/**
 * Tenta cadastrar um novo funcionário enviando os dados para a API REST.
 * @param data: Objeto contendo o username e a senha em texto puro.
 * @returns Promise<boolean>: true se o servidor retornar sucesso (200/201), false caso contrário.
 */
export const registerUser = async (data: FuncionarioData): Promise<boolean> => {

    console.log('[registerUser] Enviando para:', API_BASE_URL);
    console.log('[registerUser] Dados (Body):', JSON.stringify(data));
    // Bloco try/catch é crucial para lidar com erros de rede ou de resposta do servidor.
    try {
        // Usa a API nativa fetch para iniciar uma requisição HTTP.
        const response = await fetch(API_BASE_URL, {
            method: 'POST', // Tipo de requisição para criar um novo recurso.
            headers: {
                'Content-Type': 'application/json', // Informa ao servidor que o corpo é JSON.
            },
            // Converte o objeto JavaScript 'data' em uma string JSON para o corpo da requisição.
            body: JSON.stringify(data), 
        });

        console.log('[registerUser] Resposta do Servidor (Status):', response.status);

        // Verifica o status da resposta HTTP. response.ok é true para status 200-299.
        if (response.ok) {
            return true; 
        } else if (response.status === 409) { 
            // 409 (Conflict) é um status HTTP comum para indicar que o recurso já existe.
            // Se o backend retornar 409 quando o username já estiver em uso:
            return false; 
        }
        // Retorna false para qualquer outro erro (ex: 400 Bad Request, 500 Internal Server Error).
        return false; 
    } catch (error) {
        // Captura erros que ocorrem antes mesmo de o servidor responder (ex: erro de rede).
        console.error("Erro ao cadastrar:", error);
        return false;
    }
};

// -----------------------------------------------------------------------------
// 3. Função de Verificação de Existência (checkIfUserExists)
// -----------------------------------------------------------------------------

/**
 * Verifica se um username já existe (usado antes do cadastro).
 * NOTA: Esta função requer que você implemente um endpoint GET específico no Spring Boot.
 * @returns Promise<boolean>: true se o usuário existe, false se não.
 */
export const checkIfUserExists = async (username: string): Promise<boolean> => {
    try {
        // Faz uma requisição GET para um endpoint que deve retornar 200 se o usuário for encontrado.
        const response = await fetch(`${API_BASE_URL}/username/${username}`);
        
        // Se response.ok for true (status 200), o backend confirmou que o usuário existe.
        return response.ok; 
    } catch (error) {
        // Lida com erros de rede.
        console.error("Erro ao verificar usuário:", error);
        return false;
    }
};


// -----------------------------------------------------------------------------
// 4. Função de Verificação de Login (verifyLogin)
// -----------------------------------------------------------------------------

/**
 * Envia as credenciais usando o padrão HTTP Basic para o Spring Security.
 * @returns true se o Spring aceitar as credenciais (status 200), false se recusar (status 401).
 */
export const verifyLogin = async (data: FuncionarioData): Promise<boolean> => {
    
    // 1. Constrói a string 'username:password'
    const credentials = `${data.userFuncionario}:${data.senhaFuncionario}`;
    
    // 2. Codifica a string em Base64 (necessário para o cabeçalho HTTP Basic)
    // Usamos btoa() no navegador para codificar em Base64.
    const encodedCredentials = btoa(credentials); 

    try {
        const response = await fetch(API_LOGIN_TEST_URL, {
            method: 'GET', // Requisição GET para buscar dados protegidos
            headers: {
                'Content-Type': 'application/json',
                // 3. Adiciona o cabeçalho Authorization
                'Authorization': `Basic ${encodedCredentials}`, 
            },
        });
        
        // Se o Spring Security autenticar o usuário, ele retorna 200 OK
        if (response.ok) {
            // A autenticação foi bem-sucedida
            return true; 
        } else if (response.status === 401) {
            // Spring Security retorna 401 Unauthorized se as credenciais falharem
            return false;
        }
        
        return false;
    } catch (error) {
        console.error("Erro na verificação de login:", error);
        return false;
    }
};