package com.flowcrm.lead.repository;

import com.flowcrm.lead.entity.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadStatusRepository extends JpaRepository<LeadStatus, Long> {
    List<LeadStatus> findByTenantIdAndActiveTrueOrderByDisplayOrderAsc(Long tenantId);
    Optional<LeadStatus> findByTenantIdAndCode(Long tenantId, String code);
}
