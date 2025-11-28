package villares_metals.sistema_web.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module; // Use hibernate5 se for Spring Boot antigo
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Hibernate6Module hibernateModule() {
        // Este módulo permite que o Jackson lide com Lazy Loading e proxies do Hibernate
        return new Hibernate6Module();
    }
}
