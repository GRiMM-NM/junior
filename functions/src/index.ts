import * as dotenv from 'dotenv';
import * as functions from 'firebase-functions';
import * as mysql from 'mysql2/promise';

dotenv.config();

// Connexion à la base de données
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

interface QuoteRow {
  titre: string;
  description_Mission: string;
  statut_Mission: string;
  Id_Mission: string;
}

// 📥 Ajouter une mission
export const addMission = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { 
    titre,
    description_Mission,
    date_debut,
    date_fin,
    statut_Mission,
   } = req.body;

  if (!titre || !description_Mission || !date_debut || !date_fin||! statut_Mission) {
    res.status(400).send('Champs manquants');
    return;
  }
      const [rows] = await pool.query(
      'SELECT Id_Mission FROM mission ORDER BY Id_Mission DESC LIMIT 1'
    ) as [any[], any];

    let newId = 'M0001';
    if (rows.length > 0) {
      const lastId = rows[0].Id_Mission;
      const lastNumber = parseInt(lastId.replace('M', ''), 10);
      const nextNumber = lastNumber + 1;
      newId = `M${nextNumber.toString().padStart(4, '0')}`;
    }

  try {
    await pool.query(
      'INSERT INTO mission (Id_Mission, titre, description_Mission, date_debut, date_fin, statut_Mission, date_creation_mission) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        newId,
        titre.trim(), 
        description_Mission.trim(),
        date_debut.trim(),
        date_fin.trim(),
        statut_Mission.trim(),
        new Date(),
      ]
    );

    res.status(200).json({ success: true, titre, message:"Mission ajoutée avec succès" });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur MySQL');
  }
});

// 📥 Ajouter une mission
export const addArticle = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { 
    nom_article,
    contenu,
    auteur,
   } = req.body;

  if (!nom_article || !contenu || !auteur) {
    res.status(400).send('Champs manquants');
    return;
  }
      const [rows] = await pool.query(
      'SELECT Id_article FROM Article_veille2 ORDER BY Id_article DESC LIMIT 1'
    ) as [any[], any];

    let newId = 'A0001';
    if (rows.length > 0) {
      const lastId = rows[0].Id_article;
      const lastNumber = parseInt(lastId.replace('A', ''), 10);
      const nextNumber = lastNumber + 10;
      newId = `A${nextNumber.toString().padStart(4, '0')}`;
    }

  try {
    await pool.query(
      'INSERT INTO Article_veille2 (Id_article, nom_article, contenu, auteur, date_publication) VALUES (?, ?, ?, ?, ?)',
      [
        newId,
        nom_article.trim(), 
        contenu.trim(),
        auteur.trim(),
        new Date(),
      ]
    );

    res.status(200).json({ success: true, nom_article, message:"Article ajoutée avec succès" });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur MySQL');
  }
});



//ajoute des evenements

export const addEvenement = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { 
    nom_evenement,
    description_evenement,
    date_evenement,
    lieu,
    Type_evenement,
   } = req.body;

  if (!nom_evenement || !description_evenement || !date_evenement ||! lieu ||! Type_evenement) {
    res.status(400).send('Champs manquants');
    return;
  }
      const [rows] = await pool.query(
      'SELECT Id_evenement FROM Evenement2 ORDER BY Id_evenement DESC LIMIT 1'
    ) as [any[], any];

    let newId = 'E0001';
    if (rows.length > 0) {
      const lastId = rows[0].Id_evenement;
      const lastNumber = parseInt(lastId.replace('E', ''), 10);
      const nextNumber = lastNumber + 1;
      newId = `E${nextNumber.toString().padStart(4, '0')}`;
    }

  try {
    await pool.query(
      'INSERT INTO Evenement2 (Id_evenement, nom_evenement, description_evenement, date_evenement, lieu, Type_evenement) VALUES (?, ?, ?, ?, ?, ?)',
      [
        newId,
        nom_evenement.trim(), 
        description_evenement.trim(),
        date_evenement.trim(),
        lieu.trim(),
        Type_evenement.trim(),
      ]
    );

    res.status(200).json({ success: true, nom_evenement, message:"Evenement ajoutée avec succès" });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur MySQL');
  }
});

// ajoute historique 
export const addHistorique = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { 
    type_historique,
    nom,
    description_historique,
    date_action,
   } = req.body;

   const dateOnly = date_action.trim().slice(0, 10); // "2025-06-25"

  if (!type_historique || !nom || !description_historique ||! date_action) {
    res.status(400).send('Champs manquants');
    return;
  }
      const [rows] = await pool.query(
      'SELECT Id_historique FROM Historique4 ORDER BY Id_historique DESC LIMIT 1'
    ) as [any[], any];

    let newId = 'H0001';
    if (rows.length > 0) {
      const lastId = rows[0].Id_historique;
      const lastNumber = parseInt(lastId.replace('H', ''), 10);
      const nextNumber = lastNumber + 1;
      newId = `H${nextNumber.toString().padStart(4, '0')}`;
    }

  try {
    await pool.query(
      'INSERT INTO Historique4 (Id_historique, type_Historique, nom, description_historique, date_action) VALUES (?, ?, ?, ?, ?)',
      [
        newId,
        type_historique.trim(), 
        nom.trim(),
        description_historique.trim(),
        dateOnly,
      ]
    );

    res.status(200).json({ success: true, nom, message:"Historique ajoutée avec succès" });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur MySQL');
  }
});

//supprimer historique 

export const deleteHistorique = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { id_historique } = req.body;

  if (!id_historique) {
    res.status(400).send('Id requis');
    return;
  }

  try {
    await pool.query('DELETE FROM Historique4 WHERE Id_historique = ?', [id_historique]);
    res.status(200).json({ success: true, message: 'Historique supprimé avec succès' });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur serveur');
  }
});


//supprimer evenements 

export const deleteEvenement = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { id_evenement } = req.body;

  if (!id_evenement) {
    res.status(400).send('Id requis');
    return;
  }

  try {
    await pool.query('DELETE FROM Evenement WHERE Id_Evenement = ?', [id_evenement]);
    res.status(200).json({ success: true, message: 'Événement supprimé avec succès' });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur serveur');
  }
});


//supprimer artcile 

export const deleteArticle = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { id_article } = req.body;

  if (!id_article) {
    res.status(400).send('Id requis');
    return;
  }

  try {
    await pool.query('DELETE FROM Article_veille2 WHERE Id_article = ?', [id_article]);
    res.status(200).json({ success: true, message: 'Article supprimé avec succès' });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur serveur');
  }
});

//supprimer mission

export const deletemission = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'DELETE') {
    res.status(405).send('Méthode non autorisée');
    return;
  }

  const { id_mission } = req.body;

  if (!id_mission) {
    res.status(400).send('Id requis');
    return;
  }

  try {
    await pool.query('DELETE FROM Mission WHERE Id_Mission = ?', [id_mission]);
    res.status(200).json({ success: true, message: 'Mission supprimée avec succès' });
  } catch (error) {
    console.error('Erreur MySQL', error);
    res.status(500).send('Erreur serveur');
  }
});



// 📤 Récupérer les titres de missions
export const getTitle_Mission = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT titre FROM mission');
    const quotes = (rows as QuoteRow[]).map(row => row.titre);
    res.status(200).json({ quotes });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});

// 📤 Récupérer les descriptions de missions
export const getDescription_Mission = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT description_Mission FROM mission');
    const quotes = (rows as QuoteRow[]).map(row => row.description_Mission);
    res.status(200).json({ quotes });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});

export const getstatut_Mission = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT statut_Mission FROM mission');
    const quotes = (rows as QuoteRow[]).map(row => row.statut_Mission);
    res.status(200).json({ quotes });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});

export const getId_Mission = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Id_Mission FROM mission');
    const quotes = (rows as QuoteRow[]).map(row => row.Id_Mission);
    res.status(200).json({ quotes });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});

export const getMission = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Id_Mission, titre, description_Mission, date_debut, date_fin, statut_Mission, date_creation_mission FROM mission');
    res.status(200).json({ mission : rows });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});

export const getArticle = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Id_article, nom_article, contenu, auteur, date_publication FROM article_veille2');
    res.status(200).json({ article : rows });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});

export const getEvenement = functions.https.onRequest(async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT Id_evenement, nom_evenement, description_evenement, date_evenement, lieu, Type_evenement FROM Evenement2');
    res.status(200).json({ evenement : rows });
  } catch (err) {
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
});


export const getHistorique = functions.https.onRequest(async(req, res)=>{
  try{
    const [rows]=await pool.query('SELECT Id_historique, type_Historique, nom, description_historique, date_action FROM historique4');
    res.status(200).json({historique : rows});
  } catch (err){
    console.error('Erreur MySQL', err);
    res.status(500).send('Erreur MySQL');
  }
})