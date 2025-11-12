package villares_metals.sistema_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import villares_metals.sistema_web.domain.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Integer>{
    @Query("select p from Produto p where p.idProduto = :id")
    public Produto findProdutoById(@Param("id") Integer idProduto);
}

