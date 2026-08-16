package com.flowcrm.common;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private String code;
    private Instant timestamp;
    private String path;
    private List<FieldErrorDetail> errors;

    public static <T> ApiResponse<T> success(T data, String message) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .timestamp(Instant.now())
                .build();
    }

    public static <T> ApiResponse<T> success(T data) {
        return success(data, "Operation completed successfully.");
    }

    public static <T> ApiResponse<T> error(String message, String code, String path, List<FieldErrorDetail> errors) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .code(code)
                .path(path)
                .timestamp(Instant.now())
                .errors(errors)
                .build();
    }

    public static <T> ApiResponse<T> error(String message, String code, String path) {
        return error(message, code, path, null);
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class FieldErrorDetail {
        private String field;
        private String message;
    }
}
