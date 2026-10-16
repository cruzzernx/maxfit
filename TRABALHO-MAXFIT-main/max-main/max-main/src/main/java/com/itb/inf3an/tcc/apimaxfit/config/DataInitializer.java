package com.itb.inf3an.tcc.apimaxfit.config;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Admin;
import com.itb.inf3an.tcc.apimaxfit.model.enums.TipoUsuario;
import com.itb.inf3an.tcc.apimaxfit.model.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import lombok.extern.slf4j.Slf4j;

/**
 * Cria o administrador padrão do sistema na primeira vez que a API sobe.
 * Se o e-mail já existir no banco, nada é feito.
 */
@Slf4j
@Component
public class DataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "Admin@maxfit.com";
    private static final String ADMIN_SENHA = "23122008";
    private static final String ADMIN_NOME  = "Administrador MaxFit";

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder   passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository,
                           PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder   = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByEmail(ADMIN_EMAIL).isPresent()) {
            log.info("[DataInitializer] Admin padrão já existe — nenhuma ação necessária.");
            return;
        }

        Admin admin = new Admin();
        admin.setNome(ADMIN_NOME);
        admin.setEmail(ADMIN_EMAIL);
        admin.setPassword(passwordEncoder.encode(ADMIN_SENHA));
        admin.setTipoUsuario(TipoUsuario.ADMIN);
        admin.setCodStatus(true);
        admin.setNivelAcesso("MASTER");

        usuarioRepository.save(admin);

        log.info("==========================================");
        log.info("  [DataInitializer] Admin padrão criado:");
        log.info("  Email : {}", ADMIN_EMAIL);
        log.info("==========================================");
    }
}
