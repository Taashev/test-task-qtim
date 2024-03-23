export const SALT = 10;

export const JWT_EXPIRES_IN = '7d';

export const MESSAGE_ERROR = {
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',

  BAD_REQUEST: 'Некорректно переданные данные',

  AUTH_USER: 'Неверный логин или пароль',

  FORBIDDEN: 'У вас не хватает прав. Автороризуйтесь',

  NOT_FOUND_USER: 'Пользователь не найден',

  ALREADY_EXISTS_USER: 'Пользователь уже существует',
};
