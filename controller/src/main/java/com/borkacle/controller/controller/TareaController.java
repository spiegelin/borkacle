package com.borkacle.controller.controller;

import com.borkacle.model.Estado;
import com.borkacle.model.Tarea;
import com.borkacle.repository.TareaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tareas")
public class TareaController {

    @Autowired
    private TareaRepository tareaRepository;

    @GetMapping("/board")
    public ResponseEntity<Map<String, Object>> getTareasForBoard() {
        try {
            // Obtener todas las tareas
            List<Tarea> tareas = tareaRepository.findAll();
            
            // Agrupar tareas por estado
            Map<Long, List<Tarea>> tareasPorEstadoId = tareas.stream()
                .collect(Collectors.groupingBy(tarea -> tarea.getEstado().getId()));
            
            // Crear la estructura de respuesta
            Map<String, Object> response = new HashMap<>();
            
            // Mapear los IDs de estado a sus nombres (según los estados mencionados)
            Map<Long, String> estadosMap = new HashMap<>();
            estadosMap.put(1L, "En proceso");
            estadosMap.put(3L, "Pendiente");
            estadosMap.put(4L, "En revision");
            estadosMap.put(5L, "Bloqueado");
            estadosMap.put(6L, "Completado");
            estadosMap.put(7L, "Cancelado");
            
            // Construir la respuesta con los estados y sus tareas
            Map<String, List<Map<String, Object>>> columnas = new HashMap<>();
            
            for (Map.Entry<Long, String> estado : estadosMap.entrySet()) {
                Long estadoId = estado.getKey();
                String estadoNombre = estado.getValue();
                
                List<Tarea> tareasEstado = tareasPorEstadoId.getOrDefault(estadoId, List.of());
                
                // Convertir cada tarea a un mapa con los campos necesarios para el frontend
                List<Map<String, Object>> tareasMapeadas = tareasEstado.stream()
                    .map(tarea -> {
                        Map<String, Object> tareaMap = new HashMap<>();
                        tareaMap.put("id", tarea.getId());
                        tareaMap.put("codigo", "ORA-" + tarea.getId());
                        tareaMap.put("title", tarea.getTitulo());
                        tareaMap.put("type", tarea.getTipo() != null ? tarea.getTipo().toLowerCase() : "task");
                        
                        // Mapear prioridad
                        String prioridad = "medium";
                        if (tarea.getPrioridad() != null) {
                            Long prioridadId = tarea.getPrioridad().getId();
                            if (prioridadId == 1L) prioridad = "highest";
                            else if (prioridadId == 2L) prioridad = "high";
                            else if (prioridadId == 3L) prioridad = "medium";
                            else if (prioridadId == 4L) prioridad = "low";
                            else if (prioridadId == 5L) prioridad = "lowest";
                        }
                        tareaMap.put("priority", prioridad);
                        
                        // Mapear el estado según el ID
                        String estadoKey;
                        switch (estadoId.intValue()) {
                            case 1: estadoKey = "inProgress"; break;
                            case 3: estadoKey = "todo"; break;
                            case 4: estadoKey = "review"; break;
                            case 5: estadoKey = "blocked"; break;
                            case 6: estadoKey = "done"; break;
                            case 7: estadoKey = "cancelled"; break;
                            default: estadoKey = "todo"; break;
                        }
                        tareaMap.put("status", estadoKey);
                        
                        // Información del asignado
                        if (tarea.getAsignadoA() != null) {
                            Map<String, Object> assignee = new HashMap<>();
                            assignee.put("name", tarea.getAsignadoA().getNombre());
                            assignee.put("initials", getInitials(tarea.getAsignadoA().getNombre()));
                            tareaMap.put("assignee", assignee);
                        }
                        
                        return tareaMap;
                    })
                    .collect(Collectors.toList());
                
                // Crear la estructura de columna
                Map<String, Object> columna = new HashMap<>();
                
                // Determinar la clave de columna según el estado
                String columnaKey;
                switch (estadoId.intValue()) {
                    case 1: columnaKey = "inProgress"; break;
                    case 3: columnaKey = "todo"; break;
                    case 4: columnaKey = "review"; break;
                    case 5: columnaKey = "blocked"; break;
                    case 6: columnaKey = "done"; break;
                    case 7: columnaKey = "cancelled"; break;
                    default: columnaKey = "todo"; break;
                }
                
                // Agregar todas las columnas 
                columnas.put(columnaKey, tareasMapeadas);
            }
            
            response.put("columns", columnas);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error al obtener las tareas: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstadoTarea(@PathVariable Long id, @RequestBody Map<String, Long> payload) {
        try {
            Long estadoId = payload.get("estadoId");
            
            if (estadoId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "El ID del estado es requerido"));
            }
            
            Optional<Tarea> tareaOpt = tareaRepository.findById(id);
            
            if (tareaOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            Tarea tarea = tareaOpt.get();
            
            // Crear nuevo Estado
            Estado nuevoEstado = new Estado();
            nuevoEstado.setId(estadoId);
            
            // Actualizar la tarea
            tarea.setEstado(nuevoEstado);
            tarea.setFechaActualizacion(OffsetDateTime.now());
            
            // Guardar cambios
            tareaRepository.save(tarea);
            
            return ResponseEntity.ok(Map.of(
                "id", tarea.getId(),
                "estadoId", estadoId,
                "mensaje", "Estado actualizado correctamente"
            ));
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Error al actualizar el estado: " + e.getMessage()));
        }
    }
    
    // Método auxiliar para obtener iniciales
    private String getInitials(String name) {
        if (name == null || name.isBlank()) {
            return "??";
        }
        
        String[] parts = name.split("\\s+");
        if (parts.length == 1) {
            return name.substring(0, Math.min(2, name.length())).toUpperCase();
        }
        
        return (parts[0].charAt(0) + "" + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
} 