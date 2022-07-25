const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;
const mysql = require("mysql");
const fs = require("fs");

const dbinfo = fs.readFileSync('./database.json');

const conf = JSON.parse(dbinfo);

const connection = mysql.createConnection({
    host:conf.host,
    user:conf.user,
    password:conf.password,
    port:conf.port,
    database:conf.database,
});
app.use(express.json());
app.use(cors());

//요청 작성 시작

app.get('/reservation', async (req, res)=> {
    connection.query(
        "select * from Reservation",
        (err, rows, fields)=>{
            res.send(rows);
        }
    )
})
app.get('/members', async (req, res)=> {
    connection.query(
        "select * from members",
        (err, rows, fields)=>{
            res.send(rows);
        }
    )
})
app.get('/herokutest', async (req, res)=> {
    connection.query(
        "select * from herokutest",
        (err, rows, fields)=>{
            res.send(rows);
        }
    )
})
app.get('/rescheck/:name', async (req, res)=> {
    const params = req.params.name;
    connection.query(
        `select * from Reservation where name='${params}'`,
        (err, rows, fields)=>{
            if(!rows){
                console.log(err);
            }
            console.log(rows);
            res.send(rows);
        }
    )
})

app.post('/createRes', async (req, res)=> {
    console.log(req.body);
    const { room, imgsrc, checkin, checkout, adult, kids, name} = req.body;
    connection.query(`insert into Reservation(room, imgsrc, checkin, checkout, adult, kids, name) values("${room}","${imgsrc}","${checkin}","${checkout}","${adult}","${kids}","${name}")`, 
    (err, rows, fields)=>{
        res.send(rows);
    })
})
app.post('/createMem', async (req, res)=> {
    const { name, phone, birth, gender, addr1, addr2} = req.body;
    connection.query(`insert into members(name, phone, birth, gender, addr1, addr2) values("${name}","${phone}","${birth}","${gender}","${addr1}","${addr2}")`,
    (err, rows, fields)=>{
        res.send(`${name} 회원가입 성공`);
    })
})
app.post('/userlogin', async (req, res)=>{
    const { name, phone } = req.body;
    
    connection.query(`select * from members where name="${name}"`,
    (err, row)=>{
        const result = row[0]
        if(!err){
            if(!result){
                res.send('id is undefined');
            }else{
                if(phone !== result.phone){
                    res.send('pw is undefined');
                }else{
                    res.send('login successed');
                }
            }
        }else{
            console.log(err);
        }
    })
})

app.delete('/delres/:id', async (req, res) => {
    const params = req.params;
    connection.query(`delete from Reservation where id = ${params.id}`, (err, rows, fields) => {
        res.send(rows);
    })
})

//요청 작성 종료

app.listen(port, ()=>{
    console.log("스트라토 서버가 돌아가고 있습니다.");
})