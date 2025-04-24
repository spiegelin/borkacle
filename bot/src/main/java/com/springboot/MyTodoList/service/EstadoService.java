package com.springboot.MyTodoList.service;

import com.springboot.MyTodoList.model.Estado;
import com.springboot.MyTodoList.repository.EstadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EstadoService {

    @Autowired
    private EstadoRepository estadoRepository;

    public Estado findByNombre(String nombre) {
        Estado estado = estadoRepository.findByNombre(nombre);
        if (estado == null) {
            throw new RuntimeException("Estado not found with name: " + nombre);
        }
        return estado;
    }

    public Estado findById(Long id) {
        return estadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estado not found with id: " + id));
    }

    public List<Estado> findAll() {
        return estadoRepository.findAll();
    }
} 