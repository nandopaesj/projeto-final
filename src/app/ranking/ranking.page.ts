import { Component } from '@angular/core';
import { RankingService } from '../services/ranking.service';
import { IColocado } from '../model/IColocado';
import { Route, Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ranking',
  templateUrl: 'ranking.page.html',
  styleUrls: ['ranking.page.scss'],
  standalone: false,
})

export class RankingPage
{
  ranking: IColocado[] = [];

  constructor(private rankingService: RankingService, private router: Router, private toastController: ToastController, private alertController: AlertController) {}

  async ngOnInit()
  {
    this.ranking = await this.rankingService.obterRanking();
    if (!this.ranking || this.ranking.length === 0 || !this.ranking[0].nome.trim())
      {
        this.router.navigateByUrl('/tabs/home');
        const toast = await this.toastController.create(
        {
          message: 'O ranking está vazio.',
          duration: 2000,
          color: 'warning'
        });
        await toast.present();
        return;
      }
  }

  async confirmarLimparRanking() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Tem certeza que deseja apagar todo o ranking?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Apagar',
          handler: async () => {
            await this.rankingService.limparRanking();
            this.ranking = [];
            const toast = await this.toastController.create({
              message: 'Ranking apagado com sucesso.',
              duration: 2000,
              color: 'success'
            });
            await toast.present();
          }
        }
      ]
    });
  
    await alert.present();
  }
}
