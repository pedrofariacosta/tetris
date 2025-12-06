package br.edu.ifsuldeminas.passos.tetris.repositories;

import br.edu.ifsuldeminas.passos.tetris.models.Jogador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JogadorRepository extends JpaRepository<Jogador, Long> {
    // Novo método mágico: o Spring cria o SQL "SELECT * FROM Jogador WHERE nome = ?"
    Optional<Jogador> findByNomeUsuario(String nomeUsuario);
}