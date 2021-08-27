--Получить список всех категорий (идентификатор, наименование категории):
SELECT id, title
  FROM categories;

--Получить список категорий для которых создано минимум одно объявление (идентификатор, наименование категории):
SELECT id, title
  FROM categories c
  JOIN OfferCategories oc ON c.id = oc.CategoryId
  GROUP BY id;

--Получить список категорий с количеством объявлений (идентификатор, наименование категории, количество объявлений в категории):
SELECT id, title, count(oc.OfferId) AS offers
  FROM categories c FULL
  JOIN OfferCategories oc ON c.id = oc.CategoryId
  GROUP BY id;

--Получить список объявлений (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие объявления:
SELECT op.id, op.title, sum, type, description, pubDate, name, email, comments_count, string_agg(ct.title, ', ') AS categories_list
  FROM (select o.id, o.title, sum, type, description, pubDate, name, email, count(cm.id) AS comments_count FROM offers o
    JOIN users p ON p.id = o.userId
    FULL JOIN comments cm ON o.id = cm.offerId
    GROUP BY o.id, p.id
  ) op
  LEFT JOIN OfferCategories oc ON oc.OfferId = op.id
  LEFT JOIN categories ct ON oc.CategoryId = ct.id
  GROUP BY op.id, op.title, sum, type, description, pubDate, name, email, comments_count
  ORDER BY pubDate DESC;

--Получить полную информацию определённого объявления (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий):
SELECT op.id, op.title, sum, type, description, pubDate, name, email, comments_count, string_agg(ct.title, ', ') AS categories_list
  FROM (select o.id, o.title, sum, type, description, pubDate, name, email, count(cm.id) AS comments_count FROM offers o
    JOIN users p ON p.id = o.userId
    FULL JOIN comments cm ON o.id = cm.offerId
    GROUP BY o.id, p.id
    WHERE o.id = 1
  ) op
  LEFT JOIN OfferCategories oc ON oc.OfferId = op.id
  LEFT JOIN categories ct ON oc.CategoryId = ct.id
  GROUP BY op.id, op.title, sum, type, description, pubDate, name, email, comments_count
  ORDER BY pubDate DESC;

--Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария):
SELECT c.id, offerId, p.name AS author, text
  FROM comments c
  JOIN users p ON p.id = c.userId
  ORDER BY c.id DESC
  LIMIT 5;

--Получить список комментариев для определённого объявления (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария). Сначала новые комментарии:
SELECT c.id, offerId, p.name AS author, text
  FROM comments c
  JOIN users p ON p.id = c.userId
  WHERE offeId = 1
  ORDER BY c.id DESC;

--Выбрать 2 объявления, соответствующих типу «куплю»:
SELECT *
  FROM offers
  WHERE type = 'buy'
  LIMIT 2;

--Обновить заголовок определённого объявления на «Уникальное предложение!»:
UPDATE offers SET title = 'Уникальное предложение!'
  WHERE id = 1;
