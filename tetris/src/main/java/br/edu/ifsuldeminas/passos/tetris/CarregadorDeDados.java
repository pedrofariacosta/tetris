package br.edu.ifsuldeminas.passos.tetris;

import br.edu.ifsuldeminas.passos.tetris.models.Jogador;
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
        // Verifica se já existe algum jogador, se não, cria o Player 1
        if (jogadorRepository.count() == 0) {
            Jogador user = new Jogador();
            user.setNomeUsuario("Player 1");
            user.setEmail("player1@email.com");
            user.setSenha("123456"); // Senha fictícia

            jogadorRepository.save(user);
            System.out.println("--- JOGADOR DE TESTE CRIADO COM ID 1 ---");
        }
    }
}