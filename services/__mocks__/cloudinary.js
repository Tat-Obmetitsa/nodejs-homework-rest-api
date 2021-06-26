module.exports = {
  v2: {
    config: () => {},
    uploader: {
      upload: (a, b, cb) => {
        cb(null, { public_id: '12345678945', secure_url: 'secure_url' });
      },
    },
  },
};