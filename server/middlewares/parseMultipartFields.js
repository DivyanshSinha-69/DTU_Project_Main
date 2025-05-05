import Busboy from 'busboy';

// This middleware parses only fields from multipart/form-data and ignores files
export function parseMultipartFields(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  if (contentType.startsWith('multipart/form-data')) {
    const busboy = Busboy({ headers: req.headers, limits: { files: 0 } });
    req.body = {};

    busboy.on('field', (fieldname, value) => {
      req.body[fieldname] = value;
    });

    busboy.on('finish', () => {
      next();
    });

    req.pipe(busboy);
  } else {
    next();
  }
}
