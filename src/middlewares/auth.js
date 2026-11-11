exports.exigirLogin = (req, res, next) => {
  if (!req.session.usuario) return res.redirect('/login');
  next();
};

exports.exigirTipo = (tipo) => (req, res, next) => {
  if (!req.session.usuario) return res.redirect('/login');
  if (req.session.usuario.tipo !== tipo) {
    return res.status(403).send('Acesso negado para o seu tipo de conta.');
  }
  next();
};