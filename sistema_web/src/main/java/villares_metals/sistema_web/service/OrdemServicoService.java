package villares_metals.sistema_web.service;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import villares_metals.sistema_web.domain.OrdemServico;
import villares_metals.sistema_web.domain.OrdenaProduto;
import villares_metals.sistema_web.repository.OrdemServicoRepository;
import villares_metals.sistema_web.repository.OrdenaProdutoRepository;
import villares_metals.sistema_web.repository.ProdutoRepository;

@Service
public class OrdemServicoService {
    
    // Repositórios declarados como final
    private final OrdenaProdutoRepository ordenaProdutoRepository;
    private final ProdutoRepository produtoRepository; // Adicionado para buscar Produto
    
    //instancia o repositorio de os
    @Autowired
    private final OrdemServicoRepository ordemServicoRepository;
    
    public OrdemServicoService(
            OrdemServicoRepository ordemServicoRepository,
            OrdenaProdutoRepository ordenaProdutoRepository,
            ProdutoRepository produtoRepository
    ) {
        this.ordemServicoRepository = ordemServicoRepository;
        this.ordenaProdutoRepository = ordenaProdutoRepository;
        this.produtoRepository = produtoRepository;
    }
    
    //recupera os por id
    public OrdemServico getOS(Integer id) {
        return ordemServicoRepository.findOSById(id);
    }
    
    //lista todas as os
    public List<OrdemServico> listarOS() {
        return ordemServicoRepository.findAll();
    }
    
    //salva ou atualiza os no db
    @Transactional
    public OrdemServico postOS(OrdemServico os) {
        // 1. Salva a Ordem de Serviço principal (o ID é gerado aqui)
        OrdemServico novaOs = ordemServicoRepository.save(os);
        
        // 2. Itera sobre a lista de itens do pedido (itensDoPedido é o nome do campo na OS.java)
        if (novaOs.getItensDoPedido() != null && !novaOs.getItensDoPedido().isEmpty()) {
            
            for (OrdenaProduto item : novaOs.getItensDoPedido()) {
                
                // 3. Busca o objeto Produto gerenciado (melhor prática de JPA)
                item.setProduto(produtoRepository.getReferenceById(item.getProduto().getIdProduto())); 
                
                // 4. Configura as chaves compostas e as referências de objeto
                item.getId().setOs(novaOs.getIdOS());
                item.setOrdemServico(novaOs);
                
                // 5. Salva o item OrdenaProduto (entidade associativa)
                ordenaProdutoRepository.save(item); 
            }
        }
        
        return novaOs;
    }
    
    @Transactional
    public void deleteOS(Integer id) {
        ordemServicoRepository.deleteById(id);
    }
}