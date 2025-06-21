import { IJogador } from './../model/IJogador';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AndamentoService } from '../services/andamento.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})

export class HomePage
{

  constructor(public router: Router, private andamentoService: AndamentoService, private alertController: AlertController, private toastController: ToastController) { }

  nomeInput: string = "";

  jogadorSalvo: IJogador | null = null;
  jogadorAtivo: IJogador | null = null;

  async ngOnInit() {
    await this.carregarAndamento();

    if (!this.jogadorSalvo || !this.jogadorSalvo.nome || this.jogadorSalvo.nome.trim() === "") {
      this.jogadorAtivo = {nome: "", pontuacao: 0};
    } else
    {
      this.nomeInput = this.jogadorSalvo.nome;
      this.exibirAlertaJogo();
    }
  }

  async carregarAndamento()
  {
    this.jogadorSalvo = await this.andamentoService.obterAndamento();
  }

  async exibirAlertaJogo()
  {
    const alert = await this.alertController.create({
      header: 'JOGO EM ANDAMENTO',
      message: `Você já iniciou um jogo, deseja começar de novo? (Seu progresso será interrompido)`,
      buttons: [
        {
          text: `Não, CONTINUAR COMO: ${this.jogadorSalvo?.nome}`,
          role: 'cancel',
          handler: () => {
            this.jogadorAtivo = this.jogadorSalvo;
            this.router.navigateByUrl(`/tabs/quiz`);
          }
        },
        {
          text: 'Sim, REINICIAR',
          handler: () => {
            this.nomeInput = "";
            this.jogadorAtivo = { nome: "", pontuacao: 0 };
            this.router.navigateByUrl('/tabs/home');
            this.andamentoService.atualizarJogador(this.jogadorAtivo);
          }
        }
      ]
    });

    await alert.present();
    await alert.onDidDismiss();
  }


    async iniciarQuiz()
    {
      if (!this.nomeInput || this.nomeInput.trim() === "") {
        const toast = await this.toastController.create({
          message: 'Por favor, insira seu nome para iniciar.',
          duration: 1000,
          color: 'danger'
        });
        await toast.present();
        return;
      }

      const novoJogador: IJogador = {
        nome: this.nomeInput.trim(),
        pontuacao: 0
      };

      this.jogadorAtivo = novoJogador;
      this.jogadorAtivo.pontuacao = 0;
      await this.andamentoService.atualizarJogador(this.jogadorAtivo);

      this.router.navigateByUrl('/tabs/quiz');
    }
}
