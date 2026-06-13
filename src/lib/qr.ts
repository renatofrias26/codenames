import QRCode from "qrcode";

/** Generate a PNG data URL QR code for the given link (server-side). */
export async function toQrDataUrl(value: string): Promise<string> {
  return QRCode.toDataURL(value, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
    color: {
      dark: "#0a0a0f",
      light: "#ffffff",
    },
  });
}
