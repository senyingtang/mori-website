export type UserRole = "super_admin" | "admin" | "editor" | "coach" | "member";

export function isAdminRole(role: string | null | undefined): boolean {
  return role === "super_admin" || role === "admin" || role === "editor";
}

export function canManageUsers(role: string | null | undefined): boolean {
  return role === "super_admin";
}

export function canManageSiteSettings(role: string | null | undefined): boolean {
  return role === "super_admin" || role === "admin";
}

export function canManageContent(role: string | null | undefined): boolean {
  return isAdminRole(role);
}

