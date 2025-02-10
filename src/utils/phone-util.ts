

export function fPhoneNumber(phone: string): string {
  if (phone.startsWith("593") && phone.length > 3) {
    return `0${  phone.slice(3)}`;
  }
  return `+${  phone}`;
}
