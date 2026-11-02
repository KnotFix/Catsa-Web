import "server-only";
import QRCode from "qrcode";

/**
 * QR de la URL otpauth:// en SVG, generado en el servidor. El secreto nunca
 * pasa por un servicio externo de QR.
 */
export function qrSvg(url: string) {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#1C1B18", light: "#FFFFFF" },
  });
}
