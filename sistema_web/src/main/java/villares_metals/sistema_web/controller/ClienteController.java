package villares_metals.sistema_web.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import villares_metals.sistema_web.domain.Cliente;
import villares_metals.sistema_web.service.ClienteService;

@RestController
public class ClienteController {
    
    private ClienteService clienteService;
    
    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }
    
    @GetMapping(path = "/clientes/{id}")
    public Cliente getCliente(@PathVariable("id") Integer id) {
        return clienteService.getCliente(id);
    }
    
    @GetMapping(path = "/clientes")
    public List<Cliente> listarClientes() {
        return clienteService.listarClientes();
    }
    
    @PostMapping(path = "/clientes")
    public Cliente postCliente(@RequestBody Cliente cliente){
        return clienteService.postCliente(cliente);
    }
    
    @PutMapping(path = "/clientes/{id}")
    public Cliente putCliente(@RequestBody Cliente cliente){
        return clienteService.postCliente(cliente);
    }
      
}
