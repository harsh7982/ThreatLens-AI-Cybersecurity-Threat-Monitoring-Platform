package com.example.threatlens.service;

import com.example.threatlens.model.ThreatEvent;
import com.example.threatlens.repository.ThreatEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ThreatEventService {

    private final ThreatEventRepository threatEventRepository;

    public ThreatEventService(ThreatEventRepository threatEventRepository) {
        this.threatEventRepository = threatEventRepository;
    }

    public ThreatEvent addThreat(ThreatEvent threatEvent) {
        if (threatEvent.getThreatType().equalsIgnoreCase("Brute Force Attack")) {
            threatEvent.setSeverity("HIGH");
        } else if (threatEvent.getThreatType().equalsIgnoreCase("SQL Injection")) {
            threatEvent.setSeverity("MEDIUM");
        } else if (threatEvent.getThreatType().equalsIgnoreCase("Malware Detection")) {
            threatEvent.setSeverity("LOW");
        } else {
            threatEvent.setSeverity("UNKNOWN");
        }

        threatEvent.setStatus("OPEN");
        return threatEventRepository.save(threatEvent);
    }

    public List<ThreatEvent> getAllThreats() {
        return threatEventRepository.findAll();
    }

    public List<ThreatEvent> getThreatsBySourceIp(String sourceIp) {
        return threatEventRepository.findBySourceIp(sourceIp);
    }

    public List<ThreatEvent> getThreatsByStatus(String status) {
        return threatEventRepository.findByStatus(status);
    }

    public List<ThreatEvent> getRecentThreats() {
        return threatEventRepository.findTop5ByOrderByIdDesc();
    }

    public ThreatEvent updateThreatStatus(Long id, String status) {
        ThreatEvent threatEvent = threatEventRepository.findById(id).orElseThrow();
        threatEvent.setStatus(status);
        return threatEventRepository.save(threatEvent);
    }

    public ThreatEvent updateAnalystNotes(Long id, String notes) {
        ThreatEvent threatEvent = threatEventRepository.findById(id).orElseThrow();
        threatEvent.setAnalystNotes(notes);
        return threatEventRepository.save(threatEvent);
    }
}