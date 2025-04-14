import { useCallback, useRef } from "react";
import { ILaudoAnnalistic } from "../interface/ILaudoAnnalistic";

export const LaudoAnalise: React.FC<ILaudoAnnalistic> = ({
  produto,
  lote,
  quantidade,
  data_fabricacao,
  data_validade,
  nota_fiscal,
  elaborado_por,
  data_elaboracao,
  componentes,
}) => {
  const laudoRef = useRef<HTMLDivElement>(null);

  const handlePrint = useCallback(() => {
    if (laudoRef.current) {
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;

      const printContent = laudoRef.current.innerHTML;
      const printStyles = `
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
          }

          #laudoContent {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            display: flex !important;
            flex-direction: column !important;
            gap: 2.5rem !important;
            padding-bottom: 60px !important; /* Espaço para o endereço */
          }

          /* Cabeçalho */
          #laudoContent > div:first-child {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: space-around !important;
            border: 1px solid black !important;
            padding: 0.75rem 0 !important;
            position: relative !important;
          }

          /* Linha vertical */
          #laudoContent > div:first-child > div {
            display: block !important;
            width: 1px !important;
            height: 100px !important;
            background-color: black !important;
            margin: 0 20px !important;
            visibility: visible !important;
            opacity: 1 !important;
          }

          /* Sobrescrever a classe hidden especificamente para a linha vertical */
          #laudoContent .hidden.w-\\[1px\\] {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
          }

          /* Logo */
          #laudoContent img {
            height: 100px !important;
            object-fit: contain !important;
            padding: 0.25rem 0 !important;
          }

          /* Título */
          #laudoContent h1 {
            color: #1FA65A !important;
            font-size: 2.25rem !important;
            font-weight: bold !important;
          }

          /* Tabelas */
          #laudoContent table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          #laudoContent td, #laudoContent th {
            border: 1px solid black !important;
            padding: 4px !important;
            font-size: 1rem !important;
          }

          #laudoContent td:first-child {
            background-color: #d9d9d9 !important;
            font-weight: bold !important;
          }

          /* Suporte Técnico */
          #laudoContent .flex-col {
            display: flex !important;
            flex-direction: column !important;
            gap: 1rem !important;
          }

          /* Correção para os itens de Suporte Técnico */
          #laudoContent .custom-tipe {
            display: flex !important;
            flex-direction: row !important; 
            align-items: center !important;
            gap: 0.5rem !important;
          }

          #laudoContent .custom-tipe span:first-child {
            font-weight: bold !important;
          }

          #laudoContent .custom-tipe span {
            display: inline !important;
            white-space: nowrap !important;
          }

          /* Título do Suporte Técnico */
          #laudoContent .flex-col > span.font-bold {
            font-weight: bold !important;
          }

          /* Químico responsável */
          #laudoContent .md\\:ml-14 {
            margin-left: 55px !important;
            font-size: 0.875rem !important;
          }

          /* Endereço */
          #laudoContent > span:last-of-type {
            text-align: center !important;
            font-size: 0.875rem !important;
            font-style: italic !important;
            position: fixed !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            width: 100% !important;
          }

          .no-print {
            display: none !important;
          }

          [contenteditable] {
            min-height: 1em !important;
          }

          /* Mensagem de assinatura eletrônica */
          #laudoContent .self-center.mt-4 {
            display: block !important;
            width: 100% !important;
            text-align: center !important;
            margin-top: 1rem !important;
            font-size: 1rem !important;
          }

          .button-print {
            display: none !important;
          }

          /* Esconder botão de impressão */
          #laudoContent button,
          #laudoContent .no-print,
          .no-print {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
          }
        </style>
      `;

      // Configurar o novo documento
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Laudo Análise</title>
            ${printStyles}
          </head>
          <body>
            <div id="laudoContent">${printContent}</div>
          </body>
        </html>
      `);

      printWindow.document.close();

      // Esperar o carregamento do conteúdo
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  }, []);

  return (
    <div
      className="w-full h-full md:p-5 flex flex-col gap-10 font-sans relative"
      ref={laudoRef}
    >
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row items-center justify-around border py-3 border-black">
        <img
          src="/OCQ-logo.svg"
          alt="OCQ Logo"
          className="h-[80px] md:h-[120px] py-1 object-contain"
        />
        <div className="w-[1px] h-[100px] bg-black hidden md:block" />
        <h1 className="text-[#1FA65A] text-2xl md:text-4xl font-bold">
          LAUDO ANÁLISE
        </h1>
      </div>

      {/* Tabela de Informações */}
      <table className="border-collapse text-xs sm:text-base">
        <tbody>
          {[
            { label: "Produto", value: produto },
            { label: "Lote", value: lote },
            { label: "Quantidade", value: quantidade },
            { label: "Data de Fabricação", value: data_fabricacao },
            { label: "Validade", value: data_validade },
            { label: "Nota Fiscal", value: nota_fiscal },
            { label: "Elaborado por", value: elaborado_por },
            { label: "Data de Elaboração", value: data_elaboracao },
          ]?.map((item, index) => (
            <tr key={index} className="border-none">
              <td className="bg-[#d9d9d9] font-bold border border-black p-2">
                {item.label}:
              </td>
              <td className="border border-black p-2" contentEditable>
                {item.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabela de Análises */}
      <div className=" flex flex-col ">
        <table className="border-collapse">
          <thead>
            <tr className="bg-[#d9d9d9] text-xs sm:text-base">
              <th className="border border-black p-2">Análise</th>
              <th className="border border-black p-2">MIN</th>
              <th className="border border-black p-2">MAX</th>
              <th className="border border-black p-2">Resultado</th>
              <th className="border border-black p-2">OBS</th>
            </tr>
          </thead>
          <tbody>
            {componentes?.map((analise, index) => (
              <tr key={index} contentEditable className="text-xs sm:text-base">
                <td className="border border-black p-2">{analise.nome}</td>
                <td className="border border-black p-2">{analise.minimo}</td>
                <td className="border border-black p-2">{analise.maximo}</td>
                <td className="border border-black p-2">{analise.valor}</td>
                <td className="border border-black p-2">
                  {analise.observacao}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className="self-center mt-4  text-xs sm:text-base">
          Documento emitido eletronicamente dispensa assinatura.
        </span>
      </div>

      {/* Suporte Técnico */}
      <div className="flex flex-col gap-4  text-xs sm:text-base">
        <span className="font-bold">Suporte Técnico</span>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-1 custom-tipe">
            <span className="font-bold">Papel e têxtil:</span>
            <span contentEditable>(11) 2438-8147</span>
          </div>
          <div className="flex flex-col md:flex-row gap-1 custom-tipe">
            <span className="font-bold">Auto Adesivos:</span>
            <span contentEditable>(11) 2436-7944</span>
          </div>
          <div className="flex flex-col md:flex-row gap-1 custom-tipe">
            <span className="font-bold">Tintas:</span>
            <span contentEditable>(11) 2279-9232</span>
          </div>
          <div className="flex flex-col md:flex-row gap-1 custom-tipe">
            <span className="font-bold">Reclamações:</span>
            <span contentEditable>(11) 2436-3588/ 2436-3592</span>
          </div>
          <div className="flex flex-col md:flex-row gap-1 custom-tipe">
            <span className="font-bold">e-mail:</span>
            <span contentEditable>qualidade@ocq.com.br</span>
          </div>
        </div>
        <span className="md:ml-14 text-xs sm:text-base">
          Químico responsável: DOMINGOS FORTUNATO NETO. CRQ 004.150.081
        </span>
      </div>

      {/* Rodapé */}
      <span className="self-center md:mt-16 text-xs sm:text-base italic pb-20 md:pb-8">
        RUA MONICA APARECIDA MOREDO, 229 - JARDIM FATIMA - CEP 07177220 - SP -
        Fone: (11) 40002312
      </span>

      <button
        onClick={handlePrint}
        className="px-8 py-2 border-2 border-[#0DA464] text-[#0DA464] rounded-full bg-white hover:bg-[#3a9d77] hover:text-white hover:border-[#3a9d77] transition-colors mt-4 self-center font-semibold no-print fixed bottom-30 md:bottom-23 z-50"
      >
        Imprimir Laudo
      </button>
    </div>
  );
};
