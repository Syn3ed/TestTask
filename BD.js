import pgPromise from 'pg-promise';
const pgp = pgPromise();

class Database {
    constructor(config) {
        this.db = pgp(config);
    }

    async createTables() {
        try {
            await this.db.none(`
                CREATE TABLE IF NOT EXISTS Nomenklature (
                    Id SERIAL PRIMARY KEY,
                    name TEXT UNIQUE,
                    price INTEGER 
                )
            `);
            await this.db.none(`
                CREATE TABLE IF NOT EXISTS Links (
                    Id SERIAL PRIMARY KEY,
                    nomenklatureId INTEGER REFERENCES Nomenklature(Id),
                    parentId INTEGER REFERENCES Nomenklature(Id),
                    kol INTEGER 
                )
            `);
            console.log('Таблицы созданы');
        } catch (error) {
            console.log('Ошибка при создании таблиц', error);
        }
    }

    async addNomenklature(name, price) {
        try {
            await this.db.none('INSERT INTO Nomenklature (name, price) VALUES ($1, $2)', [name, price]);
            console.log('Продукт успешно добавлен');
        } catch (error) {
            console.log('Ошибка при добавлении продукта', error);
        }
    }

    async addLink(nomenklatureId, parentId, Kol) {
        try {
            await this.db.none('INSERT INTO Links (nomenklatureId, parentId, Kol) VALUES ($1, $2, $3)', [nomenklatureId, parentId, Kol]);
            console.log('Ссылка успешно добавлена');
        } catch (error) {
            console.log('Ошибка при добавлении ссылки', error);
        }
    }

    async getAllNomenklature() {
        try {
            return await this.db.any('SELECT * FROM Nomenklature');
        } catch (error) {
            console.log('Ошибка при получении списка продукции', error);
            return [];
        }
    }

    async getAllLinks() {
        try {
            return await this.db.any('SELECT * FROM Links');
        } catch (error) {
            console.log('Ошибка при получении списка ссылок', error);
            return [];
        }
    }

    async getNomenklatureWithChildren(nomenklatureId) {
        try {
            const query = `
            WITH RECURSIVE Cost AS (
                SELECT nomenklature.id, nomenklature.name, COALESCE(Links.Kol, 1) AS quantity, nomenklature.price
                FROM nomenklature 
                LEFT JOIN Links ON Links.nomenklatureId = nomenklature.id
                WHERE nomenklature.id = $1
            
                UNION ALL
            
                SELECT N.Id AS id, N.name, L.kol, N.price
                FROM Nomenklature N
                JOIN Links L ON N.Id = L.nomenklatureId 
                JOIN Cost ON L.parentid = Cost.id
            )
            SELECT name, quantity, price FROM Cost;
            
            
            `;
            return await this.db.any(query, [nomenklatureId]);
        } catch (error) {
            console.log('Ошибка при получении древа', error);
            return [];
        }
    }

    async getNomenklatureWithChildrenAllCost(nomenklatureId) {
        try {
            const query = `
            WITH RECURSIVE Cost AS (
                SELECT id, name, price, 1 AS quantity, 0 AS parentid, (price) AS totalcost
                FROM nomenklature WHERE id = $1
                
                UNION ALL
            
                SELECT N.Id AS id, N.name, N.price, L.kol, L.parentid, (N.price*L.Kol) AS totalcost
                FROM Nomenklature N
                JOIN Links L ON N.Id = L.nomenklatureId 
                JOIN Cost ON L.parentid = Cost.id
            )
            SELECT * FROM Cost;  
            `;
            return await this.db.any(query, [nomenklatureId]);
        } catch (error) {
            console.log('Ошибка при получении древа', error);
            return [];
        }
    }
}

export default Database;