package villares_metals.sistema_web.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import villares_metals.sistema_web.domain.OrdemServico;
import villares_metals.sistema_web.service.OrdemServicoService;

@RestController
public class OrdemServicoController {
    
    private OrdemServicoService ordemServicoService;
    
    public OrdemServicoController(OrdemServicoService ordemServicoService) {
        this.ordemServicoService = ordemServicoService;
    }
    
    @GetMapping(path = "/os/{id}")
    public OrdemServico getOS(@PathVariable("id") Integer id) {
        return ordemServicoService.getOS(id);
    }
    
    @GetMapping(path = "/os")
    public List<OrdemServico> listarOS() {
        return ordemServicoService.listarOS();
    }
    
    @PostMapping(path = "/os")
    public OrdemServico postOS(@RequestBody OrdemServico os){
        return ordemServicoService.postOS(os);
    }
    
    @PutMapping(path = "/os/{id}")
    public OrdemServico putOS(@RequestBody OrdemServico os){
        return ordemServicoService.postOS(os);
    }
      
}