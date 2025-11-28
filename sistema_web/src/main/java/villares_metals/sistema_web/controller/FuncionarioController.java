package villares_metals.sistema_web.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import villares_metals.sistema_web.domain.Funcionario;
import villares_metals.sistema_web.service.FuncionarioService;

@RestController
public class FuncionarioController {
    
    private FuncionarioService funcionarioService;
    
    public FuncionarioController(FuncionarioService funcionarioService) {
        this.funcionarioService = funcionarioService;
    }
    
    @GetMapping(path = "/funcionarios/{id}")
    public Funcionario getFuncionario(@PathVariable("id") Integer id) {
        return funcionarioService.getFuncionario(id);
    }
    
    @GetMapping(path = "/funcionarios/username/{user}")
    public Funcionario getFuncionarioExiste(@PathVariable("user") String user) {
        return funcionarioService.verificarLoginExistente(user);
    }
    
    @GetMapping(path = "/funcionarios")
    public List<Funcionario> listarFuncionarios() {
        return funcionarioService.listarFuncionarios();
    }
    
    @PostMapping(path = "/funcionarios")
    public Funcionario postFuncionario(@RequestBody Funcionario funcionario){
        return funcionarioService.postFuncionario(funcionario);
    }
    
    @PutMapping(path = "/funcionarios/{id}")
    public Funcionario putFuncionario(@RequestBody Funcionario funcionario){
        return funcionarioService.postFuncionario(funcionario);
    }
    
    @DeleteMapping(path = "funcionarios/{id}")
    public ResponseEntity<Void> deleteFuncionario(@PathVariable("id") Integer id){
        funcionarioService.deleteFuncionario(id);
        return ResponseEntity.noContent().build(); // Retorna status 204 (Sucesso sem conteúdo)
    }
      
}

