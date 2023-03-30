const express = require('express');
const passport = require('passport');

const log = require('./../../../utils/logger');
const likesController = require('./likes.controller');
const procesarErrores = require('../../libs/errorHandler').procesarErrores;
const { validarId } = require('../../libs/mongoUtils');

const jwtAuthenticate = passport.authenticate('jwt', { session: false });
const router = express.Router();


router.get('/all/likes', (req, res) => {
  return likesController.obtenerTodosLosLikes().then(likes => {
    res.json(likes);
  });
});


// likesRouter.get(
//   '/all/likes',
//   procesarErrores((req, res) => {
//     return likesController.obtenerTodosLosLikes().then(likes => {
//       res.json(likes);
//     });
//   })
// );


router.get('/:id/ledilike', [jwtAuthenticate, validarId], (req, res) => {
  const idFoto = req.params.id;
  log.info(
    `Usuario [${
      req.user.username
    }] pidió si le dio like a la foto con id [${idFoto}]`
  );
  return likesController.obtenerLike(idFoto, req.user.id).then(like => {
    res.json({ ledilike: !!like });
  });
});





// likesRouter.get(
//   '/:id/ledilike',
//   [jwtAuthenticate, validarId],
//   procesarErrores((req, res) => {
//     const idFoto = req.params.id;
//     log.info(
//       `Usuario [${
//         req.user.username
//       }] pidió si le dio like a la foto con id [${idFoto}]`
//     );
//     return likesController.obtenerLike(idFoto, req.user.id).then(like => {
//       res.json({ ledilike: !!like });
//     });
//   })
// );


router.get('/:id/likes', [jwtAuthenticate, validarId],(req, res) => {
  const idFoto = req.params.id;
  log.info(
    `Usuario [${req.user.username}] pidió likes para foto con id [${idFoto}]`
  );
  return likesController.obtenerLikes(idFoto).then(likes => {
    res.json(likes);
  });
})



// likesRouter.get(
//   '/:id/likes',
//   [jwtAuthenticate, validarId],
//   procesarErrores((req, res) => {
//     const idFoto = req.params.id;
//     log.info(
//       `Usuario [${req.user.username}] pidió likes para foto con id [${idFoto}]`
//     );
//     return likesController.obtenerLikes(idFoto).then(likes => {
//       res.json(likes);
//     });
//   })
// );




router.post('/:id/likes', [jwtAuthenticate, validarId],(req, res) => {
  const idFoto = req.params.id;
    return likesController.agregarLike(idFoto, req.user.id).then(like => {
      log.info(`Like agregado a post con id [${idFoto}]`, like);
      res.status(201).json(like);
    });
});





// likesRouter.post(
//   '/:id/likes',
//   [jwtAuthenticate, validarId],
//   procesarErrores((req, res) => {
//     const idFoto = req.params.id;
//     return likesController.agregarLike(idFoto, req.user.id).then(like => {
//       log.info(`Like agregado a post con id [${idFoto}]`, like);
//       res.status(201).json(like);
//     });
//   })
// );


router.delete('/:id/likes', [jwtAuthenticate, validarId],(req, res) => {
  const idFoto = req.params.id;
    return likesController.quitarLike(idFoto, req.user.id).then(like => {
      log.info(`Like removido de post con id [${idFoto}]`, like);
      res.json(like);
    });
})

// likesRouter.delete(
//   '/:id/likes',
//   [jwtAuthenticate, validarId],
//   procesarErrores((req, res) => {
//     const idFoto = req.params.id;
//     return likesController.quitarLike(idFoto, req.user.id).then(like => {
//       log.info(`Like removido de post con id [${idFoto}]`, like);
//       res.json(like);
//     });
//   })
// );

module.exports = router;
