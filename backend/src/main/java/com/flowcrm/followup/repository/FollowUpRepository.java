package com.flowcrm.followup.repository;

import com.flowcrm.followup.entity.FollowUp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface FollowUpRepository extends JpaRepository<FollowUp, Long> {
    List<FollowUp> findByTenantIdOrderByScheduledAtAsc(Long tenantId);
    List<FollowUp> findByTenantIdAndLeadIdOrderByScheduledAtAsc(Long tenantId, Long leadId);
    List<FollowUp> findByTenantIdAndStatusOrderByScheduledAtAsc(Long tenantId, String status);

    @Query("SELECT f FROM FollowUp f WHERE f.tenantId = :tenantId AND f.status = 'PENDING' AND f.scheduledAt < :now")
    List<FollowUp> findOverdueFollowUps(Long tenantId, Instant now);
}
