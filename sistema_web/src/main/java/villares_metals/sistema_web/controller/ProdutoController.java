package villares_metals.sistema_web.controller;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import villares_metals.sistema_web.domain.Produto;
import villares_metals.sistema_web.service.ProdutoService;

@RestController
public class ProdutoController {
    
    private ProdutoService produtoService;
    
    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }
    
    @GetMapping(path = "/produtos/{id}")
    public Produto getProduto(@PathVariable("id") Integer id) {
        return produtoService.getProduto(id);
    }
    
    @GetMapping(path = "/produtos")
    public List<Produto> listarProdutos() {
        return produtoService.listarProdutos();
    }
    
    @PostMapping(path = "/produtos")
    public Produto postProduto(@RequestBody Produto produto){
        return produtoService.postProduto(produto);
    }
    
    @PutMapping(path = "/produtos/{id}")
    public Produto putProduto(@RequestBody Produto produto){
        return produtoService.postProduto(produto);
    }
      
}