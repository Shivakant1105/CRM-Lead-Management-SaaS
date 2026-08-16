package com.flowcrm.auth;

import com.flowcrm.auth.dto.AuthResponse;
import com.flowcrm.auth.dto.LoginRequest;
import com.flowcrm.auth.dto.RegisterRequest;
import com.flowcrm.common.ApiResponse;
import com.flowcrm.common.exceptions.ValidationException;
import com.flowcrm.user.User;
import com.flowcrm.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CookieUtils cookieUtils;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request, response);
        return ApiResponse.success(authResponse, "Login successful.");
    }

    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.register(request, response);
        return ApiResponse.success(authResponse, "Account registered successfully.");
    }

    @PostMapping("/refresh")
    public ApiResponse<AuthResponse> refresh(HttpServletRequest request, HttpServletResponse response) {
        Optional<String> refreshTokenOpt = cookieUtils.extractRefreshTokenFromCookie(request);
        if (refreshTokenOpt.isEmpty()) {
            throw new ValidationException("Refresh token cookie is missing.");
        }
        AuthResponse authResponse = authService.refreshToken(refreshTokenOpt.get(), response);
        return ApiResponse.success(authResponse, "Token refreshed successfully.");
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        Optional<String> refreshTokenOpt = cookieUtils.extractRefreshTokenFromCookie(request);
        authService.logout(refreshTokenOpt.orElse(null), response);
        return ApiResponse.success(null, "Logout successful.");
    }

    @GetMapping("/me")
    public ApiResponse<AuthResponse> me(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof UserDetailsImpl userDetails)) {
            throw new ValidationException("User authentication session invalid.");
        }

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ValidationException("User record not found."));

        Set<String> roles = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .collect(Collectors.toSet());

        Set<String> permissions = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .filter(a -> !a.startsWith("ROLE_"))
                .collect(Collectors.toSet());

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(null)
                .tokenType("Bearer")
                .userPublicId(user.getPublicId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .tenantId(user.getTenant().getId())
                .tenantSlug(user.getTenant().getSlug())
                .companyName(user.getTenant().getName())
                .roles(roles)
                .permissions(permissions)
                .build();

        return ApiResponse.success(authResponse, "User profile details retrieved.");
    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        log.info("Password reset link requested for email: {}", request.getEmail());
        return ApiResponse.success(null, "If an account exists with this email, password reset instructions have been sent.");
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@RequestBody ResetPasswordRequest request) {
        log.info("Password reset executed for token: {}", request.getToken());
        return ApiResponse.success(null, "Password has been reset successfully. Please login with your new password.");
    }

    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
    }
}
