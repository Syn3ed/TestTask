import Database from "./BD.js";

const db = new Database({
    user: 'postgres',
    password: '123123',
    host: 'localhost',
    port: 5433,
    database: 'TestTask'
});

class Controller {
    async createTable(req, res) {
        try {
            await db.createTables();
            res.status(200).json({})
        } catch (e) {
            console.log('Ошибка createTable', e);
            res.status(500)
        }
    }

    async addNomenklature(req, res) {
        try {
            const { name, price } = req.body;
            await db.addNomenklature(name, price);
            res.status(200).json({})
        } catch (e) {
            console.log('Ошибка addNomenklature', e);
            res.status(500)
        }
    }

    async addLink(req, res) {
        try {
            const { nomenklatureId, parentId, Kol } = req.body;
            await db.addLink(nomenklatureId, parentId, Kol);
            res.status(200).json({})
        } catch (e) {
            console.log('Ошибка addLink', e);
            res.status(500)
        }
    }

    async getAllNomenklature(req, res) {
        try {
            const getAll = await db.getAllNomenklature();
            res.send(getAll)
        } catch (e) {
            console.log('Ошибка getAllNomenklature', e);
            res.status(500)
        }
    }

    async getNomenklatureWithChildren(req, res) {
        try {
            const { id } = req.params;
            const nomenklatureWithChildren = await db.getNomenklatureWithChildren(id);
            res.send(nomenklatureWithChildren)
        } catch (e) {
            console.log('Ошибка nomenklatureWithChildren', e);
            res.status(500)
        }
    }

    async getNomenklatureWithChildrenAllCost(req, res) {
        try {
            const { id } = req.params;
            const getNomenklatureWithChildrenAllCost = await db.getNomenklatureWithChildrenAllCost(id);

            const calculateTotalCost = (products) => {
                const productMap = new Map();

                products.forEach(product => {
                    productMap.set(product.id, product);
                });

                for (let i = products.length - 1; i > 0; i--) {
                    const product = products[i];
                    const parentId = product.parentid;
                    const parentProduct = productMap.get(parentId);
                    parentProduct.totalcost += (product.totalcost) * parentProduct.quantity;
                }

                const resultArray = [];
                productMap.forEach(product => {
                    resultArray.push({
                        name: product.name,
                        kol: product.quantity,
                        price: product.price,
                        cost: product.totalcost,
                    });
                });

                return resultArray;
            }

            const allCost = calculateTotalCost(getNomenklatureWithChildrenAllCost)
            res.send(allCost)
        } catch (e) {
            console.log('Ошибка getNomenklatureWithChildrenAllCost', e);
            res.status(500)
        }
    }



    async start() {
        try {
            await db.createTables();
            await db.addNomenklature('Продукт 1', 100);
            await db.addNomenklature('Продукт 2', 200);
            await db.addNomenklature('Продукт 3', 300);
            await db.addNomenklature('Продукт 4', 400);
            await db.addNomenklature('Продукт 5', 500);
            await db.addNomenklature('Продукт 6', 600);
            await db.addNomenklature('Продукт 7', 700);
            await db.addNomenklature('Продукт 8', 800);
            await db.addLink(2, 1, 2);
            await db.addLink(3, 2, 1);
            await db.addLink(4, 2, 3);
            await db.addLink(5, 1, 3);
            await db.addLink(6, 5, 2);
            await db.addLink(7, 5, 1);
            await db.addLink(8, 5, 1);
        } catch (e) {
            return console.log(e);
        }
    }

}


export default Controller;