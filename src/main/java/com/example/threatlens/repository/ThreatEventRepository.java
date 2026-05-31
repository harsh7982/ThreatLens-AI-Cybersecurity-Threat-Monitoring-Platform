package com.example.threatlens.repository;

import com.example.threatlens.model.ThreatEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ThreatEventRepository extends JpaRepository<ThreatEvent, Long> {
    long countBySeverity(String severity);
    long countByStatus(String status);
    long countByThreatType(String threatType);

    List<ThreatEvent> findBySourceIp(String sourceIp);
    List<ThreatEvent> findByStatus(String status);
    List<ThreatEvent> findTop5ByOrderByIdDesc();
}