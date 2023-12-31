require("dotenv").config();
const express  = require('express');
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true})); 
const axios = require("axios");
const pg = require("pg");
const http = require("http");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { Server } = require("socket.io");
app.use(cors())

PGHOST='ep-floral-fire-711938.ap-southeast-1.aws.neon.tech'
PGDATABASE='neondb'
PGUSER='Yuvaraj787'
PGPASSWORD='ozBmfeCq68Ox'
ENDPOINT_ID='Chat Application'

// pg_dump --host ep-floral-fire-711938.ap-southeast-1.aws.neon.tech --port 5432 --user Yuvaraj787 neondb  > backup.sql


var conn = new pg.Client({
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    port: 5432,
    host: PGHOST,
    ssl: true
});

conn.connect((err)=>{
    if (err) console.log("Error in connecting to db : ",err.message)
    else console.log("Connected successfully to db")
})

const verifyToken = (req,res,next) => {
    const token = req.headers["authtoken"];
    jwt.verify(token, "key1", (err,decoded)=>{
        if (err) {
            console.log("Token not verified, reason : ",err.message)
            res.json({wrongToken:true})
        }
        else {
            req.id = decoded.id;
            console.log("Token verified id : ",decoded);
            next();
        }
    })
}

const server = http.createServer(app);

const io = new Server(server, {
    cors : {
        origin:["http://localhost:5173","http://localhost:5174","https://chat-app-project-nu.vercel.app"],
        methods: ['GET','POST']
    }
})


io.on("connection",(socket)=>{
    console.log("User Connected : ",socket.id);
    socket.on("join_room",(data)=>{
        console.log("Joined room of id : ",data)
        socket.join(data)
    })
    socket.on("disconnecting", (det) => {
        console.log("Connection Losting")
        const it = socket.rooms.values();
        socket.to(it.next().value).emit("receive_message",{
            type:"offline"
        })
        socket.to(it.next().value).emit("receive_message",{
            type:"offline"
        })
    });

    
    socket.on("send_message",async (mdata)=>{
        const id = jwt.decode(mdata.senderToken).id;
        console.log("Sender id : ",id);
        if (mdata.type == "req-game-values") {
            console.log("game values received : ",mdata.values);
        }
        try {
            await  (mdata.type == "text" || mdata.type == "image" || mdata.type == "location") && 
            conn.query(`insert into room_no_${mdata.room} (message, type, sender, receiver) values ($1, $2, $3, $4)`,[mdata.message,mdata.type,id,0])
        } catch (err) {
            console.log("Error in update message values to db reason : ",err.message)
        }
        socket.to(mdata.room).emit("receive_message",{
            message: mdata.message,
            userid : id,
            type: mdata.type,
            values:mdata.values
        })
    })
})


app.get("/suggest", (req,res) => {
    axios({
      url: "https://api.openai.com/v1/chat/completions",
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        ContentType: "application/json"
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: [{
          "role": "system",
          "content": "Give me a just js array without variable name (i.e you should start from [ and end with ] also do not include new line escape sequence like \n )  that contains 3 short replies for " + req.query.msg + "(I need Just a friendly reply (suggest replies for chatting. give replies for the given messge. your suggestion should be valid answer to the given message.). I need chatting type of english. give reply in tanglish if given message is in tanglish or tamil sometimess)"
        }],
        temperature: 0.7
      }
    }).then((c) => {
        res.json({array:JSON.parse(c.data.choices[0].message.content)});
    }).catch((err) => {
        console.log("error in retreive from open ai : "  + err.message);
        res.json({error:err.message});
    })
})

app.post("/verify", verifyToken, (req,res)=>{
    res.json({verified:true});
})


app.post("/signup",async (req,res) => {
   const response = {uniqueEmail : true, otherErrors: false}
   
   const data = req.query
   try {
    const docs = await conn.query("select * from userDetails where email = $1",[data.email])
    if (docs.rowCount != 0) {
        response.uniqueEmail = false;
    }
   } catch (err) {
    console.log("Error in checking email has already exit in db : ",err.message);
   } 
   
   if (response.uniqueEmail) {
    try {
       await conn.query("insert into userDetails (email,phone,username,password,dpImg) values ($1,$2,$3,$4,$5)",[data.email,data.phone,data.uname,data.pwd,data.img]) 
       console.log(`Inserting record for user ${data.uname} is success!`);
    } catch (err) {
       response.otherErrors = true
        console.log("Error in inserting user data : ",err.message);
    }
   }
   res.json(response);
})


app.post("/login",async (req, res) => {
    const data = req.query
    const response = {correct : false, newEmail : false, wrgPwd : true, username: "", token: ""}
    try {
        const docs = await conn.query("select userid,username,password from userDetails where email = $1",[data.email]);
        if (docs.rowCount == 0) {
            response.newEmail = true
        } else {
            if (docs.rows[0].password === data.pwd) {
                response.correct = true
                response.username = docs.rows[0].username
                response.token = jwt.sign({id : docs.rows[0].userid},"key1",{
                    expiresIn: 29000
                });
                response.wrgPwd = false;
                console.log("Pwd correct ! Login success!");
            } else {
                console.log("Wrong Password!");
                response.wrgPwd = true
            }
        }
        res.json(response)
    } catch (err) {
        console.log("Error in verifying user crediantials in login form error : ",err.message)
    }
})

app.get("/myprofile", verifyToken, async (req,res) => {
    const docs = await conn.query("select * from userDetails where userid = $1",[req.id]);
    console.log(docs.rows);
    res.json({details: docs.rows[0]});
})

app.get("/profile", verifyToken, async (req,res) => {
    const docs = await conn.query("select * from userDetails where userid = $1",[req.query.userid]);
    res.json({details: docs.rows[0]});
})


app.get("/setAbout", verifyToken, async (req, res) => {
    try {
        await conn.query("update userDetails set about = $1 where userid = $2",[req.query.about,req.id]);
    } catch (err) {
        res.json({success:false});
    }
    res.json({success:true});
})

app.get("/getlist", verifyToken, async (req,res)=>{
    var result = [];
    try {
        const docs = await conn.query("select t.roomid, t.user1, t.user2, u1.username as username1, u2.username as username2,u1.dpImg as dp1,u2.dpImg as dp2  from chatrooms t join userDetails u1 on t.user1 = u1.userid join userDetails u2 on t.user2 = u2.userid where user1 = $1 or user2 = $1",[req.id])
        docs.rows.forEach(row => {
            if (row.user1 == req.id) {
                result.push(
                    {
                        id:row.user2,
                        name:row.username2,
                        roomid:row.roomid,
                        selected:false,
                        dp:row.dp2
                    }
                )
            } else {
                result.push(
                    {
                        id: row.user1,
                        name:row.username1,
                        roomid:row.roomid,
                        selected:false,
                        dp:row.dp1
                    }
                )
            }
        });
    } catch (err) {
        console.log("Error in retrieving the contacts of the user : ",err.message);
    }
    res.json({list:result});
})


app.post("/addchat", verifyToken, async (req,res)=>{
    const response = {success : false, alreadyExist : false, NotExist : false}
    const data = req.query
    var userid;
    try {
    const temp = await conn.query("select userid from userDetails where email = $1",[data.email])
    if (temp.rowCount == 0) {
        response.NotExist = true
    } else {
        userid = temp.rows[0].userid
    }
    } catch (err) {
    console.log("Error in retreiving userid : ",err.message);
    }
    if (!response.NotExist) {
        try {
        const docs = await conn.query("select * from chatrooms where (user1 = $1 and user2 = $2) or (user1 = $2 and user2 = $1)",[req.id,userid]);
        if (docs.rowCount != 0) {
           response.alreadyExist = true
        }
        } catch (err) {
            console.log("Error in checking the room for users : ",err.message);
        }
    }
    
    if (!response.alreadyExist && !response.NotExist) {
        try {
        await conn.query("insert into chatrooms (user1,user2) values ($1,$2)",[req.id,userid])
        const docs = await conn.query("select * from chatrooms where (user1 = $1 and user2 = $2) or (user1 = $2 and user2 = $1)",[req.id,userid]);
        var roomid = docs.rows[0].roomid;
        await conn.query(`create table room_no_${roomid} (message varchar(100),type varchar(10),sender int, receiver int)`)
        response.success = true;
        } catch (err) {
            console.log("Error in creating rooms : ",err.message)
        }
    }
    res.json(response)
})


app.get("/getChat", verifyToken, async (req,res) => {
    var docs;
    try {
    docs = await conn.query(`select * from room_no_${req.query.roomid}`);
    } catch (err) {
        console.log("Error in fetching chat :",err.message);
        res.json({success:false})
    }
    // console.log("Chat fetched : ",docs.rows);
    // console.log("opposite side : ",req.query);
    const response = docs.rows.map(row => {
        let data = {
            message : row.message,
            sent : (row.sender === req.id),
            type: row.type ? row.type : "image"
        }
        return data
    })
    res.json({success:true,chats:response})
})

app.get("/dp",verifyToken, async (req,res) => {
    await conn.query("select dpimg from userDetails where userid = $1",[req.id],(err,docs) => {
        if (err) console.log("Error in getting dp ",err.message);
        else {
            console.log("Dp sent successfully")
            res.json({dp:docs.rows[0].dpimg});
        }
    })
})

server.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})