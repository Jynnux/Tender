import 'dotenv/config';
import express, { Express } from 'express';

const app: Express = express();

app.use(express.json());

// --- Your routes will go below this line ---
import { createHabit, getHabit } from './controllers/habits.js';
import { logHabit } from './controllers/logs.js';
import { createPet, deletePet, getPet, getPets, updatePet } from './controllers/pets.js';

// --- Pet Manipulation: One Post, Two Gets, One Put, One Delete ---
app.post('/pets', createPet);
app.get('/pets', getPets);
app.get('/pets/:petId', getPet);
app.put('/pets/:petId', updatePet);
app.delete('/pets/:petId', deletePet);
// --- Habit Manipulation: One Post, One Get ---
app.post('/pets/:petId/habits', createHabit);
app.get('/pets/:petId/habits', getHabit);
// --- Log Manipulation: One Post ---
app.post('/pets/:petId/logs', logHabit);
// --- Your routes will go above this line ---

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Tender listening on http://localhost:${PORT}`);
});
