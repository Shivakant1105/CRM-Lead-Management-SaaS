package com.flowcrm.pipeline.repository;

import com.flowcrm.pipeline.entity.Pipeline;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PipelineRepository extends JpaRepository<Pipeline, Long> {
    List<Pipeline> findByTenantIdAndActiveTrue(Long tenantId);
    Optional<Pipeline> findByTenantIdAndIsDefaultTrue(Long tenantId);
}
