package com.flowcrm.lead.repository;

import com.flowcrm.lead.entity.LeadActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadActivityRepository extends JpaRepository<LeadActivity, Long> {
    List<LeadActivity> findByTenantIdAndLeadIdOrderByPerformedAtDesc(Long tenantId, Long leadId);
}
