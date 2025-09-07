'use client'
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRCodeComponent({ data }) {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    if (data.startsWith('data:image/png;base64,')) {
      // Se já for uma imagem Base64, não gerar, apenas mostrar
      const ctx = qrCodeRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        qrCodeRef.current.width = img.width;
        qrCodeRef.current.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = data;
    } else {
      // Caso contrário, gerar normalmente
      generateQRCode();
    }
  }, [data]);

  const generateQRCode = async () => {
    try {
      await QRCode.toCanvas(qrCodeRef.current, data, { width: 500 });
    } catch (error) {
      console.error('Erro ao gerar o código QR:', error);
    }
  };

  return (
    <div>
      <canvas ref={qrCodeRef}></canvas>
    </div>
  );
}