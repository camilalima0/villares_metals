package villares_metals.sistema_web.service;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import villares_metals.sistema_web.repository.ClienteRepository;
import villares_metals.sistema_web.domain.Cliente;

@Service
public class ClienteService {
    
    //instancia o repositorio de clientes
    @Autowired
    private final ClienteRepository clienteRepository;
    
    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }
    
    //recupera cliente por id
    public Cliente getCliente(Integer id) {
        return clienteRepository.findClienteById(id);
    }
    
    //lista todos os clientes
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }
    
    //salva ou atualiza cliente no db
    @Transactional
    public Cliente postCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
    
    @Transactional
    public void deleteCliente(Integer id) {
        clienteRepository.deleteById(id);
    }
}
