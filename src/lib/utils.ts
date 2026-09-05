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
 * @param action - The action performed: 'created', 'updated', or 'deleted'.
 * @param resourceName - The singular name of the resource (e.g., 'transaction').
 */
export function notifySuccess(action: 'created' | 'updated' | 'deleted', resourceName: string): void {
  const pastTense = {
    created: 'created',
    updated: 'updated',
    deleted: 'deleted',
  }[action];
  toast.success(`${resourceName} ${pastTense} successfully`);
}