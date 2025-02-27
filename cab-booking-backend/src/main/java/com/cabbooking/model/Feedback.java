package com.cabbooking.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(nullable = false)
    private Integer rating; // Rating scale from 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comments; // Optional feedback comments

    @Column(name = "feedback_date",nullable = false)
    private LocalDateTime feedbackDate = LocalDateTime.now();

    @PrePersist
    public void setDefaultDate() {
        if (this.feedbackDate == null) {
            this.feedbackDate = LocalDateTime.now();
        }
    }
}