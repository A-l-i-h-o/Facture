package utbm.factures;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permettre CORS pour toutes les URL
                .allowedOrigins("http://localhost:4200") // Autoriser uniquement l'origine Angular
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Méthodes HTTP permises
                .allowedHeaders("*") // Autoriser tous les headers
                .allowCredentials(true); // Permettre les cookies, si nécessaire
    }
}
