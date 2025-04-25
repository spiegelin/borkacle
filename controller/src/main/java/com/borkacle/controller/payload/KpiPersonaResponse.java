package com.borkacle.controller.payload;

import java.util.List;

public class KpiPersonaResponse {
    private Long usuarioId;
    private String usuarioNombre;
    private List<SprintData> sprints;

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public String getUsuarioNombre() {
        return usuarioNombre;
    }

    public void setUsuarioNombre(String usuarioNombre) {
        this.usuarioNombre = usuarioNombre;
    }

    public List<SprintData> getSprints() {
        return sprints;
    }

    public void setSprints(List<SprintData> sprints) {
        this.sprints = sprints;
    }

    public static class SprintData {
        private Long sprintId;
        private String sprintNombre;
        private double horasEstimadas;
        private double horasReales;
        private int tareasCompletadas;
        private int tareasTotales;
        private double eficiencia;

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

        public double getHorasEstimadas() {
            return horasEstimadas;
        }

        public void setHorasEstimadas(double horasEstimadas) {
            this.horasEstimadas = horasEstimadas;
        }

        public double getHorasReales() {
            return horasReales;
        }

        public void setHorasReales(double horasReales) {
            this.horasReales = horasReales;
        }

        public int getTareasCompletadas() {
            return tareasCompletadas;
        }

        public void setTareasCompletadas(int tareasCompletadas) {
            this.tareasCompletadas = tareasCompletadas;
        }

        public int getTareasTotales() {
            return tareasTotales;
        }

        public void setTareasTotales(int tareasTotales) {
            this.tareasTotales = tareasTotales;
        }

        public double getEficiencia() {
            return eficiencia;
        }

        public void setEficiencia(double eficiencia) {
            this.eficiencia = eficiencia;
        }
    }
} 