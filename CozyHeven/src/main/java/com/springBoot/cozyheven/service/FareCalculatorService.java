package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.BookingGuestReqDto;
import com.springBoot.cozyheven.model.Room;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Calculates the final booking price.
 * Logic mirrors BookingPage.jsx exactly so the preview price == stored price.
 *
 * Rules:
 *   Base = room.basePrice × nights  (split equally per person in the party)
 *   Child under 5   → their share is FREE       (100% discount)
 *   Child age 5–11  → 50% off their share
 *   Child age 12–17 → 25% off their share
 *   Adults          → full share, no discount
 *   Tax             → 12% on the discounted subtotal
 */
@Service
public class FareCalculatorService {

    public double calculate(Room room,
                            List<BookingGuestReqDto> guests,
                            LocalDate checkIn,
                            LocalDate checkOut) {

        // nights — no ChronoUnit needed, plain LocalDate arithmetic
        long nights = checkOut.toEpochDay() - checkIn.toEpochDay();
        if (nights <= 0) nights = 1;

        int totalPeople = guests.size();
        if (totalPeople == 0) totalPeople = 1;

        double basePrice     = room.getBasePrice().doubleValue();
        double baseTotal     = basePrice * nights;
        double sharePerPerson = baseTotal / totalPeople;

        // Sum discounts for child guests only
        double totalDiscount = 0.0;
        for (BookingGuestReqDto g : guests) {
            if (g.age() < 18) {
                totalDiscount += sharePerPerson * discountFraction(g.age());
            }
        }

        double adjustedSubtotal = baseTotal - totalDiscount;
        double taxes            = Math.round(adjustedSubtotal * 0.12);
        double grandTotal       = Math.round(adjustedSubtotal) + taxes;

        return grandTotal;
    }

    /**
     * Returns the DISCOUNT fraction for a child guest.
     *   under 5  → 1.0  (free)
     *   5–11     → 0.5  (50% off)
     *   12–17    → 0.25 (25% off)
     *   18+      → 0.0  (adult, no discount)
     */
    private double discountFraction(int age) {
        if (age < 5)   return 1.0;
        if (age <= 11) return 0.5;
        if (age <= 17) return 0.25;
        return 0.0;
    }
}