package com.flowcrm.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByTenantIdAndEmail(Long tenantId, String email);
    Optional<User> findByPublicId(UUID publicId);
    List<User> findByTenantId(Long tenantId);
    boolean existsByTenantIdAndEmail(Long tenantId, String email);
}
