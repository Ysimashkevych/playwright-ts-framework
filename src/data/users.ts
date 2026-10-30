// Public demo credentials published on the SauceDemo login page.
export const USERS = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

export const CHECKOUT_INFO = { firstName: 'Yurii', lastName: 'Tester', postalCode: '01001' } as const;
