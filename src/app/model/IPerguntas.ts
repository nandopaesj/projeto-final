export interface IPerguntas
{
  enunciado: string;
  respostaCorreta: number;
  respostas: string[];
  valor: number;
  respondido?: boolean;
}
