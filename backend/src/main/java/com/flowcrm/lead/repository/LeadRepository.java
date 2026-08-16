package com.flowcrm.lead.repository;

import com.flowcrm.lead.entity.Lead;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long>, JpaSpecificationExecutor<Lead> {
    Optional<Lead> findByIdAndTenantId(Long id, Long tenantId);
    Optional<Lead> findByTenantIdAndLeadNumber(Long tenantId, String leadNumber);
    long countByTenantId(Long tenantId);
    long countByTenantIdAndStatus_Code(Long tenantId, String statusCode);

    @Query("SELECT COUNT(l) FROM Lead l WHERE l.tenantId = :tenantId AND l.deletedAt IS NULL")
    long countActiveLeads(Long tenantId);
}
