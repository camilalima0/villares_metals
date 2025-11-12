package villares_metals.sistema_web.service;

import jakarta.transaction.Transactional;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import villares_metals.sistema_web.repository.ProdutoRepository;
import villares_metals.sistema_web.domain.Produto;

@Service
public class ProdutoService {
    
    //instancia o repositorio de produtos
    @Autowired
    private final ProdutoRepository produtoRepository;
    
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }
    
    //recupera produto por id
    public Produto getProduto(Integer id) {
        return produtoRepository.findProdutoById(id);
    }
    
    //lista todos os produtos
    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }
    
    //salva ou atualiza produto no db
    @Transactional
    public Produto postProduto(Produto produto) {
        return produtoRepository.save(produto);
    }
    
    @Transactional
    public void deleteProduto(Integer id) {
        produtoRepository.deleteById(id);
    } 
}
