import db from '../database';

export default function flushDb() {
  if (process.env.NODE_ENV === 'production') return;

  db.drop()
    .then(() => {
      db.sync({ force: true });
    })
    .then(() => {
      /* eslint-disable-next-line no-console */
      console.log('FLUSHED THE DB');
      process.exit();
    });
}

flushDb();
