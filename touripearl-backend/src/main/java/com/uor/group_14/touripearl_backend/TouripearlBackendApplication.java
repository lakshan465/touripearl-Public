package com.uor.group_14.touripearl_backend;

import com.uor.group_14.touripearl_backend.service.serviceImpl.InitialDataServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;


@SpringBootApplication
@RequiredArgsConstructor
@EnableJpaAuditing
@EnableAsync(proxyTargetClass = true)
public class TouripearlBackendApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(TouripearlBackendApplication.class, args);
	}

	private final InitialDataServiceImpl initialDataService;
	@Override
	public void run(String... args) throws Exception {
			initialDataService.initializerRoles();
			initialDataService.initializerUsers();
	}
}
