package br.edu.ifsuldeminas.passos.tetris.controllers;

import br.edu.ifsuldeminas.passos.tetris.model.Jogador;
import br.edu.ifsuldeminas.passos.tetris.services.JogadorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/jogadores")
public class JogadorController {

    @Autowired
    private JogadorService service;

    //salva um novo jogador
    @PostMapping
    public Jogador criar(@Valid @RequestBody Jogador jogador) {
        return service.salvar(jogador);
    }

    //lista todos
    @GetMapping
    public List<Jogador> listar() {
        return service.listarTodos();
    }

    //buscar um só pelo id
    @GetMapping("/{id}")
    public Optional<Jogador> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    //apagar
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}