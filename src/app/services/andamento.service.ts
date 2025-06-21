import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { IJogador } from '../model/IJogador';

@Injectable({
  providedIn: 'root'
})

export class AndamentoService
{
  private storageInicializado = false;

  constructor(private storage: Storage)
  {
    this.inicializarStorage();
  }

  private async inicializarStorage()
  {
    await this.storage.create();
    this.storageInicializado = true;
    console.log("ARMAZENAMENTO INICIADO");
  }

  // Obter todos os contatos salvos
  async obterAndamento(): Promise<IJogador | null>
  {
    if(!this.storageInicializado) await this.inicializarStorage();
    console.log("ARMAZENAMENTO ACESSADO: OBTER JOGADOR ATIVO");
    return (await this.storage.get('jogadorAtual')) || null;
  }

  async atualizarJogador(jogador: IJogador): Promise<void>
  {
    console.log("ARMAZENAMENTO ACESSADO: JOGADOR ATIVO ATUALIZADO");
    await this.storage.set('jogadorAtual', jogador);
  }

  async finalizarJogo(): Promise<void>
  {
    console.log("ARMAZENAMENTO ACESSADO: JOGADOR ATIVO LIMPO");
    await this.storage.remove('jogadorAtual');
  }
}
