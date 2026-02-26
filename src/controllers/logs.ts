import { differenceInMilliseconds } from 'date-fns';
import { Request, Response } from 'express';
import { Log } from '../entities/Log.js';
import { habits } from '../models/habits.js';
import { logIdCounter, logs } from '../models/logs.js';
import { pets } from '../models/pets.js';
import { CreateLogSchema } from '../validators/logs.js';
import { NEGLECT_THRESHOLD_MS } from './utils/config.js';

export function logHabit(req: Request, res: Response) {
  const result = CreateLogSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ errors: result.error });
    return;
  }
  const habitId = result.data.habitId;

  // check if pet exists; therefore, check if petId exists
  const pet = pets.find((p) => p.id === Number(req.params.petId));
  if (!pet) {
    res.status(404).json({ error: 'Pet not found' });
    return;
  }
  // check if pet is cooked
  if (differenceInMilliseconds(new Date(), pet.lastFedAt) > NEGLECT_THRESHOLD_MS) {
    res.status(400).json({ error: 'Pet has been cooked. Adopt another one.' });
    return;
  }

  // check if habitId exists; therefore, check if habit exists
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) {
    res.status(404).json({ error: 'Habit not found' });
    return;
  }

  // check if petId and habitId match
  if (habit.petId !== pet.id) {
    res.status(400).json({ error: 'petId & habit.petId mismatch' });
    return;
  }

  // create new log
  const newLog: Log = {
    id: logIdCounter.value++,
    petId: pet.id,
    habitId: habit.id,
    date: new Date().toISOString(),
    note: result.data.note,
  };
  // boost appropriate stat
  const stat = habit.statBoost;
  pet[stat] += 10;
  // update lastFedAt
  pet.lastFedAt = new Date();
  // return log with 201
  logs.push(newLog);
  res.status(201).json(newLog);
}
