package com.flowcrm;

import com.flowcrm.tenant.Tenant;
import com.flowcrm.tenant.TenantContext;
import com.flowcrm.tenant.TenantRepository;
import com.flowcrm.user.User;
import com.flowcrm.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
public class TenantIsolationTest {

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private UserRepository userRepository;

    private Tenant tenantA;
    private Tenant tenantB;
    private User userTenantA;
    private User userTenantB;

    @BeforeEach
    public void setUp() {
        tenantA = tenantRepository.save(Tenant.builder()
                .name("Tenant Alpha")
                .slug("tenant-alpha")
                .status("ACTIVE")
                .build());

        tenantB = tenantRepository.save(Tenant.builder()
                .name("Tenant Beta")
                .slug("tenant-beta")
                .status("ACTIVE")
                .build());

        userTenantA = userRepository.save(User.builder()
                .tenant(tenantA)
                .firstName("Alice")
                .lastName("Alpha")
                .email("alice@alpha.com")
                .passwordHash("hashedpass")
                .build());

        userTenantB = userRepository.save(User.builder()
                .tenant(tenantB)
                .firstName("Bob")
                .lastName("Beta")
                .email("bob@beta.com")
                .passwordHash("hashedpass")
                .build());
    }

    @Test
    @DisplayName("Tenant A cannot access Tenant B user by tenant ID scoping")
    public void testTenantIsolationOnUsers() {
        // Set Context to Tenant A
        TenantContext.setCurrentTenantId(tenantA.getId());

        List<User> tenantAUsers = userRepository.findByTenantId(TenantContext.getCurrentTenantId());
        assertEquals(1, tenantAUsers.size());
        assertEquals("alice@alpha.com", tenantAUsers.get(0).getEmail());

        Optional<User> tenantBUserCheck = userRepository.findByTenantIdAndEmail(TenantContext.getCurrentTenantId(), "bob@beta.com");
        assertTrue(tenantBUserCheck.isEmpty(), "Tenant A context must NOT return Tenant B user data");

        TenantContext.clear();
    }

    @Test
    @DisplayName("Tenant B cannot read Tenant A users")
    public void testTenantBIsolation() {
        TenantContext.setCurrentTenantId(tenantB.getId());

        List<User> tenantBUsers = userRepository.findByTenantId(TenantContext.getCurrentTenantId());
        assertEquals(1, tenantBUsers.size());
        assertEquals("bob@beta.com", tenantBUsers.get(0).getEmail());

        TenantContext.clear();
    }
}
