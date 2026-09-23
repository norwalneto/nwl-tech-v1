/** Contatos da NWL. Atualize aqui para refletir em toda a página. */
export const CONTACT = {
  whatsapp: '5581973106952',
  phoneLabel: '(81) 97310-6952',
  email: 'www.nwltecnologia.site',
  instagramHandle: '@nwl_tech',
  instagramUrl: 'https://www.instagram.com/nwl_tech/',
} as const;

export function whatsappUrl(message?: string): string {
  const base = `https://wa.me/${CONTACT.whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
