package com.borkacle.controller.payload;

import java.util.List;
import java.util.Map;

public class KpiResponse {
    private String equipoNombre;
    private Long equipoId;
    private List<SprintData> sprints;
    
    public static class SprintData {
        private Long sprintId;
        private String sprintNombre;
        private Double horasEstimadas;
        private Double horasReales;
        private Integer tareasCompletadas;
        private Integer tareasTotales;
        
        public Long getSprintId() {
            return sprintId;
        }
        
        public void setSprintId(Long sprintId) {
            this.sprintId = sprintId;
        }
        
        public String getSprintNombre() {
            return sprintNombre;
        }
        
        public void setSprintNombre(String sprintNombre) {
            this.sprintNombre = sprintNombre;
        }
        
        public Double getHorasEstimadas() {
            return horasEstimadas;
        }
        
        public void setHorasEstimadas(Double horasEstimadas) {
            this.horasEstimadas = horasEstimadas;
        }
        
        public Double getHorasReales() {
            return horasReales;
        }
        
        public void setHorasReales(Double horasReales) {
            this.horasReales = horasReales;
        }
        
        public Integer getTareasCompletadas() {
            return tareasCompletadas;
        }
        
        public void setTareasCompletadas(Integer tareasCompletadas) {
            this.tareasCompletadas = tareasCompletadas;
        }
        
        public Integer getTareasTotales() {
            return tareasTotales;
        }
        
        public void setTareasTotales(Integer tareasTotales) {
            this.tareasTotales = tareasTotales;
        }
    }
    
    public String getEquipoNombre() {
        return equipoNombre;
    }
    
    public void setEquipoNombre(String equipoNombre) {
        this.equipoNombre = equipoNombre;
    }
    
    public Long getEquipoId() {
        return equipoId;
    }
    
    public void setEquipoId(Long equipoId) {
        this.equipoId = equipoId;
    }
    
    public List<SprintData> getSprints() {
        return sprints;
    }
    
    public void setSprints(List<SprintData> sprints) {
        this.sprints = sprints;
    }
} 