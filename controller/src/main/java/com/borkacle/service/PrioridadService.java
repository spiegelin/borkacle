package com.borkacle.service;

import com.borkacle.model.Prioridad;
import com.borkacle.repository.PrioridadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

// Copied from bot service
@Service
public class PrioridadService {

    @Autowired
    private PrioridadRepository prioridadRepository;

    public Prioridad findById(Long id) {
        // Use orElseThrow or handle Optional appropriately for API context
        return prioridadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prioridad not found with id: " + id));
    }

    public Prioridad findByNombre(String nombre) {
        Prioridad prioridad = prioridadRepository.findByNombre(nombre);
        if (prioridad == null) {
            // Consider throwing a specific exception (e.g., NotFoundException) for APIs
            throw new RuntimeException("Prioridad not found with name: " + nombre);
        }
        return prioridad;
    }
} 