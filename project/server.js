const express = require('express'); //importing EXPRESS after Istalling package JSON file and EXPRESS
const mustacheExpress = require('mustache-express'); //Installed MUSTACHE in place of EJS in cmd. "npm install mustache-express -save"
const bodyParser = require('body-parser');
const app = express();
const mustache = mustacheExpress();
const {Client} = require('pg');  //PG Module required for client in order to connect database. It is initialization of client.
mustache.cache = null;
app.engine('mustache', mustache); //making MUSTACHE a view engine
app.set('view engine', 'mustache');



app.use(express.static('publicStatic')); //Using publicStatic folder for all kinds of static files

app.use(bodyParser.urlencoded({extended: false})); //We need to tell the EXPRESS that we are using PARSER


//-----------------------Setting up route for meds.moustache---------------------------
app.get('/meds', (req, res)=>{ 

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical1',
        password: '1234',
        port: 5432,
    })

client.connect()
    .then(() =>{
        return client.query('SELECT * FROM meds');

    })
    .then((results)=>{
        console.log('results?', results);
        res.render('meds', results); //Joining and viewing meds page with results
    });
    
       
});
//----------------------------------------------------------------------------------



//-------------CREATING DASHBOARD---------------------------------------------------

app.get('/dashboard', (req, res) =>{

    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical1',
        password: '1234',
        port: 5432,
    })

client.connect()
    .then(() =>{
        return client.query('SELECT SUM(count) FROM meds; SELECT DISTINCT COUNT(brand) FROM meds');

    })
    .then((results)=>{
        console.log('?results', results[0]);
        console.log('?results', results[1]);
        res.render('dashboard', {res1:results[0].rows, res2:results[1].rows}); //Joining and viewing meds page with results
    })

})

//------------------------------------------------------------------------------------









//----------------------Setting up route for med-form.moustache-----------------------
app.get('/add', (req, res)=>{
    res.render('med-form'); //Rendering MED-FORM with get method
});
//------------------------------------------------------------------------------------






app.post('/meds/add', (req, res)=>{ //POST method is used to send data to the database
                                    //We need to REDIRECT the users to the MEDS page when they want to ADD data
    console.log('post-body', req.body); //Body Parser to show results.
    res.redirect('/meds');              //To redirect to MEDS page after button click event
    
    //Establishing connection to Client
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'medical1',
        password: '1234',
        port: 5432,
    })
//------------------------------------------------------------------------------
//----------------------CONNECTING DATABASE-------------------------------------

client.connect(function(err){
    if (err) throw err;
        console.log('Connection done');
        const sql = 'INSERT INTO meds (name, count, brand) VALUES ($1, $2, $3)';
        const params = [req.body.name, req.body.count, req.body.brand];
        return client.query(sql, params);
    });
        
   //We need body PARSER here to install to show the action done by SUBMIT BUTTON
    // In CMD -->>> "npm install body-parser --save" 
});




//---------------------DELETE ELEMENTS IN DATABASE-----------------------------
app.post('/meds/delete/:id', (req, res)=>{

    const client = new Client({

   
        user: 'postgres',
        host: 'localhost',
        database: 'medical1',
        password: '1234',
        port: 5432,
    })
//---------CONNECTING DATABASE------

client.connect()
.then(() =>{
    //delete specific ID from database
    const sql = 'DELETE FROM meds WHERE mid = $1'
    const params = [req.params.id];
    return client.query(sql, params);

})
.then((results)=>{
    res.redirect('/meds');
});

});
//We need a client and for that we need PG Package



//------------------------------EDITING THE DATABASE-------------------------
//for that we need to get the data from the server. get() method is used

app.get('/meds/edit/:id', (req, res) =>{

       const client = new Client({
    
       
            user: 'postgres',
            host: 'localhost',
            database: 'medical1',
            password: '1234',
            port: 5432,
        });
    //---------CONNECTING DATABASE------
    
    client.connect()
    .then(() =>{
        //Extracting from server
        const sql = 'SELECT * FROM meds WHERE mid = $1'
        const params = [req.params.id];
        return client.query(sql, params);
    
    }) 
    .then((results)=>{
        console.log('results?', results);
        res.render('meds-edit',{med: results.rows[0]}); //joining html page & not redirecting
    });
});


//---------------SAVE FUNCTION AFTER SUBMITTING EDITED DATA-----------------------

app.post('/meds/edit/:id', (req, res) => { //Save button after editing. Post method

    const client = new Client({
    
       
        user: 'postgres',
        host: 'localhost',
        database: 'medical1',
        password: '1234',
        port: 5432,
    });
//---------CONNECTING DATABASE------

client.connect()
.then(() =>{
    //Saving/updating data to the server
    const sql = 'UPDATE meds SET name = $1, count = $2, brand = $3 WHERE mid = $4' //$4 comes from the post method id.
    const params = [req.body.name, req.body.count, req.body.brand, req.params.id];
    return client.query(sql, params);

})
.then((results)=>{
    console.log('results?', results);
    res.redirect('/meds'); //redirecting to MEDS page 
});
});




app.listen(5001,()=> {
    console.log('listening to port 5001');

});



