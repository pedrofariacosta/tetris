package br.edu.ifsuldeminas.passos.tetris.services;

import br.edu.ifsuldeminas.passos.tetris.model.PontuacaoRanking;
import br.edu.ifsuldeminas.passos.tetris.repositories.PontuacaoRankingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PontuacaoRankingService {

    @Autowired
    private PontuacaoRankingRepository repository;

    public PontuacaoRanking salvar(PontuacaoRanking pontuacao) {
        return repository.save(pontuacao);
    }

    public List<PontuacaoRanking> listarTodos() {
        return repository.findAll();
    }
}