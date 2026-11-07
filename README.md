# Favorit Parts — поиск автозапчастей

Клиентское React-приложение для двухэтапного подбора номенклатуры через API [Favorit Parts](https://lk.favorit-parts.ru/static/wsprice.pdf).

> **Фаворит** — тестовое задание на позицию frontend-разработчика.

**Демо:** https://arturtonoyan.github.io/test-autoparts-frontend/

## Что умеет

1. **Артикул** — ввод номера детали с валидацией формы  
2. **Производители** — список брендов по артикулу  
3. **Аналоги** — таблица предложений: название, производитель, цена, остаток

Цена берётся из складов (`warehouses[].price`, минимальная), остаток — сумма `stock` по складам.

## Стек

| Слой        | Решение                                      |
| ----------- | -------------------------------------------- |
| UI          | React 19, Mantine, Tabler Icons, Framer Motion |
| Состояние   | Redux Toolkit                                |
| Запросы     | TanStack Query                               |
| Форма       | React Hook Form + Zod                        |
| Сборка      | Vite                                         |
| Тесты       | Vitest                                       |

## Быстрый старт

```bash
cp .env.example .env
npm install
npm run dev
```

Откройте [http://localhost:5173](http://localhost:5173).

Запросы идут напрямую на `https://api.favorit-parts.ru/hs/hsprice/` — у сервиса открыт CORS (`Access-Control-Allow-Origin: *`).

### Демо-артикулы

| Артикул       | Ожидание              |
| ------------- | --------------------- |
| `7160500039S` | бренд MEYLE и аналоги |
| `01089`       | несколько брендов     |

## Скрипты

```bash
npm run dev       # локальная разработка
npm run build     # production-сборка
npm run preview   # просмотр сборки
npm test          # unit-тесты
```

## Архитектура

```
src/
  api/favoritApi.js     # HTTP-клиент
  store/                # Redux: артикул, бренд, этап
  features/             # SearchForm, BrandList, OffersTable
  components/           # Loader, ErrorAlert, EmptyState
  utils/normalize.js    # бренды, flatten аналогов, цена/остаток
```

- **Redux** хранит UI-состояние сценария (что искали / что выбрали).  
- **React Query** отвечает за загрузку, кеш и повтор запросов.  
- Ошибки сети и поля `error` от API показываются в `ErrorAlert` с кнопкой «Повторить».  
- Пустой `goods` / пустая структура ответа → `EmptyState`.

## Тесты

Покрыта логика, от которой зависит корректность экрана:

- нормализация складов (мин. цена, сумма остатка);
- извлечение брендов и flatten аналогов;
- переходы Redux (`setNumber` → `selectBrand` → `clearBrand`).

```bash
npm test
```

## Документация

- [Техническое задание](./docs/TZ.md)
- [API «Проценка»](https://lk.favorit-parts.ru/static/wsprice.pdf)
