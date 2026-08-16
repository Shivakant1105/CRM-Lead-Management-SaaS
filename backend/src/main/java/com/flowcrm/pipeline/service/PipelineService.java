package com.flowcrm.pipeline.service;

import com.flowcrm.common.exceptions.ResourceNotFoundException;
import com.flowcrm.pipeline.entity.Pipeline;
import com.flowcrm.pipeline.repository.PipelineRepository;
import com.flowcrm.tenant.TenantContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PipelineService {

    private final PipelineRepository pipelineRepository;

    @Transactional(readOnly = true)
    public List<Pipeline> getTenantPipelines() {
        Long tenantId = TenantContext.getCurrentTenantId();
        return pipelineRepository.findByTenantIdAndActiveTrue(tenantId);
    }

    @Transactional(readOnly = true)
    public Pipeline getDefaultPipeline() {
        Long tenantId = TenantContext.getCurrentTenantId();
        return pipelineRepository.findByTenantIdAndIsDefaultTrue(tenantId)
                .orElseGet(() -> getTenantPipelines().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("Pipeline", "tenantId", tenantId)));
    }
}
