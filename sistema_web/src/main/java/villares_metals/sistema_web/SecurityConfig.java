package villares_metals.sistema_web;

import java.util.Arrays;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }

    // 2. NOVA CONFIGURAÇÃO: Definir as regras do CORS
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Permite que o seu frontend React (:3000) acesse
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        // Permite os métodos (GET, POST, etc.)
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Permite cabeçalhos específicos (incluindo o Authorization)
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // Aplica para todas as rotas
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .cors(withDefaults()) // Ativa o CORS
                .csrf(csrf -> csrf.disable()) // Desabilita CSRF

                // 2. (NOVA) Forçar o modo STATELESS (sem sessão)
                .sessionManagement(session
                        -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                // 4. CORREÇÃO: Ser explícito sobre as permissões de rota
                .authorizeHttpRequests(auth -> auth
                // Regra 1: (NOVA) Permite TODAS as requisições OPTIONS (Preflight do CORS)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Regra 2: Permite POST para /funcionarios (Cadastro)
                .requestMatchers(HttpMethod.POST, "/funcionarios").permitAll()
                // Regra 3: Permite GET para /funcionarios/username/{user} (Verificação)
                .requestMatchers(HttpMethod.GET, "/funcionarios/username/**").permitAll()
                // Regra 4: Qualquer outra requisição deve estar autenticada
                .anyRequest().authenticated()
                )
                .httpBasic(withDefaults()); // Habilita o HTTP Basic para autenticação

        return http.build();
    }
}
