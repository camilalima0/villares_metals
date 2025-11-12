package villares_metals.sistema_web.service;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import villares_metals.sistema_web.domain.Funcionario;
import villares_metals.sistema_web.repository.FuncionarioRepository;

@Service
public class FuncionarioService {
    
    //instancia o repositorio
    @Autowired
    private final FuncionarioRepository funcionarioRepository;
    
    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
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
        return funcionarioRepository.save(funcionario);
    }
    
    @Transactional
    public void deleteFuncionario(Integer id) {
        funcionarioRepository.deleteById(id);
    }
}
