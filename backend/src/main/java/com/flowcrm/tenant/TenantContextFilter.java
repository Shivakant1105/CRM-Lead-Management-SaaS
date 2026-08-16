package com.flowcrm.tenant;

import com.flowcrm.auth.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class TenantContextFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                if (jwtUtils.validateToken(token)) {
                    Long tenantId = jwtUtils.getTenantIdFromToken(token);
                    String tenantSlug = jwtUtils.getTenantSlugFromToken(token);
                    TenantContext.setCurrentTenantId(tenantId);
                    TenantContext.setCurrentTenantSlug(tenantSlug);
                }
            } else if (request.getHeader("X-Tenant-ID") != null) {
                try {
                    Long tenantId = Long.parseLong(request.getHeader("X-Tenant-ID"));
                    TenantContext.setCurrentTenantId(tenantId);
                } catch (NumberFormatException ignored) {}
            }
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
