package com.brscapstone1.brscapstone1.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.brscapstone1.brscapstone1.Entity.VehicleEntity;
import com.brscapstone1.brscapstone1.Repository.VehicleRepository;
import com.brscapstone1.brscapstone1.Service.VehicleService;

@RestController
@CrossOrigin
@RequestMapping("/vehicle")
public class VehicleController {
  
  @Autowired
  VehicleService vehicleService;

  @Autowired
  VehicleRepository vehicleRepository;

  @PostMapping("/post")
  public VehicleEntity post(
      @RequestParam("vehicleType") String vehicleType,
      @RequestParam("plateNumber") String plateNumber,
      @RequestParam("capacity") int capacity) {
    
    VehicleEntity vehicle = new VehicleEntity(vehicleType, plateNumber, capacity, "Available");
    return vehicleRepository.save(vehicle);
  }

  @GetMapping("/vehicles")
  public List<VehicleEntity> vehicles(){
    return vehicleService.vehicles();
  }

  @PutMapping("/update/{id}")
  public VehicleEntity update(@PathVariable int id, @RequestBody VehicleEntity newVehicle){
    return vehicleService.update(id, newVehicle);
  }

  @DeleteMapping("/delete/{id}")
  public String delete(@PathVariable int id){
    return vehicleService.delete(id);
  }
}

