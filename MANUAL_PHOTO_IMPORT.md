# Ручний імпорт фото Ardudana

Автоматичний scraping Ardudana не використовуємо, бо сайт блокує такі запити через Imunify360. Цей процес призначений для ручно підготовлених фото: ви самі зберігаєте зображення, заповнюєте CSV, потім завантажуєте файли в Cloudflare R2.

Сайт Astro поки не змінюємо. Фото підключаємо до каталогу лише після перевірки R2-посилань.

## 1. Куди складати фото

Усі ручно підготовлені фото кладіть у папку:

```text
manual_import/
```

Файли всередині цієї папки не потрапляють у git, окрім службового `.gitkeep`.

## 2. Як називати фото

Використовуйте SEO-імена латиницею:

```text
category-product-name.jpg
```

Правила:

- тільки латиниця, цифри та дефіси;
- усе малими літерами;
- без пробілів, кирилиці, лапок і спецсимволів;
- розширення бажано `.jpg` або `.webp`;
- назва має описувати товар, а не бути `IMG_1234.jpg`.

Приклади:

```text
chairs-stilets-bukovyi-klasychnyi.jpg
tables-stil-derevianyi-restoran.jpg
bar-chairs-barnyi-stilets-dub.jpg
sofas-lavka-dereviana-kafe.jpg
```

Рекомендовані категорії для `category`:

```text
chairs
tables
bar-chairs
benches-sofas
horeca
hotel
decor
```

## 3. Як заповнювати CSV

Шаблон знаходиться тут:

```text
manual_products.csv
```

Поля:

```text
category, product_name, description, material, image_filename, r2_key, public_url
```

Що означає кожне поле:

- `category` — коротка категорія латиницею, наприклад `chairs`;
- `product_name` — назва товару для сайту українською;
- `description` — короткий опис для картки або сторінки товару;
- `material` — матеріал, наприклад `бук масив`, `дуб масив`, `ясен`;
- `image_filename` — точна назва файлу з папки `manual_import/`;
- `r2_key` — шлях файлу в R2 bucket;
- `public_url` — публічне посилання на фото після завантаження в R2.

Приклад рядка:

```csv
chairs,Стілець деревʼяний HoReCa,Стілець для ресторанів і кафе з посиленим каркасом,бук масив,chairs-stilets-derevianyi-horeca.jpg,ardudana/chairs/chairs-stilets-derevianyi-horeca.jpg,https://YOUR_PUBLIC_R2_DOMAIN/ardudana/chairs/chairs-stilets-derevianyi-horeca.jpg
```

Важливо: `image_filename` і фінальна частина `r2_key` мають збігатися.

## 4. Як сформувати r2_key

Рекомендований формат:

```text
ardudana/{category}/{image_filename}
```

Наприклад:

```text
ardudana/chairs/chairs-stilets-derevianyi-horeca.jpg
ardudana/tables/tables-stil-derevianyi-restoran.jpg
```

## 5. Як залити фото в Cloudflare R2

Bucket:

```text
horeca-meybli-images
```

Спочатку авторизуйте Wrangler, якщо ще не авторизований:

```bash
npx wrangler login
```

Потім завантажте окреме фото:

```bash
npx wrangler r2 object put horeca-meybli-images/ardudana/chairs/chairs-stilets-derevianyi-horeca.jpg \
  --file manual_import/chairs-stilets-derevianyi-horeca.jpg \
  --content-type image/jpeg \
  --cache-control "public, max-age=31536000, immutable"
```

Для `.webp` використовуйте:

```bash
--content-type image/webp
```

## 6. Як перевірити після завантаження

Після upload:

1. Відкрийте `public_url` у браузері.
2. Переконайтеся, що фото відкривається без авторизації.
3. Перевірте, що фото відповідає товару в `manual_products.csv`.
4. Лише після цього можна підключати ці рядки до каталогу сайту.

## 7. Перед підключенням до сайту

Мінімальна перевірка:

- усі файли з `image_filename` реально лежать у `manual_import/`;
- для кожного рядка є `r2_key`;
- для кожного рядка є робочий `public_url`;
- немає дубльованих імен файлів;
- назви файлів SEO-дружні й латиницею.
