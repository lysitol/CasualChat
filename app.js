let express=require('express')
let app=express()
let form=require('formidable')
let urll=require('url')
let mysql=require('mysql')
let connection=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'qqq'
    
})
connection.connect()
let cookie=require('cookie-parser')
app.use(cookie())
let server=require('http').Server(app)
let io=require('socket.io')(server)
app.use(express.static('node_modules'))
app.set('view engine','ejs')
app.set('views','./views')
app.get('/index',(req,res)=>{
    res.render('index')
    res.end()
})
//登录页面
app.get('/login',(req,res)=>{
    res.render('login')
    res.end()
})
//登录操作
app.post('/dologin',(req,res)=>{
    let form2=new form.IncomingForm()
    form2.parse(req,(err,files)=>{
        let {username,password}=files
        let sql='select * from userconnect where username=?'
        let list=[username]
        let sql2=mysql.format(sql,list)
        connection.query(sql2,(error,results)=>{
            if(!error){
                
                if(results.length>0 && results[0].username==username){
                    res.cookie('uname',username)
                    res.redirect('/index')
                    res.end()
                }
            }
        })
    })
})
//加载注册
app.get('/regist',(req,res)=>{
    let sql='select * from userconnect'
    connection.query(sql,(error,results)=>{
        res.render('regist',{data:results})
        res.end()
    })
})
//注册操作
app.post('/doregist',(req,res)=>{
    let form2=new form.IncomingForm()
    form2.parse(req,(err,fileds)=>{
        let {username,password}=fileds
        let sql='insert into userconnect (username,password) values(?,?)'
        let list=[username,password]
        let sql2=mysql.format(sql,list)
        connection.query(sql2,(error,results)=>{
            if(!error){
                if(results.affectedRows>0){
                    res.redirect('/index')
                    res.end()
                }
            }
        })
    })
})

//退出
app.get('/out',(req,res)=>{
    res.clearCookie('uname')
    res.redirect('/index')
    res.end()
})



server.listen(8090)
io.on('connection',socket=>{
    socket.on('home',data=>{
        console.log(data);
        socket.broadcast.emit('home',data)
    })
})

io.on('connection',socket=>{
    socket.on('laile',data=>{
        console.log(data);
        socket.broadcast.emit('laile',data)
    })
})

