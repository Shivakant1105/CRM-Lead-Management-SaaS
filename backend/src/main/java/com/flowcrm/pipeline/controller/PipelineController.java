package com.flowcrm.pipeline.controller;

import com.flowcrm.common.ApiResponse;
import com.flowcrm.pipeline.entity.Pipeline;
import com.flowcrm.pipeline.service.PipelineService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pipelines")
@RequiredArgsConstructor
public class PipelineController {

    private final PipelineService pipelineService;

    @GetMapping
    @PreAuthorize("hasAuthority('LEAD_VIEW') or hasAuthority('TENANT_ADMIN')")
    public ApiResponse<List<Pipeline>> getPipelines() {
        List<Pipeline> pipelines = pipelineService.getTenantPipelines();
        return ApiResponse.success(pipelines, "Pipelines retrieved.");
    }
}
