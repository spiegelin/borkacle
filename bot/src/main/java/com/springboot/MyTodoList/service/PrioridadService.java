package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Prioridad;
import com.springboot.MyTodoList.repository.PrioridadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PrioridadService {

    @Autowired
    private PrioridadRepository prioridadRepository;

    public Prioridad findById(Long id) {
        return prioridadRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prioridad not found with id: " + id));
    }

    public Prioridad findByNombre(String nombre) {
        Prioridad prioridad = prioridadRepository.findByNombre(nombre);
        if (prioridad == null) {
            throw new RuntimeException("Prioridad not found with name: " + nombre);
        }
        return prioridad;
    }
} 