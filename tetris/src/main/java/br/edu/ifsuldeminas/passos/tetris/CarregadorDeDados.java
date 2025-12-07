package br.edu.ifsuldeminas.passos.tetris;

import br.edu.ifsuldeminas.passos.tetris.model.Jogador;
import br.edu.ifsuldeminas.passos.tetris.repositories.JogadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class CarregadorDeDados implements CommandLineRunner {

    @Autowired
    private JogadorRepository jogadorRepository;

    @Override
    public void run(String... args) throws Exception {
        // Tenta achar o ID 1
        Optional<Jogador> jogadorPadrao = jogadorRepository.findById(1L);

        if (jogadorPadrao.isPresent()) {
            // Se já existe, muda o nome para Anônimo
            Jogador existente = jogadorPadrao.get();
            existente.setNomeUsuario("Anônimo");
            existente.setEmail("anonimo@arcade.com");
            jogadorRepository.save(existente);
            System.out.println("--- NOME DO ID 1 ATUALIZADO PARA ANÔNIMO ---");
        } else {
            // Se não existe, cria do zero
            Jogador novo = new Jogador();
            novo.setNomeUsuario("Anônimo");
            novo.setEmail("anonimo@arcade.com");
            novo.setSenha("123456");
            jogadorRepository.save(novo);
            System.out.println("--- JOGADOR ANÔNIMO CRIADO COM ID 1 ---");
        }
    }
}