package br.edu.ifsuldeminas.passos.tetris.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.validation.constraints.NotBlank;

@Entity
public class PreferenciasJogador {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "A velocidade do jogo é obrigatória")
    private String velocidadeJogo;

    @NotBlank(message = "O tema de cores é obrigatório")
    private String temaCores;
    private boolean mostrarProximaPeca;

    // relacionamento 1 pra 1 com Jogador
    @OneToOne
    private Jogador jogador;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVelocidadeJogo() {
        return velocidadeJogo;
    }

    public void setVelocidadeJogo(String velocidadeJogo) {
        this.velocidadeJogo = velocidadeJogo;
    }

    public String getTemaCores() {
        return temaCores;
    }

    public void setTemaCores(String temaCores) {
        this.temaCores = temaCores;
    }

    public boolean isMostrarProximaPeca() {
        return mostrarProximaPeca;
    }

    public void setMostrarProximaPeca(boolean mostrarProximaPeca) {
        this.mostrarProximaPeca = mostrarProximaPeca;
    }

    public Jogador getJogador() {
        return jogador;
    }

    public void setJogador(Jogador jogador) {
        this.jogador = jogador;
    }
}