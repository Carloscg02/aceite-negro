/**
 * Utilidades para generación de enlaces de contacto directo (WhatsApp y correo).
 */

/**
 * Construye una URL de wa.me con el teléfono normalizado y el texto codificado.
 * Elimina todos los caracteres no numéricos del teléfono.
 * Lanza un error si el teléfono tiene menos de 8 dígitos.
 */
export function buildWhatsAppUrl(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) {
    throw new Error('Phone number must contain at least 8 digits');
  }
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

/**
 * Construye una URL mailto con el asunto y cuerpo (opcional) codificados.
 */
export function buildMailtoUrl(
  email: string,
  subject: string,
  body?: string,
): string {
  const encSubject = encodeURIComponent(subject);
  if (body !== undefined && body.length > 0) {
    const encBody = encodeURIComponent(body);
    return `mailto:${email}?subject=${encSubject}&body=${encBody}`;
  }
  return `mailto:${email}?subject=${encSubject}`;
}

