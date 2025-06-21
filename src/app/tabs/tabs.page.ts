import { IPerguntas } from './../model/IPerguntas';
import { IJogador } from './../model/IJogador';
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AndamentoService } from '../services/andamento.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  jogador!: IJogador;

  constructor(
    private router: Router,
    private andamentoService: AndamentoService,
    private alertController: AlertController
  ) {}

  async entrarQuiz()
  {
    const jogadorSalvo = await this.andamentoService.obterAndamento();

    if (!jogadorSalvo || !jogadorSalvo.nome || jogadorSalvo.nome.trim() === "")
    {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Nenhum jogador ativo encontrado.',
        buttons: ['OK']
      });
      await alert.present();
      this.router.navigateByUrl('/tabs/home');
      return;
    }else
    {
      this.router.navigateByUrl('/tabs/quiz');
    }
  }
}
