'use client'
import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

export default function QRCodeComponent({ data }) {
  const qrCodeRef = useRef(null);

  useEffect(() => {
    generateQRCode();
  }, [data]);

  const generateQRCode = async () => {
    try {
      await QRCode.toCanvas(qrCodeRef.current, data, { width: 225 });
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