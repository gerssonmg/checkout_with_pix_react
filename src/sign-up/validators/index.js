import CPF from 'cpf';

export const nameIsValid = field =>
  field && field.trim().split(' ').length >= 2 && field.trim().length > 6;

export const emailIsValid = field => {
  // https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)
  const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const regexEmailValidation = new RegExp(EMAIL_REGEX);
  return regexEmailValidation.test(field);
};

export const isCpfValid = CPF.isValid

export const isPasswordValid = field => {
  return field && field.length >= 6
}