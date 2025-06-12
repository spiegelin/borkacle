package com.borkacle.controller.controller;

import com.borkacle.controller.payload.KpiResponse;
import com.borkacle.controller.payload.KpiPersonaResponse;
import com.borkacle.model.Equipo;
import com.borkacle.model.Sprint;
import com.borkacle.model.Tarea;
import com.borkacle.model.Usuario;
import com.borkacle.repository.EquipoRepository;
import com.borkacle.repository.SprintRepository;
import com.borkacle.repository.TareaRepository;
import com.borkacle.repository.UsuarioRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    
    @Autowired
    private UsuarioRepository usuarioRepository;

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
                    logger.info("KpiController: Tareas encontradas para equipo {} y sprint {}: {}", 
                              equipo.getNombre(), sprint.getNombre(), tareas.size());
                    
                    // Mostrar detalles de cada tarea para depuración
                    for (Tarea t : tareas) {
                        logger.info("Tarea: ID={}, Título={}, TiempoEstimado={}, TiempoReal={}, Equipo={}",
                                 t.getId(), t.getTitulo(), t.getTiempoEstimado(), t.getTiempoReal(), 
                                 t.getAsignadoA() != null && t.getAsignadoA().getEquipo() != null ? 
                                 t.getAsignadoA().getEquipo().getNombre() : "sin equipo");
                    }
                    
                    // Calcular horas estimadas y reales
                    double horasEstimadas = tareas.stream()
                            .mapToDouble(t -> t.getTiempoEstimado() != null ? t.getTiempoEstimado() : 0)
                            .sum();
                    
                    double horasReales = tareas.stream()
                            .mapToDouble(t -> t.getTiempoReal() != null ? t.getTiempoReal() : 0)
                            .sum();
                    
                    // Contar tareas completadas
                    long tareasCompletadas = tareas.stream()
                            .filter(t -> t.getEstado() != null
                                && t.getEstado().getNombre() != null
                                && t.getEstado().getNombre().toLowerCase().contains("complet"))
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
    
    @GetMapping("/persona")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<KpiPersonaResponse>> getKpiPersonaData() {
        try {
            logger.info("KpiController: Inicio de solicitud getKpiPersonaData");
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            logger.info("KpiController: Usuario autenticado: {}", auth.getName());
            
            // Obtener todos los usuarios y sprints en una sola consulta
            List<Usuario> usuarios = usuarioRepository.findAll();
            List<Sprint> sprints = sprintRepository.findAll();
            
            // Obtener todas las tareas con sus relaciones cargadas
            List<Tarea> todasLasTareas = tareaRepository.findAllWithRelations();
            
            // Crear un mapa para acceso rápido a las tareas por usuario y sprint
            Map<Long, Map<Long, List<Tarea>>> tareasPorUsuarioYSprint = todasLasTareas.stream()
                .filter(t -> t.getAsignadoA() != null && t.getSprint() != null)
                .collect(Collectors.groupingBy(
                    t -> t.getAsignadoA().getId(),
                    Collectors.groupingBy(t -> t.getSprint().getId())
                ));
            
            List<KpiPersonaResponse> result = new ArrayList<>();
            
            // Para cada usuario, calcular KPIs por sprint
            for (Usuario usuario : usuarios) {
                KpiPersonaResponse kpiResponse = new KpiPersonaResponse();
                kpiResponse.setUsuarioId(usuario.getId());
                kpiResponse.setUsuarioNombre(usuario.getNombre());
                
                List<KpiPersonaResponse.SprintData> sprintDataList = new ArrayList<>();
                
                for (Sprint sprint : sprints) {
                    KpiPersonaResponse.SprintData sprintData = new KpiPersonaResponse.SprintData();
                    sprintData.setSprintId(sprint.getId());
                    sprintData.setSprintNombre(sprint.getNombre());
                    
                    // Obtener tareas del usuario en el sprint del mapa
                    List<Tarea> tareas = tareasPorUsuarioYSprint
                        .getOrDefault(usuario.getId(), new HashMap<>())
                        .getOrDefault(sprint.getId(), new ArrayList<>());
                    
                    // Calcular métricas
                    double horasEstimadas = tareas.stream()
                            .mapToDouble(t -> t.getTiempoEstimado() != null ? t.getTiempoEstimado() : 0)
                            .sum();
                    
                    double horasReales = tareas.stream()
                            .mapToDouble(t -> t.getTiempoReal() != null ? t.getTiempoReal() : 0)
                            .sum();
                    
                    long tareasCompletadas = tareas.stream()
                            .filter(t -> t.getEstado() != null
                                && t.getEstado().getNombre() != null
                                && t.getEstado().getNombre().toLowerCase().contains("complet"))
                            .count();
                    
                    double eficiencia = horasReales > 0 ? (horasEstimadas / horasReales) * 100 : 0;
                    
                    sprintData.setHorasEstimadas(horasEstimadas);
                    sprintData.setHorasReales(horasReales);
                    sprintData.setTareasCompletadas((int) tareasCompletadas);
                    sprintData.setTareasTotales(tareas.size());
                    sprintData.setEficiencia(eficiencia);
                    
                    sprintDataList.add(sprintData);
                }
                
                kpiResponse.setSprints(sprintDataList);
                result.add(kpiResponse);
            }
            
            logger.info("KpiController: Respuesta por persona generada con éxito. Usuarios procesados: {}", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            logger.error("KpiController: Error al procesar solicitud de KPI por persona", e);
            throw e;
        }
    }
} 