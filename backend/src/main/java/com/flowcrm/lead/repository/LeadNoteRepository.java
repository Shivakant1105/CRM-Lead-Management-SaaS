package com.flowcrm.lead.repository;

import com.flowcrm.lead.entity.LeadNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadNoteRepository extends JpaRepository<LeadNote, Long> {
    List<LeadNote> findByTenantIdAndLeadIdOrderByCreatedAtDesc(Long tenantId, Long leadId);
}
