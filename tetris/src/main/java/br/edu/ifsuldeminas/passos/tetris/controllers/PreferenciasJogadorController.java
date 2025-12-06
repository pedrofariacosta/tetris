package br.edu.ifsuldeminas.passos.tetris.controllers;

import br.edu.ifsuldeminas.passos.tetris.model.PreferenciasJogador;
import br.edu.ifsuldeminas.passos.tetris.services.PreferenciasJogadorService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/preferencias")
public class PreferenciasJogadorController {

    @Autowired
    private PreferenciasJogadorService service;

    @PostMapping
    public PreferenciasJogador salvar(@Valid @RequestBody PreferenciasJogador preferencias) {
        return service.salvar(preferencias);
    }

    @GetMapping("/{id}")
    public Optional<PreferenciasJogador> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }
}