package villares_metals.sistema_web.domain.ids;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrdenaProdutoId implements Serializable {

    
    private Integer os; // Mapeia para o campo 'os' na entidade principal
    private Integer produto; // Mapeia para o campo 'produto' na entidade principal
    
    // Deve ter equals() e hashCode() implementados! (Lombok @Data resolve isso)
}