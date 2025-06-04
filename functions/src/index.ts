import * as functions from 'firebase-functions';
import * as mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

interface QuoteRow {
  text: string;
}

export const getQuotes = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT text FROM Utilisateur-quotes'
    );
    const quotes = (rows as QuoteRow[]).map(row => row.text);
    res.status(200).json({ quotes });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});
