import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

app.post("/post", (req, res) => {
  console.log("connected to react");
  res.json({ status: "nice", message: "Bien reçu !" });
  res.redirect("/");
});

app.get('/', (req, res) => {
    res.send('Serveur Node.js opérationnel');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));