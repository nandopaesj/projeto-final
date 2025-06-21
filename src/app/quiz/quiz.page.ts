import { IPerguntas } from './../model/IPerguntas';
import { IJogador } from './../model/IJogador';
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AndamentoService } from '../services/andamento.service';
import { ToastController, AlertController } from '@ionic/angular';
import { waitForAsync } from '@angular/core/testing';
import { RankingService } from '../services/ranking.service';

@Component({
  selector: 'app-quiz',
  templateUrl: 'quiz.page.html',
  styleUrls: ['quiz.page.scss'],
  standalone: false,
})

export class QuizPage {

  jogador: IJogador = { nome: "", pontuacao: 0 };

  constructor(
    private router: Router,
    private andamentoService: AndamentoService,
    private alertController: AlertController,
    private toastController: ToastController,
    private rankingService: RankingService
  ) {}


  async ngOnInit()
  {
  const jogadorSalvo = await this.andamentoService.obterAndamento();

    if (!jogadorSalvo || !jogadorSalvo.nome?.trim())
    {
      const alert = await this.alertController.create(
      {
        header: 'Erro',
        message: 'Nenhum jogador ativo encontrado.',
        buttons: ['OK']
      });
    await alert.present();
    this.router.navigateByUrl('/tabs/home');
    return;
    }

    this.jogador = jogadorSalvo;
  }

  listaPerguntas: IPerguntas[] =
  [
    {
      enunciado: "Qual é a capital do Butão?",
      respostaCorreta: 2,
      respostas: ['Katmandu', 'Vientiane', 'Thimphu', 'Colombo'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Qual elemento químico tem o símbolo 'W'?",
      respostaCorreta: 1,
      respostas: ['Prata', 'Tungstênio', 'Zinco', 'Cobre'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Em que ano a internet foi criada?",
      respostaCorreta: 0,
      respostas: ['1969', '2001', '1985', '1995'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Qual é o maior planeta do sistema solar?",
      respostaCorreta: 3,
      respostas: ['Saturno', 'Urano', 'Netuno', 'Júpiter'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Quem pintou a obra 'A Noite Estrelada'?",
      respostaCorreta: 2,
      respostas: ['Pablo Picasso', 'Claude Monet', 'Vincent van Gogh', 'Leonardo da Vinci'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Qual animal é conhecido por ter a mordida mais forte?",
      respostaCorreta: 0,
      respostas: ['Crocodilo-do-nilo', 'Leão', 'Tigre', 'Urso-pardo'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Qual idioma é falado na Etiópia?",
      respostaCorreta: 1,
      respostas: ['Suaíli', 'Amárico', 'Zulu', 'Hausa'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Quem foi o primeiro humano a orbitar a Terra?",
      respostaCorreta: 0,
      respostas: ['Yuri Gagarin', 'Neil Armstrong', 'Buzz Aldrin', 'Alan Shepard'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Qual é a fórmula química da água?",
      respostaCorreta: 3,
      respostas: ['CO₂', 'O₂', 'NaCl', 'H₂O'],
      valor: 1000,
      respondido: false
    },
    {
      enunciado: "Qual dessas montanhas é a mais alta do mundo?",
      respostaCorreta: 1,
      respostas: ['K2', 'Monte Everest', 'Kangchenjunga', 'Lhotse'],
      valor: 1000,
      respondido: false
    }
  ];

  respostasSelecionadas: number[] = [];

  async terminarQuiz()
  {
    waitForAsync(this.ngOnInit);
    // Verifica se todas as perguntas foram respondidas
    if (this.respostasSelecionadas.length < this.listaPerguntas.length ||
        this.respostasSelecionadas.some(resposta => resposta === undefined)) {
        const toast = await this.toastController.create({
          message: 'Responda todas as perguntas antes de finalizar o quiz.',
          duration: 2000,
          color: 'warning'
        });
      await toast.present();
      return;
    }

    // Calcula pontuação
    let pontuacao = 0;
    this.jogador.pontuacao = 0;

    for (let i = 0; i < this.listaPerguntas.length; i++) {
      const pergunta = this.listaPerguntas[i];
      const respostaSelecionada = this.respostasSelecionadas[i];

      if (respostaSelecionada === pergunta.respostaCorreta) {
        pontuacao += pergunta.valor;
        pergunta.respondido = true;
      }
    }

    this.jogador.pontuacao = pontuacao;
    await this.andamentoService.atualizarJogador(this.jogador);

    const alert = await this.alertController.create({
      header: 'Quiz Finalizado',
      message: `Você marcou ${pontuacao} pontos.`,
      buttons: ['OK']
    });

    await alert.present();
    this.router.navigateByUrl('/tabs/home');
    await this.rankingService.adicionarColocado(this.jogador);
    this.andamentoService.finalizarJogo();
  }
}
