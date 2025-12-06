package br.edu.ifsuldeminas.passos.tetris.repositories;

import br.edu.ifsuldeminas.passos.tetris.model.PontuacaoRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PontuacaoRankingRepository extends JpaRepository<PontuacaoRanking, Long> {

}