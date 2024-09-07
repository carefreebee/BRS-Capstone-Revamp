package com.brscapstone1.brscapstone1.Controller;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.brscapstone1.brscapstone1.DTO.ReservedDateDTO;
import com.brscapstone1.brscapstone1.Entity.ReservationEntity;
import com.brscapstone1.brscapstone1.Service.ReservationService;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@RestController
@CrossOrigin
public class ReservationController {

    @Autowired
    private ReservationService resServ;

    //[POST] approved reservations by HEAD
    @PostMapping("/user/reservations/head-approve/{reservationId}")
    public ResponseEntity<String> headApproveReservation(@PathVariable int reservationId) {
        try {
            resServ.headApproveReservation(reservationId);
            return ResponseEntity.ok("Reservation approved by Head of the Department successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to approve reservation: " + e.getMessage());
        }
    }

    //[POST] approved reservations by OPC
    @PostMapping("/user/reservations/opc-approve/{reservationId}")
    public ResponseEntity<String> opcApproveReservation(@PathVariable int reservationId, @RequestParam int driverId, @RequestParam String driverName) {
        try {
            resServ.opcApproveReservation(reservationId, driverId, driverName);
            return ResponseEntity.ok("Reservation approved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to approve reservation: " + e.getMessage());
        }
    }

    //[isRejected] rejects a reservation and returns boolean output
    @PostMapping("/user/reservations/reject/{reservationId}")
    public ResponseEntity<String> rejectReservation(@PathVariable int reservationId, @RequestBody String feedback) {
        try {
            resServ.rejectReservation(reservationId, feedback);
            return ResponseEntity.ok("Reservation rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to reject reservation: " + e.getMessage());
        }
    }

    //[POST] || submits a reservation
    @PostMapping("/user/reservations/add")
    public ReservationEntity addReservation(@RequestParam("userName") String userName, @RequestParam(value = "file", required = false) MultipartFile file, @RequestParam("reservation") String reservationJson) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false); 
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false); 
        objectMapper.registerModule(new JavaTimeModule());
        ReservationEntity reservation = objectMapper.readValue(reservationJson, ReservationEntity.class);
        return resServ.saveReservation(userName, reservation, file);
    }

    //[GET] all Reservations
    @GetMapping("/reservations/getAll")
    public List<ReservationEntity> getAllReservations() {
        return resServ.getAllReservations();
    }

    //[GET] Reservation by ID
    @GetMapping("/user/reservations/id/{id}")
    public ReservationEntity getReservationById(@PathVariable("id") int id) {
        return resServ.getReservationById(id);
    }

    //[GET] all user's reservations
    @GetMapping("/user/reservations/{userName}")
    public ResponseEntity<List<ReservationEntity>> getUserReservations(@PathVariable String userName) {
      try {
        List<ReservationEntity> userReservations = resServ.getUserReservations(userName);
        return ResponseEntity.ok(userReservations);
      } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }
    }

     //[POST] || update assigned driver
     @PostMapping("/user/reservations/update-driver/{reservationId}")
     public ResponseEntity<String> updateAssignedDriver(@PathVariable int reservationId, @RequestParam int driverId, @RequestParam String assignedDriverName) {
         try {
             resServ.updateAssignedDriver(reservationId, driverId, assignedDriverName);
             return ResponseEntity.ok("Assigned driver updated successfully");
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update assigned driver: " + e.getMessage());
         }
     }
     
    //[PUT] update reservation
    @PutMapping("/reservations/update/{reservationId}")
    public ResponseEntity<ReservationEntity> updateReservation(@PathVariable int reservationId, 
                                                                @RequestParam(value = "file", required = false) MultipartFile file,
                                                                @RequestParam("reservation") String reservationJson) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ReservationEntity updatedReservation = objectMapper.readValue(reservationJson, ReservationEntity.class);
            ReservationEntity updatedEntity = resServ.updateReservation(reservationId, updatedReservation, file);
            return ResponseEntity.ok(updatedEntity);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (IllegalArgumentException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //[GET] all OPC approved
    @GetMapping("/reservations/opc-approved")
    public List<ReservationEntity> getOpcApprovedReservations() {
        return resServ.getOpcApprovedReservation();
    }

    //[GET] all reservations that is approved by HEAD
    @GetMapping("/reservations/head-approved")
    public List<ReservationEntity> getApprovedReservations() {
        return resServ.getHeadApprovedReservations();
    }

    @GetMapping("/reservations/reserved-dates")
    public ResponseEntity<List<ReservedDateDTO>> getReservedDates() {
        List<ReservedDateDTO> reservedDateDTOs = resServ.getReservedDates();
        return ResponseEntity.ok(reservedDateDTOs);
    }

    @GetMapping("/reservations/check-vehicle")
    public ResponseEntity<List<ReservedDateDTO>> checkVehicleReservation(
        @RequestParam String plateNumber,
        @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate date) {

        List<ReservedDateDTO> filteredDates = resServ.getReservedDates(plateNumber, date);
        return ResponseEntity.ok(filteredDates);
    }
}
