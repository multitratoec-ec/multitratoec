const defaultAdminEmail = "multitratoec@gmail.com";

export function isAdmin(email: string | null) {
  const adminEmail = process.env.ADMIN_EMAIL || defaultAdminEmail;
  return !!email && email.toLowerCase() === adminEmail.toLowerCase();
}
