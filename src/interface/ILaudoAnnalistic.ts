export interface ILaudoAnnalistic {
  produto: string;
  lote: string;
  quantidade: string;
  data_fabricacao: string;
  data_validade: string;
  nota_fiscal: string;
  elaborado_por: string;
  data_elaboracao: string;
  componentes: Componente[];
}

export interface Componente {
  nome: string;
  minimo: string;
  maximo: string;
  valor: string;
  observacao: string;
}
