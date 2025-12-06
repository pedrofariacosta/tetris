package br.edu.ifsuldeminas.passos.tetris.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

@Entity
public class Tabuleiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int largura;
    private int altura;

    private String grid;

    @OneToOne
    private Tetrimino pecaAtual;

    @OneToOne
    private Tetrimino proximaPeca;

    public void atualizarPosicao() {}
    public void verificarColisao() {}
    public void removerLinhasCompletas() {}

    // Getters e Setters

    public int getLargura() {
        return largura;
    }

    public void setLargura(int largura) {
        this.largura = largura;
    }

    public int getAltura() {
        return altura;
    }

    public void setAltura(int altura) {
        this.altura = altura;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGrid() {
        return grid;
    }

    public void setGrid(String grid) {
        this.grid = grid;
    }

    public Tetrimino getPecaAtual() {
        return pecaAtual;
    }

    public void setPecaAtual(Tetrimino pecaAtual) {
        this.pecaAtual = pecaAtual;
    }

    public Tetrimino getProximaPeca() {
        return proximaPeca;
    }

    public void setProximaPeca(Tetrimino proximaPeca) {
        this.proximaPeca = proximaPeca;
    }
}