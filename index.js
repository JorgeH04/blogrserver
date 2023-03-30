if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}    

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const postsRouter = require('./api/recursos/posts/posts.routes');
const usuariosRouter = require('./api/recursos/usuarios/usuarios.routes');
const amistadesRouter = require('./api/recursos/amistades/amistades.routes');
const comentariosRouter = require('./api/recursos/comentarios/comentarios.routes');
const likesRouter = require('./api/recursos/likes/likes.routes');
const logger = require('./utils/logger');
const authJWT = require('./api/libs/auth');
const config = require('./config');
const errorHandler = require('./api/libs/errorHandler');
const path = require('path');
const multer = require('multer');
const methodOverride = require('method-override');
const cors = require('cors');


const passport = require('passport');
passport.use(authJWT);
 
require('./database');


const app = express();

app.set('port', process.env.PORT || 4000);

// middlewares
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));

//app.use(cors({origin: 'https://blogig.netlify.app'}));
  
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'public/img/uploads'), 
  filenameuno: (req, files, cb, filenameuno) => {
    console.log(files);
       cb(null, uuid() + path.extname(files.originalnameuno));
  },
  filenamedos: (req, files, cb, filenamedos) => {
    console.log(files)
     cb(null, uuid() + path.extname(files.originalnamedos));
},
   filenametres: (req, files, cb, filenametres) => {
  console.log(files);
   cb(null, uuid() + path.extname(files.originalnametres));
},
}) 
   

app.use(multer({ storage: storage }).array('files', 12))



app.use(bodyParser.json());
app.use(bodyParser.raw({ type: 'image/*', limit: '8mb' }));
app.use(
  morgan('short', {
    stream: {
      write: message => logger.info(message.trim())
    }
  })
);

// Servir archivos estáticos que están en la carpeta public/
app.use(express.static('public'));

// Servir las imagenes que vienen de seedear la data
app.use('/imagenes', express.static('public/imagenes_seed'));

app.use(passport.initialize());

app.use('/api/usuarios', usuariosRouter);
app.use('/api/posts', [postsRouter, comentariosRouter, likesRouter]);
app.use('/api/amistades', amistadesRouter);

 

let server;

 
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});          

// module.exports = {
//   app,
//   server
// };
      