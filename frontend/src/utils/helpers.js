

export function validateEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validateName(name) {
  const re = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/; // Solo letras y espacios
  return re.test(name);
}

export function validatePhone(phone) {
  const re = /^[0-9]{11}$/; // Solo números, exactamente 11 dígitos
  return re.test(phone);
}

export function validateUser(user) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/; //letras y numeros
  return re.test(user);
}

export function validatePassword(password) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Expresión regular
  return re.test(password);
}