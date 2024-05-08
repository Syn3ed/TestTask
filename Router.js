import Router from "express";
import Controller from "./Controller.js";
const cont = new Controller();
const router = new Router()

router.get('/nomenklatures', cont.getAllNomenklature) //Все продукты
router.get('/nomenklatures/:id', cont.getNomenklatureWithChildren) //Родительски элемент с дочерними элементами
router.get('/nomenklaturesAllCost/:id', cont.getNomenklatureWithChildrenAllCost) //Родительский элемент с дочерними элементами, имеющими стоимость
router.post('/nomenklatures', cont.addNomenklature) //Добавление продукта

//Создание таблиц и их заполнение по умолчанию см.start
router.get('/start', cont.start)

export default router;