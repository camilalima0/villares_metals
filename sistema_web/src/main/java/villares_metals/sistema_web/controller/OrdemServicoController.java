package villares_metals.sistema_web.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
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
    
    // --- NOVO ENDPOINT DE BUSCA AVANÇADA ---
    @GetMapping("/busca")
    public ResponseEntity<List<OrdemServico>> buscarOS(
            @RequestParam(required = false) Integer idOS,
            @RequestParam(required = false) String nomeCliente,
            @RequestParam(required = false) String cnpjCliente,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDateTime dataAprovacao,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEntregaInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEntregaFim,
            @RequestParam(required = false) Double valorMinimo,
            @RequestParam(required = false) Double valorMaximo,
            @RequestParam(required = false) Boolean statusPagamento,
            @RequestParam(required = false) String statusProducao,
            @RequestParam(required = false) String descricao
    ) {
        List<OrdemServico> resultados = ordemServicoService.buscarAvancada(
            idOS,
            nomeCliente,
            cnpjCliente,
            dataAprovacao,
            dataEntregaInicio, 
            dataEntregaFim, 
            valorMinimo, 
            valorMaximo, 
            statusPagamento, 
            statusProducao,
            descricao
        );
        return ResponseEntity.ok(resultados);
    }
    
    @PostMapping(path = "/os")
    public OrdemServico postOS(@RequestBody OrdemServico os){
        return ordemServicoService.postOS(os);
    }
    
    @PutMapping(path = "/os/{id}")
    public OrdemServico putOS(@RequestBody OrdemServico os){
        return ordemServicoService.postOS(os);
    }
    
    @DeleteMapping(path = "/os/{id}")
    public ResponseEntity<Void> deleteOS(@PathVariable("id") Integer id){
        ordemServicoService.deleteOS(id);
        return ResponseEntity.noContent().build(); // Retorna status 204 (Sucesso sem conteúdo)
    }
      
}