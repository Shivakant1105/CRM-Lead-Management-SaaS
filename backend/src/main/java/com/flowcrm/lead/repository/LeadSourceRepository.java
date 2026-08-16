package com.flowcrm.lead.repository;

import com.flowcrm.lead.entity.LeadSource;
import com.flowcrm.lead.entity.LeadStatus;
import com.flowcrm.lead.entity.Tag;
import com.flowcrm.lead.entity.LeadNote;
import com.flowcrm.lead.entity.LeadActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeadSourceRepository extends JpaRepository<LeadSource, Long> {
    List<LeadSource> findByTenantIdAndActiveTrueOrderByDisplayOrderAsc(Long tenantId);
    Optional<LeadSource> findByTenantIdAndCode(Long tenantId, String code);
}
