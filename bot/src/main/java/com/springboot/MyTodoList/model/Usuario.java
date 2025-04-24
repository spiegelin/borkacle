package com.springboot.MyTodoList.model;

import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "USUARIOS")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    @Column(name = "NOMBRE")
    private String nombre;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "PASSWORD_HASH")
    private String passwordHash;

    @Column(name = "MFA_ENABLED")
    private String mfaEnabled;

    @Column(name = "MFA_TOTP_SECRET")
    private String mfaTotpSecret;

    @Column(name = "ROL")
    private String rol;

    @Column(name = "FECHA_REGISTRO")
    private OffsetDateTime fechaRegistro;

    @Column(name = "TELEGRAM_ID")
    private String telegramId;

    @ManyToOne
    @JoinColumn(name = "EQUIPO_ID")
    private Equipo equipo;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getMfaEnabled() {
        return mfaEnabled;
    }

    public void setMfaEnabled(String mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public String getMfaTotpSecret() {
        return mfaTotpSecret;
    }

    public void setMfaTotpSecret(String mfaTotpSecret) {
        this.mfaTotpSecret = mfaTotpSecret;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public OffsetDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(OffsetDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getTelegramId() {
        return telegramId;
    }

    public void setTelegramId(String telegramId) {
        this.telegramId = telegramId;
    }

    public Equipo getEquipo() {
        return equipo;
    }

    public void setEquipo(Equipo equipo) {
        this.equipo = equipo;
    }
} 