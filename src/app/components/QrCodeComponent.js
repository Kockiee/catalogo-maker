'use client'
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRCodeComponent({ data }) {
  // Componente para exibir ou gerar um código QR
  const qrCodeRef = useRef(null); // Referência para o elemento canvas onde o QR será renderizado

  useEffect(() => {
    if (!data) return; // Se não houver dados, não faz nada

    if (data.startsWith('data:image/png;base64,')) {
      // Se os dados já forem uma imagem Base64, apenas exibe a imagem
      const ctx = qrCodeRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        qrCodeRef.current.width = img.width; // Define a largura do canvas com base na imagem
        qrCodeRef.current.height = img.height; // Define a altura do canvas com base na imagem
        ctx.drawImage(img, 0, 0); // Desenha a imagem no canvas
      };
      img.src = data; // Define a fonte da imagem como os dados Base64
    } else {
      // Caso contrário, gera o código QR a partir dos dados
      generateQRCode();
    }
  }, [data]); // Executa o efeito sempre que os dados mudarem

  const generateQRCode = async () => {
    try {
      // Gera o código QR no canvas usando a biblioteca QRCode
      await QRCode.toCanvas(qrCodeRef.current, data, { width: 500 });
    } catch (error) {
      console.error('Erro ao gerar o código QR:', error); // Loga erros no console
    }
  };

  return (
    <div>
      {/* Elemento canvas onde o código QR será renderizado */}
      <canvas ref={qrCodeRef}></canvas>
    </div>
  );
}