package com.cabbooking.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
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
    private BigDecimal amount;

    @Column(precision = 10, scale = 2)
    private BigDecimal extraAmount = BigDecimal.ZERO;  // Additional charges

    @Column(precision = 5, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(precision = 5, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;

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
        this.totalAmount = amount.add(extraAmount).add(tax).subtract(discount);
    }
}
