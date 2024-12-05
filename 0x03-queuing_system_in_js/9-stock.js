import express from 'express';
import { createClient } from 'redis';


// Id: 1, name: Suitcase 250, price: 50, stock: 4
// Id: 2, name: Suitcase 450, price: 100, stock: 10
// Id: 3, name: Suitcase 650, price: 350, stock: 2
// Id: 4, name: Suitcase 1050, price: 550, stock: 5
const listProducts = [
    { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
    { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
    { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
    { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 }
];


function getItemById(id){
    if (isNaN(id)) {
        return
    }
    const results = listProducts.filter((product) => {
        return product.id === Number(id);
    });
    if (results)
        return results[0];
}


// Create a client to connect to the Redis server:


const client = createClient();

client.on('error', (err) => console.log('Redis Client Error', err));
(async () =>{
    await client.connect();
})();



function reserveStockById(itemId, stock){
    client.set(`item.${itemId}`, stock);
}


async function getCurrentReservedStockById(itemId){
    let result = await client.get(`item.${itemId}`);
    if(!result){
        // first time of getting the item, set stock with initial quantity
        const item = getItemById(itemId);
        console.log('item: ', item);
        if (item){
            result = item.stock;
            client.set(`item.${itemId}`, item.stock);
        }
    }
    return result;
}





// server configs
const app = express();
const PORT = 1245;

app.get('/list_products', (req, res) => {
    res.json(listProducts);
});


app.get('/list_products/:itemId', async (req, res) => {
    const { itemId } = req.params;
    console.log('item_id', itemId);
    const item = getItemById(itemId);
    console.log('item: ', item);
    if (!item){
        res.json({"status":"Product not found"});
    }
    else{
        const result = await getCurrentReservedStockById(itemId);
        console.log('result ', result);
        if (result){

            item.currentQuantity = result;
            console.log(item);
            res.json(item);
        }
    }
  });


app.get('/reserve_product/:itemId', async (req, res) => {
    const { itemId } = req.params;
    console.log('item_id', itemId);
    const item = getItemById(itemId);
    console.log('item: ', item);
    if (!item){
        res.json({"status":"Product not found"});
    }
    else{
        const result = await getCurrentReservedStockById(itemId);
        console.log('result ', result);
        if (result > 0){
            reserveStockById(itemId, result - 1);
            res.json({"status":"Reservation confirmed","itemId":itemId});
        }
        else{
            res.json({"status":"Not enough stock available","itemId":itemId});
        }
    }
  });

app.listen(PORT);
