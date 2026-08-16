package com.flowcrm.health;

import com.flowcrm.common.ApiResponse;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequiredArgsConstructor
public class HealthCheckController {

    private final JdbcTemplate jdbcTemplate;
    private final RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/actuator/health")
    public ApiResponse<HealthStatus> healthCheck() {
        boolean dbStatus = checkDatabase();
        boolean redisStatus = checkRedis();
        boolean overallStatus = dbStatus && redisStatus;

        HealthStatus status = HealthStatus.builder()
                .status(overallStatus ? "UP" : "DOWN")
                .database(dbStatus ? "UP" : "DOWN")
                .redis(redisStatus ? "UP" : "DOWN")
                .timestamp(Instant.now())
                .build();

        return ApiResponse.success(status, "System health report generated.");
    }

    private boolean checkDatabase() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            return result != null && result == 1;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkRedis() {
        try {
            return redisTemplate.execute((RedisConnection connection) -> "PONG".equalsIgnoreCase(connection.ping()));
        } catch (Exception e) {
            return false;
        }
    }

    @Data
    @Builder
    public static class HealthStatus {
        private String status;
        private String database;
        private String redis;
        private Instant timestamp;
    }
}
