package com.flowcrm.auth;

import com.flowcrm.auth.dto.AuthResponse;
import com.flowcrm.auth.dto.LoginRequest;
import com.flowcrm.auth.dto.RegisterRequest;
import com.flowcrm.common.exceptions.BusinessException;
import com.flowcrm.common.exceptions.DuplicateResourceException;
import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.tenant.CompanySettings;
import com.flowcrm.tenant.CompanySettingsRepository;
import com.flowcrm.tenant.Tenant;
import com.flowcrm.tenant.TenantRepository;
import com.flowcrm.user.Role;
import com.flowcrm.user.RoleRepository;
import com.flowcrm.user.User;
import com.flowcrm.user.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final RoleRepository roleRepository;
    private final CompanySettingsRepository companySettingsRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final CookieUtils cookieUtils;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpirationMs;

    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userDetails.getId()));

        user.setLastLoginAt(Instant.now());
        userRepository.save(user);

        String accessToken = jwtUtils.generateAccessToken(userDetails);
        String refreshTokenString = createRefreshToken(user);
        cookieUtils.addRefreshTokenCookie(response, refreshTokenString);

        return buildAuthResponse(accessToken, userDetails, user.getTenant());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        String slug = generateSlug(request.getCompanyName());
        if (tenantRepository.existsBySlug(slug)) {
            slug = slug + "-" + UUID.randomUUID().toString().substring(0, 5);
        }

        Tenant tenant = Tenant.builder()
                .name(request.getCompanyName())
                .slug(slug)
                .email(request.getEmail())
                .phone(request.getPhone())
                .industry(request.getIndustry())
                .status("ACTIVE")
                .currency("INR")
                .timezone("Asia/Kolkata")
                .build();
        tenant = tenantRepository.save(tenant);

        CompanySettings settings = CompanySettings.builder()
                .tenantId(tenant.getId())
                .companyName(tenant.getName())
                .email(tenant.getEmail())
                .phone(tenant.getPhone())
                .currency("INR")
                .timezone("Asia/Kolkata")
                .invoicePrefix("INV-")
                .quotationPrefix("QUO-")
                .build();
        companySettingsRepository.save(settings);

        Role adminRole = roleRepository.findByName("TENANT_ADMIN")
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", "TENANT_ADMIN"));

        User user = User.builder()
                .tenant(tenant)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .status("ACTIVE")
                .emailVerified(true)
                .roles(Set.of(adminRole))
                .build();
        user = userRepository.save(user);

        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String accessToken = jwtUtils.generateAccessToken(userDetails);
        String refreshTokenString = createRefreshToken(user);
        cookieUtils.addRefreshTokenCookie(response, refreshTokenString);

        return buildAuthResponse(accessToken, userDetails, tenant);
    }

    @Transactional
    public AuthResponse refreshToken(String refreshTokenRaw, HttpServletResponse response) {
        String tokenHash = hashToken(refreshTokenRaw);
        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new BusinessException("Invalid refresh token", "INVALID_REFRESH_TOKEN"));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BusinessException("Expired or revoked refresh token", "EXPIRED_REFRESH_TOKEN");
        }

        User user = refreshToken.getUser();
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);
        String newAccessToken = jwtUtils.generateAccessToken(userDetails);

        return buildAuthResponse(newAccessToken, userDetails, user.getTenant());
    }

    @Transactional
    public void logout(String refreshTokenRaw, HttpServletResponse response) {
        if (refreshTokenRaw != null && !refreshTokenRaw.isBlank()) {
            String tokenHash = hashToken(refreshTokenRaw);
            refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(refreshTokenRepository::delete);
        }
        cookieUtils.clearRefreshTokenCookie(response);
    }

    private String createRefreshToken(User user) {
        String rawToken = UUID.randomUUID().toString() + UUID.randomUUID().toString();
        String hash = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(hash)
                .expiresAt(Instant.now().plusMillis(refreshExpirationMs))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);
        return rawToken;
    }

    private String hashToken(String raw) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(raw.getBytes());
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private String generateSlug(String text) {
        return text.toLowerCase().replaceAll("[^a-z0-9]", "-").replaceAll("-+", "-").replaceAll("^-|-$", "");
    }

    private AuthResponse buildAuthResponse(String accessToken, UserDetailsImpl userDetails, Tenant tenant) {
        Set<String> roles = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .filter(a -> a.startsWith("ROLE_"))
                .map(a -> a.substring(5))
                .collect(Collectors.toSet());

        Set<String> permissions = userDetails.getAuthorities().stream()
                .map(a -> a.getAuthority())
                .filter(a -> !a.startsWith("ROLE_"))
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .tokenType("Bearer")
                .userPublicId(UUID.randomUUID())
                .firstName(userDetails.getEmail().split("@")[0])
                .lastName("User")
                .email(userDetails.getUsername())
                .tenantId(tenant.getId())
                .tenantSlug(tenant.getSlug())
                .companyName(tenant.getName())
                .roles(roles)
                .permissions(permissions)
                .build();
    }
}
