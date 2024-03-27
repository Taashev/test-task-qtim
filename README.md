# О проекте

Это тестовое задание на позицию backend midle+ разработчика на стеке NodeJS, TS, NestJS, Postgres, Redis.\
На выполнение задачи было дано 2 дня.\

Возможности на уточнение требований по проекту не было, всё было отдано на усмотрение разработчика.

### Сервис постов (тестовое задание от QTIM)

Разработайте простое REST API с использованием NestJS, которое включает в себя аутентификацию, CRUD операции и кэширование данных. Проект должен использовать PostgreSQL для хранения данных и Redis для кэширования.

1. **Создание API для аутентификации:**
   - Реализуйте регистрацию и аутентификацию пользователей.
   - Используйте JWT (JSON Web Tokens) для обработки аутентификации.
2. **Интеграция с базой данных PostgreSQL с использованием TypeORM:**
   - Настройте соединение с базой данных.
   - Используйте миграции для управления структурой базы данных.
3. **Разработка CRUD API для сущности "Статья":**
   - Структура "Статьи" должна включать: название, описание, дату публикации, автора.
   - Реализуйте операции создания, чтения, обновления и удаления статей.
   - Обеспечьте валидацию входных данных.
   - Реализуйте пагинацию для запросов списка статей.
   - Добавьте возможность фильтрации статей по различным критериям (например, по дате публикации, автору).
   - Создание и обновление статей, должны быть закрыты авторизацией
4. **Реализация кэширования с использованием Redis:**
   - Кэшируйте результаты запросов на чтение статей.
   - Обеспечьте инвалидацию кэша при обновлении или удалении статей.
5. **Тестирование:**

   - Напишите unit-тесты для проверки бизнес-логики.

   ### Требования к коду и документации:

   - Код должен быть чистым, хорошо структурированным и легко читаемым.
   - Обеспечьте комментарии к коду и документацию API (по желанию) с примерами запросов и ответов.

---

### Стек проекта

- NestJS 10.0.0
- RxJS 7.8.1
- TypeScript 5.1.3
- TypeOrm 0.3.20
- PG 8.11.3
- bcrypt 5.1.1
- passport 0.7.0
- passport-jwt 4.0.1
- passport-local 1.0.0
- cache-manager" 5.4.0
- cache-manager-ioredis-yet 2.0.2
- class-transformer 0.5.1
- class-validator 0.14.1
- joi 17.12.2

# Как запустить проект

Перед тем как развернуть и запустить проект убедитесь в том что у вас:

- Установлен NodeJS
- Установлен NestJS
- Установлен Git
- Установлена СУБД PostgreSQL
- Установлен Redis

### Склонировать репозиторий

```sh
git clone https://github.com/Taashev/test-task-qtim.git
```

### Установить зависимости проекта

Перейти в директорию проекта и выполнить команду

```sh
npm run i
```

### Переменные окружения

Значения, отмеченные «\*», являются обязательными для заполнения. Остальные имеют значения по умолчанию, как указано в документации ниже и не обязательны для заполнения.

В корне проекта создать файл **.env**\
Указать в файле **.env** следующие перменные окружения

```sh
`HOST`='localhost'         // хост приложения
`PORT`=3000                // порт приложения
`NODE_ENV`='dev'           // среда выполнения

`JWT_SECRET`='jwt_secret'  // * секрет для подписания jwt токенов
`JWT_EXPIRES_IN`='7d'      // * время жизни токена

`HASH_PASSWORD_SALT`=10    // длина соли при хешировании пароля

`CACHE_TTL`=0              // время жизни кеша
`CACHE_MAX`=50             // размера кеша

`PG_HOST`='localhost'      // хост запуска Postgres
`PG_PORT`=5432             // порт запуска Postgres
`PG_NAME`='qtim_db'           // * имя БД Postgres
`PG_USER`='qtim_user'     // * имя пользователя БД Postgres
`PG_PASSWORD`='qtim_user' // * пароль пользователя БД Postgres
`PG_SYNCHRONIZE`=false     // автоматическая синхронизация БД с сущностями в коде
`PG_CACHE`=false           // кеширование БД Postgres

`REDIS_HOST`='localhost'   // хост запуска Redis
`REDIS_POST`=6379          // порт запуска Redis

```

### Postgres

Рекомендуется перед началом работы создать нового пользователя и БД, выдать пользователю права на БД и работать от имени созданного пользователя в созданной БД.

Подключитель с postgres cli от имени суперпользователя и выполните слудующие команды

Создаем пользователя

```sql
CREATE USER qtim_user WITH PASSWORD 'qtim_user';
```

Создаем базу данных

```sql
CREATE DATABASE qtim_db;
```

Выдаем пользователю права на БД monopoly_online;

```sql
GRANT ALL PRIVILEGES ON DATABASE qtim_db TO qtim_user;
```

### Уствновка расширения для генерации UUID

Для возможности генерировать uuid и использовать функцию uuid_generate_v4() нужно установить расширение.

Для этого потребуется выполнить команду по установке расширения от имени суперпользователя в БД qtim_db.

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

проверим установилось ли расширение в текущей БД

```sql
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp';
```

### Миграции

Перед запуском проекта в БД нужно создать таблицы с необходимой структурой и связями.

Для этой задачи в проекте есть уже созданные миграции в директории `src/database/migrations` и скрипты в `package.json` для выполнения миграций.

```sh
npm run migrate:up
```

теперь в БД есть необходимые таблицы

### Запустить проект

Теперь проект настроен и готов к запуску.

```js
npm run start:dev
```

# API

### Незащищенные маршруты

**Users**:\
`GET` **/users** - получить всех пользователей\
`GET` **/users/:username** - получить пользователя по username\
`GET` **/users/:username/posts** - получить все посты пользователя по username

**Posts**:\
`GET` **/posts** - получить все посты и их авторов\
`GET` **/posts/:id** - получить пост по id и автора

**Auth**:\
`POST` **/signup** - создать нового пользоателя\
`POST` **/signin** - авторизоваться

### Защищенные маршруты

User:\
`GET` **/users/me** - получить текущего пользователя\
`GET` **/users/me/posts** - получить все посты текущего пользователя

Posts:\
`POST` **/posts** - создать новый пост\
`POSTS` **/posts/list** - получить выборку постов по автору, дате, заголовку поста с возможностью пагинации\
`PATCH` **/posts/:id** - обновить пост по id\
`DELETE` **/posts/:id** - удалить пост по id
