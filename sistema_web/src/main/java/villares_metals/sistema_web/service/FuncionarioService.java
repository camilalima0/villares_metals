package villares_metals.sistema_web.service;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import villares_metals.sistema_web.domain.Funcionario;
import villares_metals.sistema_web.repository.FuncionarioRepository;

@Service
public class FuncionarioService {
    
    //instancia o repositorio
    @Autowired
    private final FuncionarioRepository funcionarioRepository;
    private final PasswordEncoder passwordEncoder; // Injeção do Bean
    
    public FuncionarioService(
            FuncionarioRepository funcionarioRepository, 
            PasswordEncoder passwordEncoder
    ) {
        this.funcionarioRepository = funcionarioRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    //recupera por id
    public Funcionario getFuncionario(Integer id) {
        return funcionarioRepository.findFuncionarioById(id);
    }
    
    //lista todos
    public List<Funcionario> listarFuncionarios() {
        return funcionarioRepository.findAll();
    }
    
    //salva ou atualiza no db
    @Transactional
    public Funcionario postFuncionario(Funcionario funcionario) {
        // 1. Recebe a senha em texto puro do objeto Funcionario
        String senhaTextoPuro = funcionario.getSenhaFuncionario();
        
        // 2. CONVERTE A SENHA EM HASH
        String senhaHash = passwordEncoder.encode(senhaTextoPuro);
        
        // 3. Define o hash de volta no objeto antes de salvar
        funcionario.setSenhaFuncionario(senhaHash);
        return funcionarioRepository.save(funcionario);
    }
    
    public boolean verificarLogin(String username, String senhaTextoPuro) {
        Funcionario funcionario = funcionarioRepository.findFuncionarioByUser(username);
        
        if (funcionario != null) {
            // Compara o hash armazenado com o hash da senha de texto puro
            // O próprio BCryptPasswordEncoder faz a comparação segura
            return passwordEncoder.matches(senhaTextoPuro, funcionario.getSenhaFuncionario());
        }
        return false;
    }
    
    public Funcionario verificarLoginExistente(String username) {
        Funcionario funcionario = funcionarioRepository.findFuncionarioByUser(username);
        
        if (funcionario != null) {
            // Compara o hash armazenado com o hash da senha de texto puro
            // O próprio BCryptPasswordEncoder faz a comparação segura
            return funcionario;
        }
        return null;
    }
    
    @Transactional
    public void deleteFuncionario(Integer id) {
        funcionarioRepository.deleteById(id);
    }
}
