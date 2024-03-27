export const SALT = 10;

export const MESSAGE_ERROR = {
  INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',

  BAD_REQUEST: 'Некорректно переданные данные',

  BAD_REQUEST_DELETE_POST: 'Не удалось удалить пост',

  AUTH_USER: 'Неверный логин или пароль',

  FORBIDDEN: 'У вас не хватает прав. Автороризуйтесь',

  FORBIDDEN_POST: 'Вы не являетесь владельцем этого поста',

  NOT_FOUND_USER: 'Пользователь не найден',

  NOT_FOUND_POST: 'Пост не найден',

  ALREADY_EXISTS_USER: 'Пользователь уже существует',
};
