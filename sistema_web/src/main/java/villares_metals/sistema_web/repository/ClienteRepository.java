package villares_metals.sistema_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import villares_metals.sistema_web.domain.Cliente;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Integer>{
    @Query("select c from Cliente c where c.idCliente = :id")
    public Cliente findClienteById(@Param("id") Integer idCliente);
}
