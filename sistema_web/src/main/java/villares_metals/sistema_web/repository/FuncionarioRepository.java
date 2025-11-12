package villares_metals.sistema_web.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import villares_metals.sistema_web.domain.Funcionario;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Integer>{
    @Query("select f from Funcionario f where f.idFuncionario = :id")
    public Funcionario findFuncionarioById(@Param("id") Integer idFuncionario);
}

