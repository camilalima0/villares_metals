package villares_metals.sistema_web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable()) // Desabilita para chamadas de API

                // Permissão de Rotas
                .authorizeHttpRequests(auth -> auth
                // Permite POST para /funcionarios (cadastro) e GET (listar)
                .requestMatchers("/funcionarios/**").permitAll()
                // Qualquer outra requisição requer autenticação (se necessário)
                .anyRequest().authenticated()
                )
                // Configuração do Login
                .formLogin(form -> form
                .disable() // Desabilita o formulário HTML padrão
                )
                // Configuração da Autenticação HTTP Básica (ideal para testes de API)
                // Ou você pode configurar JWT aqui, mas vamos usar um básico por enquanto.
                .httpBasic(withDefaults());

        return http.build();
    }

}
