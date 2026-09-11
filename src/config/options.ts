/**
 * Central place for every dropdown / select option in the app.
 * Edit here, and all forms + filters pick up the change automatically.
 */

// ─── Transactions ───────────────────────────────────────────────────────────

export const transactionTypeOptions = [
    { value: 'income', label: 'Income (Earned)' },
    { value: 'expense', label: 'Expense (Spent)' },
];

export const transactionCategoryOptions = [
    { value: 'Food & Drink', label: 'Food & Drink' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Shopping', label: 'Shopping' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Utilities', label: 'Utilities' },
    { value: 'Rent / Mortgage', label: 'Rent / Mortgage' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Education', label: 'Education' },
    { value: 'Insurance', label: 'Insurance' },
    { value: 'Groceries', label: 'Groceries' },
    { value: 'Dining Out', label: 'Dining Out' },
    { value: 'Coffee', label: 'Coffee' },
    { value: 'Alcohol & Bars', label: 'Alcohol & Bars' },
    { value: 'Clothing', label: 'Clothing' },
    { value: 'Electronics', label: 'Electronics' },
    { value: 'Home Improvement', label: 'Home Improvement' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Subscriptions', label: 'Subscriptions' },
    { value: 'Gifts', label: 'Gifts' },
    { value: 'Other', label: 'Other' },
];

// ─── Logs ───────────────────────────────────────────────────────────────────

export const logCategoryOptions = [
    { value: 'System', label: 'System' },
    { value: 'Application', label: 'Application' },
    { value: 'Security', label: 'Security' },
    { value: 'Network', label: 'Network' },
    { value: 'Other', label: 'Other' },
];

// ─── Sessions ───────────────────────────────────────────────────────────────

export const sessionCategoryOptions = [
    { value: 'Work', label: 'Work' },
    { value: 'Meeting', label: 'Meeting' },
    { value: 'Study', label: 'Study' },
    { value: 'Personal', label: 'Personal' },
    { value: 'Fitness', label: 'Fitness' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Other', label: 'Other' },
];