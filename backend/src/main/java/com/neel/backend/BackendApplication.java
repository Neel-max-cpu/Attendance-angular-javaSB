package com.neel.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

//writing this to excluded db(other wise it will throw error that i haven't connected to db
// when using in memory
//@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})


@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {

		SpringApplication.run(BackendApplication.class, args);
	}

}
