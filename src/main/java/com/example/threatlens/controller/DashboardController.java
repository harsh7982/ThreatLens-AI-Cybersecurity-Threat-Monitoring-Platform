package com.example.threatlens.controller;

import com.example.threatlens.repository.ThreatEventRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final ThreatEventRepository threatEventRepository;

    public DashboardController(ThreatEventRepository threatEventRepository) {
        this.threatEventRepository = threatEventRepository;
    }

    @GetMapping("/summary")
    public Map<String, Long> getSummary() {
        Map<String, Long> summary = new HashMap<>();

        summary.put("totalThreats", threatEventRepository.count());
        summary.put("highThreats", threatEventRepository.countBySeverity("HIGH"));
        summary.put("mediumThreats", threatEventRepository.countBySeverity("MEDIUM"));
        summary.put("lowThreats", threatEventRepository.countBySeverity("LOW"));
        summary.put("openThreats", threatEventRepository.countByStatus("OPEN"));
        summary.put("resolvedThreats", threatEventRepository.countByStatus("RESOLVED"));
        summary.put("bruteForceAttacks", threatEventRepository.countByThreatType("Brute Force Attack"));
        summary.put("sqlInjectionAttacks", threatEventRepository.countByThreatType("SQL Injection"));
        summary.put("malwareDetections", threatEventRepository.countByThreatType("Malware Detection"));

        return summary;
    }
}