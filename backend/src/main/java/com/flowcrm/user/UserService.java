package com.flowcrm.user;

import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getActiveUserProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public User updateActiveUserProfile(String email, String firstName, String lastName, String phone) {
        User user = getActiveUserProfile(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        if (phone != null) user.setPhone(phone);
        return userRepository.save(user);
    }

    public List<User> getTenantUsers() {
        Long tenantId = TenantContext.getCurrentTenantId();
        return userRepository.findByTenantId(tenantId);
    }
}
