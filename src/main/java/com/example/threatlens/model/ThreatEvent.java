package com.example.threatlens.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ThreatEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String threatType;
    private String severity;
    private String sourceIp;
    private String status;

    @Column(length = 1000)
    private String analystNotes;
}