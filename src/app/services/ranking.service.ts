import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IColocado } from '../model/IColocado';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private storageInicializado = false;

  constructor(private storage: Storage) {
    this.inicializarStorage();
  }

  private async inicializarStorage() {
    await this.storage.create();
    this.storageInicializado = true;
    console.log("RANKING INICIALIZADO");
  }

  async obterRanking(): Promise<IColocado[]> {
    if (!this.storageInicializado) await this.inicializarStorage();
    console.log("ARMAZENAMENTO ACESSADO (RANKING): OBTER RANKING");
    return (await this.storage.get('ranking')) || [];
  }

  async adicionarColocado(colocado: IColocado): Promise<void> {
    const ranking = await this.obterRanking();
    ranking.push(colocado);

    ranking.sort((a, b) => b.pontuacao - a.pontuacao);

    ranking.forEach((item, index) => item.posicao = index + 1);

    await this.storage.set('ranking', ranking);
    console.log("RANKING: COLOCADO ADICIONADO");
  }

  async limparRanking(): Promise<void> {
    console.log("RANKING: RANKING LIMPO");
    await this.storage.remove('ranking');
  }
}
