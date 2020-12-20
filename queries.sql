--Получить список всех категорий (идентификатор, наименование категории):
SELECT id, title
  FROM categories;

--Получить список категорий для которых создано минимум одно объявление (идентификатор, наименование категории):
SELECT id, title
  FROM categories c
  JOIN offers_categories oc ON c.id = oc.category_id
  GROUP BY id;

--Получить список категорий с количеством объявлений (идентификатор, наименование категории, количество объявлений в категории):
SELECT id, title, count(oc.offer_id) AS offers
  FROM categories c FULL
  JOIN offers_categories oc ON c.id = oc.category_id
  GROUP BY id;

--Получить список объявлений (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий). Сначала свежие объявления:
SELECT op.id, op.title, sum, type, description, pub_date, name, email, comments_count, string_agg(ct.title, ', ') AS categories_list
  FROM (select o.id, o.title, sum, type, description, pub_date, name, email, count(cm.id) AS comments_count FROM offers o
    JOIN peoples p ON p.id = o.people_id
    FULL JOIN comments cm ON o.id = cm.offer_id
    GROUP BY o.id, p.id
  ) op
  LEFT JOIN offers_categories oc ON oc.offer_id = op.id
  LEFT JOIN categories ct ON oc.category_id = ct.id
  GROUP BY op.id, op.title, sum, type, description, pub_date, name, email, comments_count
  ORDER BY pub_date DESC;

--Получить полную информацию определённого объявления (идентификатор объявления, заголовок объявления, стоимость, тип объявления, текст объявления, дата публикации, имя и фамилия автора, контактный email, количество комментариев, наименование категорий):
SELECT op.id, op.title, sum, type, description, pub_date, name, email, comments_count, string_agg(ct.title, ', ') AS categories_list
  FROM (select o.id, o.title, sum, type, description, pub_date, name, email, count(cm.id) AS comments_count FROM offers o
    JOIN peoples p ON p.id = o.people_id
    FULL JOIN comments cm ON o.id = cm.offer_id
    GROUP BY o.id, p.id
    WHERE o.id = 1
  ) op
  LEFT JOIN offers_categories oc ON oc.offer_id = op.id
  LEFT JOIN categories ct ON oc.category_id = ct.id
  GROUP BY op.id, op.title, sum, type, description, pub_date, name, email, comments_count
  ORDER BY pub_date DESC;


--Получить список из 5 свежих комментариев (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария):
SELECT c.id, offer_id, p.name AS author, text
  FROM comments c
  JOIN peoples p ON p.id = c.people_id
  ORDER BY c.id DESC
  LIMIT 5;

--Получить список комментариев для определённого объявления (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария). Сначала новые комментарии:SELECT c.id, offer_id, p.name AS author, text
SELECT c.id, offer_id, p.name AS author, text
  FROM comments c
  JOIN peoples p ON p.id = c.people_id
  WHERE offer_id = 1
  ORDER BY c.id DESC;

--Выбрать 2 объявления, соответствующих типу «куплю»:
SELECT *
  FROM offers
  WHERE type = 'buy'
  LIMIT 2;

--Обновить заголовок определённого объявления на «Уникальное предложение!»:
UPDATE offers SET title = 'Уникальное предложение!'
  WHERE id = 1;
