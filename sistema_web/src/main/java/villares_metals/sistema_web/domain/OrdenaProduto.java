package villares_metals.sistema_web.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;
import villares_metals.sistema_web.domain.ids.OrdenaProdutoId;

@Entity
@Getter
@Setter
@Table(name = "ordena_produto")
public class OrdenaProduto implements Serializable{
    @EmbeddedId // Usa a chave composta
    private OrdenaProdutoId id = new OrdenaProdutoId(); 

    @ManyToOne
    @MapsId("os") // Mapeia o campo 'os' da chave composta
    @JoinColumn(name = "id_os") // Nome da FK no banco
    @JsonBackReference
    private OrdemServico ordemServico;

    @ManyToOne
    @MapsId("produto") // Mapeia o campo 'produto' da chave composta
    @JoinColumn(name = "id_produto") // Nome da FK no banco
    private Produto produto;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;
}
