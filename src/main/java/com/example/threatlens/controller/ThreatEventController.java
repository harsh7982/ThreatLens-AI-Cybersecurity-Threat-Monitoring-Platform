package com.example.threatlens.controller;

import com.example.threatlens.model.ThreatEvent;
import com.example.threatlens.service.ThreatEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threats")
public class ThreatEventController {

    private final ThreatEventService threatEventService;

    public ThreatEventController(ThreatEventService threatEventService) {
        this.threatEventService = threatEventService;
    }

    @PostMapping
    public ThreatEvent addThreat(@RequestBody ThreatEvent threatEvent) {
        return threatEventService.addThreat(threatEvent);
    }

    @GetMapping
    public List<ThreatEvent> getAllThreats() {
        return threatEventService.getAllThreats();
    }

    @GetMapping("/recent")
    public List<ThreatEvent> getRecentThreats() {
        return threatEventService.getRecentThreats();
    }

    @GetMapping("/source/{ip}")
    public List<ThreatEvent> getThreatsBySourceIp(@PathVariable String ip) {
        return threatEventService.getThreatsBySourceIp(ip);
    }

    @GetMapping("/status/{status}")
    public List<ThreatEvent> getThreatsByStatus(@PathVariable String status) {
        return threatEventService.getThreatsByStatus(status);
    }

    @PutMapping("/{id}/status")
    public ThreatEvent updateThreatStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return threatEventService.updateThreatStatus(id, status);
    }

    @PutMapping("/{id}/notes")
    public ThreatEvent updateAnalystNotes(
            @PathVariable Long id,
            @RequestParam String notes) {
        return threatEventService.updateAnalystNotes(id, notes);
    }
}