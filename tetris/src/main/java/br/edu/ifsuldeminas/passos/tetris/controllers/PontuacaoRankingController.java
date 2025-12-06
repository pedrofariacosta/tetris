package br.edu.ifsuldeminas.passos.tetris.controllers;

import br.edu.ifsuldeminas.passos.tetris.model.PontuacaoRanking;
import br.edu.ifsuldeminas.passos.tetris.services.PontuacaoRankingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ranking")
public class PontuacaoRankingController {

    @Autowired
    private PontuacaoRankingService service;

    @PostMapping
    public PontuacaoRanking salvar(@Valid @RequestBody PontuacaoRanking pontuacao) {
        return service.salvar(pontuacao);
    }

    @GetMapping
    public List<PontuacaoRanking> listarRanking() {
        return service.listarTodos();
    }
}