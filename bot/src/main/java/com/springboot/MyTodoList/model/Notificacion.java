package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "NOTIFICACIONES")
public class Notificacion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "TAREA_ID")
    private Tarea tarea;

    @ManyToOne
    @JoinColumn(name = "USUARIO_ID")
    private Usuario usuario;

    @Column(name = "DESCRIPCION")
    private String descripcion;

    @Column(name = "FECHA_ENVIO")
    private OffsetDateTime fechaEnvio;

    @Column(name = "LEIDO")
    private String leido;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Tarea getTarea() {
        return tarea;
    }

    public void setTarea(Tarea tarea) {
        this.tarea = tarea;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public OffsetDateTime getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(OffsetDateTime fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public String getLeido() {
        return leido;
    }

    public void setLeido(String leido) {
        this.leido = leido;
    }
} 