package com.borkacle.controller.controller;

import com.borkacle.controller.payload.KpiResponse;
import com.borkacle.model.Equipo;
import com.borkacle.model.Sprint;
import com.borkacle.model.Tarea;
import com.borkacle.repository.EquipoRepository;
import com.borkacle.repository.SprintRepository;
import com.borkacle.repository.TareaRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/kpi")
public class KpiController {

    private static final Logger logger = LoggerFactory.getLogger(KpiController.class);

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private EquipoRepository equipoRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<KpiResponse>> getKpiData() {
        try {
            logger.info("KpiController: Inicio de solicitud getKpiData");
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            logger.info("KpiController: Usuario autenticado: {}, Roles: {}", 
                      auth.getName(), 
                      auth.getAuthorities().stream().map(a -> a.getAuthority()).collect(Collectors.joining(", ")));
            
            List<KpiResponse> result = new ArrayList<>();
            
            // Obtener todos los equipos
            List<Equipo> equipos = equipoRepository.findAll();
            logger.info("KpiController: Equipos encontrados: {}", equipos.size());
            
            // Obtener todos los sprints
            List<Sprint> sprints = sprintRepository.findAll();
            logger.info("KpiController: Sprints encontrados: {}", sprints.size());
            
            // Para cada equipo, calcular KPIs por sprint
            for (Equipo equipo : equipos) {
                KpiResponse kpiResponse = new KpiResponse();
                kpiResponse.setEquipoId(equipo.getId());
                kpiResponse.setEquipoNombre(equipo.getNombre());
                
                List<KpiResponse.SprintData> sprintDataList = new ArrayList<>();
                
                for (Sprint sprint : sprints) {
                    KpiResponse.SprintData sprintData = new KpiResponse.SprintData();
                    sprintData.setSprintId(sprint.getId());
                    sprintData.setSprintNombre(sprint.getNombre());
                    
                    // Obtener tareas del equipo en el sprint
                    List<Tarea> tareas = tareaRepository.findByEquipoIdAndSprintId(equipo.getId(), sprint.getId());
                    logger.debug("KpiController: Tareas encontradas para equipo {} y sprint {}: {}", 
                              equipo.getNombre(), sprint.getNombre(), tareas.size());
                    
                    // Calcular horas estimadas y reales
                    double horasEstimadas = tareas.stream()
                            .mapToDouble(t -> t.getTiempoEstimado() != null ? t.getTiempoEstimado() : 0)
                            .sum();
                    
                    double horasReales = tareas.stream()
                            .mapToDouble(t -> t.getTiempoReal() != null ? t.getTiempoReal() : 0)
                            .sum();
                    
                    // Contar tareas completadas
                    long tareasCompletadas = tareas.stream()
                            .filter(t -> t.getEstado() != null && "Completada".equals(t.getEstado().getNombre()))
                            .count();
                    
                    sprintData.setHorasEstimadas(horasEstimadas);
                    sprintData.setHorasReales(horasReales);
                    sprintData.setTareasCompletadas((int) tareasCompletadas);
                    sprintData.setTareasTotales(tareas.size());
                    
                    sprintDataList.add(sprintData);
                }
                
                kpiResponse.setSprints(sprintDataList);
                result.add(kpiResponse);
            }
            
            logger.info("KpiController: Respuesta generada con éxito. Equipos procesados: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("KpiController: Error al procesar solicitud", e);
            throw e;
        }
    }
} 