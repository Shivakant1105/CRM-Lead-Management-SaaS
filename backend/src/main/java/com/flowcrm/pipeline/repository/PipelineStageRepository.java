package com.flowcrm.pipeline.repository;

import com.flowcrm.pipeline.entity.PipelineStage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PipelineStageRepository extends JpaRepository<PipelineStage, Long> {
    List<PipelineStage> findByPipelineIdOrderByDisplayOrderAsc(Long pipelineId);
}
