package com.itb.inf3an.tcc.apimaxfit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
public class ApiMaxfitApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApiMaxfitApplication.class, args);
		log.info("==========================================");
		log.info("       MAXFIT INICIADO COM SUCESSO!");
		log.info("       Sistema pronto para uso.");
		log.info("==========================================");
	}

}
