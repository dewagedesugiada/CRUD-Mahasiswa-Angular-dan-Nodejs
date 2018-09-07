var mysql 		= require('mysql');
var express		= require('express');
var app = express();
const bodyParser	= require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var con = mysql.createConnection({
	host	 : 'localhost',
	user	 : 'root',
	password : '',
	database : 'db_nodejs'
});

con.connect((err) =>{
	if (!err)
		console.log('Database Connection succeded.. ');
	else
		console.log('Database Connection Failed \n Error :' + JSON.stringifity(err,undefined,2));
})

var port = "8080";
app.listen(port,() => console.log('APP Running on ' + port + '\n' + 'Create by Dewa Gd s'));

 app.get('/', (req,res) => res.end('Hello Words !!'));

// view data mahasiswa
app.get('/mahasiswa',(req,res) => {
	con.query('SELECT * FROM mahasiswa ', function (err, data, field){
		if (err){
               return res.json({status:404,message: 'Failed',result:[]});
		
		}else{
            return res.json({status:200,message:'success',result:data});
          
			 return res.json(result);
		}
	});
});

// tambah data mahasiswa
app.post('/mahasiswa',(req,res) =>{
	var tambah =req.body;
	con.query('INSERT INTO mahasiswa SET ?',{'npm':tambah.npm, 'nama':tambah.nama, 'jk':tambah.jk, 'no_hp':tambah.no_hp}, 
		(err,result,field) => {
		if (!err)  
		
				res.send(result.affectedRows+ 'Data Success Inserted');
			
			
		else
			console.log(err);

		});
});

// ambil data mahasiswa berdasarkan npm
app.get('/mahasiswa/:npm',(req,res) =>{

	var data = req.params
	
	con.query('SELECT COUNT (*) jumlah FROM mahasiswa WHERE npm=?',[data.npm],function(err,result,field){
		if (err) throw err ;

		if (result[0].jumlah !='0') {
			con.query('SELECT * FROM mahasiswa WHERE npm=?',[data.npm],function(err2,result2,fields){
				if (err2) throw err2 

				res.json(result2[0]);
			})
		}else{
			res.status(404);
			res.json({status : false, message : 'NPM is not exist !!'});
		}
	})

})

// ubah data mahasiswa
app.put('/mahasiswa/:npm',  (req,res) => {
	var data = req.params 
	var body = req.body
	con.query('SELECT COUNT (*) jumlah FROM mahasiswa WHERE npm=?',[body.npm],function(err,result,field){
		if (err) throw err

			// res.json(result);

		if (result[0].jumlah =='0' || data.npm == body.npm) {
			con.query('UPDATE mahasiswa SET npm = ?, nama = ?, jk = ?, no_hp=? WHERE npm = ?', 
				[body.npm, body.nama, body.jk, body.no_hp, data.npm], function(err2,result2,fields){
				if (err2) throw err 

					res.json({message:result2.affectedRows+ ' UPDATE Successfully..'});
			})
		}else{
			res.status(404);
			res.json({status : false, message: 'UPDATE vailed !!	'})
		}
	})
})

// Hapus data Mahasiswa
app.delete('/mahasiswa/:npm',(req,res) =>{

	con.query('DELETE FROM mahasiswa WHERE npm= ?',[req.params.npm],(err,result,fields) =>{
		if (!err) 
			res.send(result.affectedRows+ ' Deleted Successfully..');
		else
			console.log(err);
	})
})



	