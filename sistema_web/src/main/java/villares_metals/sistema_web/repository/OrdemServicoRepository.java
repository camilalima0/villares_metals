package villares_metals.sistema_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import villares_metals.sistema_web.domain.OrdemServico;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Integer>{
    @Query("select os from OrdemServico os where os.idOS = :id")
    public OrdemServico findOSById(@Param("id") Integer idOS);
}