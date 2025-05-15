package com.borkacle.service;

import com.borkacle.model.Estado;
import com.borkacle.repository.EstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

// Copied from bot service
@Service
public class EstadoService {

    @Autowired
    private EstadoRepository estadoRepository;

    public Estado findByNombre(String nombre) {
        Estado estado = estadoRepository.findByNombre(nombre);
        if (estado == null) {
            // Consider throwing a specific exception (e.g., NotFoundException) for APIs
            throw new RuntimeException("Estado not found with name: " + nombre);
        }
        return estado;
    }

    public Estado findById(Long id) {
        // Use orElseThrow or handle Optional appropriately for API context
        return estadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado not found with id: " + id));
    }

    public List<Estado> findAll() {
        return estadoRepository.findAll();
    }
} 