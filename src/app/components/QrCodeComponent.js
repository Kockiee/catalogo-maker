/**
 * COMPONENTE DE QR CODE
 * 
 * Este arquivo contém um componente para geração e exibição de códigos QR.
 * O componente suporta tanto geração de QR code a partir de texto quanto
 * exibição de imagens QR code pré-existentes em base64.
 * 
 * Funcionalidades:
 * - Geração de QR code a partir de texto
 * - Exibição de QR code em base64
 * - Renderização em canvas
 * - Tamanho configurável
 * - Tratamento de erros
 */

'use client' // Diretiva para indicar que este componente roda no lado do cliente
import { useEffect, useRef } from 'react'; // Importa hooks do React
import QRCode from 'qrcode'; // Importa biblioteca de geração de QR code

export default function QRCodeComponent({ data }) {
  // Referência ao elemento canvas
  const qrCodeRef = useRef(null);

  // Efeito que executa quando o data muda
  useEffect(() => {
    if (!data) return; // Se não há dados, não faz nada

    // Verifica se o data é uma imagem base64
    if (data.startsWith('data:image/png;base64,')) {
      // Se já for uma imagem Base64, não gerar, apenas mostrar
      const ctx = qrCodeRef.current.getContext('2d'); // Obtém contexto 2D do canvas
      const img = new Image(); // Cria novo objeto Image
      
      img.onload = () => {
        qrCodeRef.current.width = img.width; // Define largura do canvas
        qrCodeRef.current.height = img.height; // Define altura do canvas
        ctx.drawImage(img, 0, 0); // Desenha a imagem no canvas
      };
      img.src = data; // Define a fonte da imagem
    } else {
      // Caso contrário, gerar QR code normalmente a partir do texto
      generateQRCode();
    }
  }, [data]); // Executa sempre que data mudar

  // Função para gerar o QR code
  const generateQRCode = async () => {
    try {
      // Gera o QR code no canvas com largura de 500px
      await QRCode.toCanvas(qrCodeRef.current, data, { width: 500 });
    } catch (error) {
      // Registra erro no console se falhar
      console.error('Erro ao gerar o código QR:', error);
    }
  };

  return (
    <div>
      {/* Canvas onde o QR code será renderizado */}
      <canvas ref={qrCodeRef}></canvas>
    </div>
  );
}