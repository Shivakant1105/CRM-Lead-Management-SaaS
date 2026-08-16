package com.flowcrm.user;

import com.flowcrm.common.ApiResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final RoleRepository roleRepository;

    @GetMapping("/users/me")
    public ApiResponse<User> getCurrentUserProfile(Authentication authentication) {
        User user = userService.getActiveUserProfile(authentication.getName());
        return ApiResponse.success(user, "User profile fetched successfully.");
    }

    @PutMapping("/users/me")
    public ApiResponse<User> updateCurrentUserProfile(Authentication authentication, @RequestBody ProfileUpdateRequest request) {
        User updated = userService.updateActiveUserProfile(
            authentication.getName(),
            request.getFirstName(),
            request.getLastName(),
            request.getPhone()
        );
        return ApiResponse.success(updated, "Profile updated successfully.");
    }

    @GetMapping("/settings/users")
    @PreAuthorize("hasAuthority('USER_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<List<User>> getTenantUsers() {
        List<User> users = userService.getTenantUsers();
        return ApiResponse.success(users, "Tenant users retrieved successfully.");
    }

    @GetMapping("/settings/roles")
    @PreAuthorize("hasAuthority('ROLE_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<List<Role>> getRoles() {
        List<Role> roles = roleRepository.findAll();
        return ApiResponse.success(roles, "Roles retrieved successfully.");
    }

    @Data
    public static class ProfileUpdateRequest {
        private String firstName;
        private String lastName;
        private String phone;
    }
}
