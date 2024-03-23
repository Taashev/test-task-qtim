export type TypeOrmConfig = {
  /**
   * драйвер БД
   */
  type: 'postgres';

  /**
   * путь для подключения БД
   */
  host: string;

  /**
   * номер порта для подключения БД
   */
  port: number;

  /**
   * имя БД
   */
  database: string;

  /**
   * имя пользователя БД
   */
  username: string;

  /**
   * пароль пользователя БД
   */
  password: string;

  /**
   * автоматическая синхронизация БД и сущностей в коде
   */
  synchronize: boolean;

  /**
   * путь к сущностям
   */
  entities: string[];

  /**
   * Путь к файлам миграций
   */
  migrations: string[];
};
