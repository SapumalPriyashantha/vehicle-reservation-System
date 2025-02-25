package com.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false, precision = 10, scale = 2)
    private Double amount;

    @Column(precision = 10, scale = 2)
    private Double extraAmount = 0.00;  // Additional charges

    @Column(precision = 5, scale = 2)
    private Double tax = 0.00;

    @Column(precision = 5, scale = 2)
    private Double discount = 0.00;

    // Total amount calculation
    @Column(precision = 10, scale = 2)
    private Double totalAmount;

    @Column(nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status paymentStatus = Status.PENDING;

    public enum Status {
        PENDING, PAID, FAILED
    }

    // Calculate total amount
    @PrePersist
    @PreUpdate
    public void calculateTotalAmount() {
        this.totalAmount = this.amount + this.extraAmount + this.tax - this.discount;
    }
}