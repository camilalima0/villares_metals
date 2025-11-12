// repository/OrdenaProdutoRepository.java
package villares_metals.sistema_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import villares_metals.sistema_web.domain.OrdenaProduto;
import villares_metals.sistema_web.domain.ids.OrdenaProdutoId;

@Repository
public interface OrdenaProdutoRepository extends JpaRepository<OrdenaProduto, OrdenaProdutoId> {
    // Queries customizadas, se necessário. Ex: Listar todos os produtos de uma OS.
}