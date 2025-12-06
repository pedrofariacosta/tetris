package br.edu.ifsuldeminas.passos.tetris.services;

import br.edu.ifsuldeminas.passos.tetris.model.Jogador;
import br.edu.ifsuldeminas.passos.tetris.repositories.JogadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JogadorService {

    @Autowired
    private JogadorRepository repository;

    //salva ou atualiza um jogador
    public Jogador salvar(Jogador jogador) {
        return repository.save(jogador);
    }

    //lista todos os jogadores
    public List<Jogador> listarTodos() {
        return repository.findAll();
    }

    //busca um jogador pelo id
    public Optional<Jogador> buscarPorId(Long id) {
        return repository.findById(id);
    }

    //deleta um jogador
    public void deletar(Long id) {
        repository.deleteById(id);
    }
}