package com.flowcrm.opportunity.repository;

import com.flowcrm.opportunity.entity.Opportunity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, Long> {
    List<Opportunity> findByTenantIdAndPipelineId(Long tenantId, Long pipelineId);
    Optional<Opportunity> findByIdAndTenantId(Long id, Long tenantId);
    long countByTenantId(Long tenantId);

    @Query("SELECT SUM(o.amount) FROM Opportunity o WHERE o.tenantId = :tenantId AND o.status = 'OPEN'")
    BigDecimal calculateTotalPipelineValue(Long tenantId);
}
