# rent-auto
Small auto rent API. NestJS, Postgres 11 w/o TypeORM (plain SQL) in Docker

# Start
1. Open `deploy` folder and run `docker compose up` command.
This command setup & running postgress 11 instance, create tables and seed initial data - 5 test auto and rates.
Note: if you change postgres env in compose file then update `environment.ts` file as well.
In case of Windows - change new line symbols in `deploy/scripts/seed.sh` file from CRLF to LF
2. `npm start`

# Docs

Path prefix is `rent`. Swagger url by default `http://localhost:3000/rent/api`
Port might be changes in `environment.ts`

# Req:
Взятие авто на прокат.
1. Максимальный срок - 30 дней
2. Между  сдачей и новой арендой должно быть минимум 3 дня на сервис
3. День выдачи\сдачи авто не должен приходиться на выходной день
4. Стоимость для аренды - 1000р.
5. Предполагаются скидки:
1-4 дни - 0%;
5-9 дни - 5%;
10-17 дни - 10%;
18-30 дни - 15;
6. Отчет за текущий месяц для каждого авто - сколько дней  авто находится в аренде, процент дней в аренде. СУммарные данные по всем авто