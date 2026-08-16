package com.flowcrm.lead.repository;

import com.flowcrm.lead.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByTenantId(Long tenantId);
    Optional<Tag> findByTenantIdAndName(Long tenantId, String name);
}
