package com.flowcrm.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private String tokenType;
    private UUID userPublicId;
    private String firstName;
    private String lastName;
    private String email;
    private Long tenantId;
    private String tenantSlug;
    private String companyName;
    private Set<String> roles;
    private Set<String> permissions;
}
