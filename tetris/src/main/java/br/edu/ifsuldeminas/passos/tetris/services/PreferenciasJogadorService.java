package br.edu.ifsuldeminas.passos.tetris.services;

import br.edu.ifsuldeminas.passos.tetris.model.PreferenciasJogador;
import br.edu.ifsuldeminas.passos.tetris.repositories.PreferenciasJogadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PreferenciasJogadorService {

    @Autowired
    private PreferenciasJogadorRepository repository;

    public PreferenciasJogador salvar(PreferenciasJogador preferencias) {
        return repository.save(preferencias);
    }

    public Optional<PreferenciasJogador> buscarPorId(Long id) {
        return repository.findById(id);
    }
}