package br.edu.ifsuldeminas.passos.tetris.repositories;

import br.edu.ifsuldeminas.passos.tetris.model.Jogador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JogadorRepository extends JpaRepository<Jogador, Long> {

}