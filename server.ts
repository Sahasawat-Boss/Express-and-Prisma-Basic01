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

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    console.log(`http://localhost:3000`);
});

//http://localhost:3000/
//http://localhost:3000/check-db-connection
