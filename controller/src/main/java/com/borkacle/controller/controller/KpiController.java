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
    
    @GetMapping("/persona")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<KpiPersonaResponse>> getKpiPersonaData() {
        try {
            logger.info("KpiController: Inicio de solicitud getKpiPersonaData");
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            logger.info("KpiController: Usuario autenticado: {}", auth.getName());
            
            List<KpiPersonaResponse> result = new ArrayList<>();
            
            // Obtener todos los usuarios
            List<Usuario> usuarios = usuarioRepository.findAll();
            logger.info("KpiController: Usuarios encontrados: {}", usuarios.size());
            
            // Obtener todos los sprints
            List<Sprint> sprints = sprintRepository.findAll();
            logger.info("KpiController: Sprints encontrados: {}", sprints.size());
            
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
                    
                    // Obtener tareas del usuario en el sprint
                    List<Tarea> tareas = tareaRepository.findByUsuarioIdAndSprintId(usuario.getId(), sprint.getId());
                    logger.info("KpiController: Tareas encontradas para usuario {} y sprint {}: {}", 
                              usuario.getNombre(), sprint.getNombre(), tareas.size());
                    
                    // Mostrar detalles de cada tarea para depuración
                    for (Tarea t : tareas) {
                        logger.info("Tarea: ID={}, Título={}, TiempoEstimado={}, TiempoReal={}",
                                 t.getId(), t.getTitulo(), t.getTiempoEstimado(), t.getTiempoReal());
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
                            .filter(t -> t.getEstado() != null && "Completada".equals(t.getEstado().getNombre()))
                            .count();
                    
                    // Calcular la eficiencia (si las horas estimadas > 0)
                    double eficiencia = horasEstimadas > 0 ? (horasEstimadas / horasReales) * 100 : 0;
                    
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