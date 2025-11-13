package villares_metals.sistema_web.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import villares_metals.sistema_web.domain.Funcionario;
import villares_metals.sistema_web.repository.FuncionarioRepository;
import static java.util.Collections.emptyList; // Para a lista de autoridades

@Service
public class FuncionarioDetailsService implements UserDetailsService {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioDetailsService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        // 1. Busca o funcionário pelo username no seu repositório
        Funcionario funcionario = funcionarioRepository.findFuncionarioByUser(username); // Reutiliza sua query
        
        if (funcionario == null) {
            // Lança exceção se o usuário não for encontrado
            throw new UsernameNotFoundException("Funcionário não encontrado: " + username);
        }

        // 2. Converte seu objeto Funcionario para um objeto UserDetails do Spring Security
        // Usamos a classe User padrão do Spring Security:
        return new org.springframework.security.core.userdetails.User(
            funcionario.getUserFuncionario(), // Username
            funcionario.getSenhaFuncionario(), // Senha (já hasheada)
            emptyList() // Lista vazia de Autoridades/Roles (permissoes)
        );
    }
    
}
