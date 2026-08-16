package com.flowcrm.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;

import javax.sql.DataSource;

@Slf4j
@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSourceProperties dataSourceProperties(Environment env) {
        DataSourceProperties properties = new DataSourceProperties();

        String rawUrl = env.getProperty("DATABASE_URL");
        if (rawUrl == null || rawUrl.isBlank()) {
            rawUrl = env.getProperty("SPRING_DATASOURCE_URL", "jdbc:postgresql://localhost:5432/flowcrm_db");
        }

        // Convert Render postgres:// or postgresql:// to JDBC format if necessary
        if (rawUrl.startsWith("postgres://")) {
            rawUrl = "jdbc:postgresql://" + rawUrl.substring("postgres://".length());
        } else if (rawUrl.startsWith("postgresql://")) {
            rawUrl = "jdbc:postgresql://" + rawUrl.substring("postgresql://".length());
        }

        log.info("Configured JDBC Datasource URL: {}", rawUrl);

        properties.setUrl(rawUrl);
        properties.setUsername(env.getProperty("DATABASE_USERNAME", env.getProperty("SPRING_DATASOURCE_USERNAME", "postgres")));
        properties.setPassword(env.getProperty("DATABASE_PASSWORD", env.getProperty("SPRING_DATASOURCE_PASSWORD", "postgres_secure_pass")));
        properties.setDriverClassName("org.postgresql.Driver");

        return properties;
    }

    @Bean
    @Primary
    public DataSource dataSource(DataSourceProperties properties) {
        return properties.initializeDataSourceBuilder().build();
    }
}
