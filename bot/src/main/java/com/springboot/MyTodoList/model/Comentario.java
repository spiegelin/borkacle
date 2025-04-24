package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "COMENTARIOS")
public class Comentario {
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

    @Column(name = "COMENTARIO", columnDefinition = "CLOB")
    private String comentario;

    @Column(name = "FECHA")
    private OffsetDateTime fecha;

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

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }

    public OffsetDateTime getFecha() {
        return fecha;
    }

    public void setFecha(OffsetDateTime fecha) {
        this.fecha = fecha;
    }
} 