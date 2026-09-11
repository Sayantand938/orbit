import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert a plural table name to singular form.
 * Examples: transactions → transaction, logs → log, sessions → session, categories → category.
 */
export function getSingularName(tableName: string): string {
  if (tableName.endsWith('ies')) {
    return tableName.slice(0, -3) + 'y';
  }
  if (tableName.endsWith('s')) {
    return tableName.slice(0, -1);
  }
  return tableName;
}

/**
 * Show a success toast for resource operations.
 */
export function notifySuccess(
  action: 'created' | 'updated' | 'deleted',
  resourceName: string
): void {
  const pastTense = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
  }[action];
  toast.success(`${resourceName} ${pastTense} successfully`);
}

/**
 * Parse a comma-separated tag input into a clean string array.
 * "Coffee, Morning ,WORK" → ["coffee", "morning", "work"]
 */
export function parseTags(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(',')
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Render a tag array back into the comma-separated string the form input expects.
 * ["coffee", "morning"] → "coffee, morning"
 */
export function tagsToInput(tags: string[] | null | undefined): string {
  return (tags ?? []).join(', ');
}