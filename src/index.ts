import 'dotenv/config';
import express, { Express } from 'express';

const app: Express = express();

app.use(express.json());

// --- Your routes will go below this line ---
import { createPet, deletePet, getPet, getPets, updatePet } from './controllers/pets.js';

// --- One Post, Two Gets, One Put, One Delete ---
app.post('/pets', createPet);
app.get('/pets', getPets);
app.get('/pets/:petId', getPet);
app.put('/pets/:petId', updatePet);
app.delete('/pets/:petId', deletePet);
// --- Your routes will go above this line ---

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Tender listening on http://localhost:${PORT}`);
});
