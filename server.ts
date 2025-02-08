const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const port = 3000;

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/check-db-connection", async (req, res) => {
    try {
        await prisma.$connect();
        res.send({ message: "Connected to the database Successfully" });
        console.log(`Server Response: Connected to the database Successfully`);
    } catch (error) {
        res.status(500).send({ error: "Cannot connect to database failled" });
    }
});
//try catch for checking error

// POST
app.post('/customer/create', async (req, res) => {
    try {
        const payload = req.body;
        const customer = await prisma.customer.create({
            data: payload
        });
        res.json(customer);
        console.log(`Server Response: Create Data in DB Successfully`);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//GET ALL
app.get('/customer/list', async (req, res) => {
    try {
        const customer = await prisma.customer.findMany();
        res.json(customer);
        console.log(`Server Response: Get Data from DB  Data Successfully`);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//GET by ID
app.get('/customer/detail/:id', async (req, res) => {
    try {
        const customer = await prisma.customer.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.json(customer);
        console.log(`Server Response: Get Data from DB Successfully`);
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
});

//PUT
app.put('/customer/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const customer = await prisma.customer.update({
            where: { id: id },
            data: payload
        });
        res.json(customer);
        console.log(`Server Response: Update Data in DB Successfully`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//DELETE
app.delete('/customer/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const customer = await prisma.customer.delete({
            where: { id: id },
        });
        res.json('Server Response: Delete Data in DB Sucessfully');
        console.log(`Server Response: Delete Data in DB Successfully`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//Search (with body Keyword, startWith)
app.get('/customer/startsWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customer = await prisma.customer.findMany({ //ข้อมูลทั้งหมด
            where: //ค้นหาในนั้น
            {
                name: //โดยที่ชื่อ
                    { startsWith: keyword } // startsWith ขึ้นต้นด้วย
            },
        });
        res.json(customer);
        console.log(`Server Response: Search Data in DB Successfully`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//Search (with body Keyword, endsWith)
app.get('/customer/endsWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customer = await prisma.customer.findMany({ //ข้อมูลทั้งหมด
            where: //ค้นหาในนั้น
            {
                name: //โดยที่ชื่อ
                    { endsWith: keyword } // endsWith ลงท้ายด้วย
            },
        });
        res.json(customer);
        console.log(`Server Response: Search Data in DB Successfully`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//Search (with body Keyword, contains)
app.get('/customer/contains', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customer = await prisma.customer.findMany({ //ข้อมูลทั้งหมด
            where: //ค้นหาในนั้น
            {
                name: //โดยที่ชื่อ
                    { contains: keyword } // contains มีอักษรอยุ่ในที่กรอก
            },
        });
        res.json(customer);
        console.log(`Server Response: Search Data in DB Successfully`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//Sort (By Name ASC)
app.get('/customer/sortByName', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const customer = await prisma.customer.findMany({ //ข้อมูลทั้งหมด
            orderBy:
            {
                name: 'asc'
            }
        });
        res.json(customer);
        console.log(`Server Response: Sort Data in DB Successfully`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Sort (By Name DESC)
app.get('/customer/sortByNameDesc', async (req, res) => {
    try {
        const customer = await prisma.customer.findMany({
            orderBy: {
                name: 'desc' // Change 'asc' to 'desc' for descending order
            }
        });
        res.json(customer);
        console.log(`Server Response: Sort Data in DB Successfully`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
// Sort Apply ต่อได้

// Sort 2 เงื่อนไข Where And
app.get('/customer/whereAnd', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: 'a'
                        }
                    },
                    {
                        credit: {
                            gte: 1000,
                        }
                    }
                ]
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Operator	Meaning	Example (price)
// gte	  |  Greater than or equal to   |	{ gte: 100 } (≥ 100)
// gt	  |  Greater than	            | { gt: 100 } (> 100)
// lte	  |  Less than or equal to	    | { lte: 100 } (≤ 100)
// lt	  |  Less than	                | { lt: 100 } (< 100)
// equals |  Equal to	                | { equals: 100 } (== 100)

// Sort 2 เงื่อนไข List Between
app.get('/customer/ListBetweenCredit', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                AND: [
                    {
                        credit: {
                            gt: 900,
                            lte: 3000,
                        }
                    }
                ]
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Sort 2 เงื่อนไข List Between
app.get('/customer/ListBetweenCredit', async (req, res) => {
    try {
        const customers = await prisma.customer.findMany({
            where: {
                AND: [
                    {
                        credit: {
                            gt: 900,
                            lte: 3000,
                        }
                    }
                ]
            }
        });
        res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// SUM Credit
app.get('/customer/sumCredit', async (req, res) => {
    try {
        const sumCredit = await prisma.customer.aggregate({ //
            _sum: {
                credit: true
            }
        });
        res.json({ sumCredit: sumCredit._sum.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Find Max Credit
app.get('/customer/maxCredit', async (req, res) => {
    try {
        const maxCredit = await prisma.customer.aggregate({
            _max: {
                credit: true
            }
        });
        res.json({ maxCredit: maxCredit._max.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Find Min Credit
app.get('/customer/minCredit', async (req, res) => {
    try {
        const minCredit = await prisma.customer.aggregate({
            _min: {
                credit: true
            }
        });
        res.json({ maxCredit: minCredit._min.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Find Average Credit
app.get('/customer/avgCredit', async (req, res) => {
    try {
        const avgCredit = await prisma.customer.aggregate({
            _avg: {
                credit: true
            }
        });
        res.json({ maxCredit: avgCredit._avg.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
// Count Customer
app.get('/customer/countCustomer', async (req, res) => {
    try {
        const count = await prisma.customer.count();
        res.json({ CustomerNo: count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//*/====================================================================================
// Create Order
app.post('/order/create', async (req, res) => {
    try {
        const customerId = req.body.customerId;
        const amount = req.body.amount;
        const order = await prisma.order.create({
            data: {
                customerId: customerId,
                amount: amount
            }
        });
        res.json(order);
        console.log("Create Order Successful")
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET Order by ID
app.get('/customer/listOrder/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const order = await prisma.order.findMany({
            where: {
                customerId: customerId,
            }
        });
        res.json(order);
        console.log("Get Order Successful")
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// GET All Cutomer and Order
app.get('/customer/listAllOrder', async (req, res) => {
    try {
        const orders = await prisma.customer.findMany({
            include: {
                Order: true
            }
        });
        res.json(orders);
        console.log("Get All Order Successful")
    } catch (error) {
        console.log("❌ Error fetching orders:", error);
        return res.status(500).json({ error: error.message });

    }
});

// GET All Cutomer, Order, Product
app.get('/customer/listOrderAndProduct/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const customers = await prisma.customer.findMany({
            where: {
                id: customerId
            },
            include: {
                Order: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.json(customers);
    } catch (error) {
        console.log("❌ Error fetching orders:", error);
        return res.status(500).json({ error: error.message });
    }
});

  //*/====================================================================================






//This tells Express to start a web server on the given port
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log(`http://localhost:3000`);
});
//http://localhost:3000/
//http://localhost:3000/check-db-connection
