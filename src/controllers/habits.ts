import { differenceInMilliseconds } from 'date-fns';
import { Request, Response } from 'express';
import { Habit } from '../entities/Habit.js';
import { habitIdCounter, habits } from '../models/habits.js';
import { pets } from '../models/pets.js';
import { CreateHabitSchema } from '../validators/habits.js';
import { NEGLECT_THRESHOLD_MS } from './utils/config.js';

export function createHabit(req: Request, res: Response) {
  const result = CreateHabitSchema.safeParse(req.body);
  const identifier = Number(req.params.petId);

  const pet = pets.find((p) => p.id === identifier);
  // Check if pet is cooked or not. If cooked, throw 400 error.
  if (differenceInMilliseconds(new Date(), pet.lastFedAt) > NEGLECT_THRESHOLD_MS) {
    res.status(400).json({ error: 'This pet has been cooked. Adopt a new one' });
    return;
  }
  // for determing if the pet we are looking for exists
  if (!pet) {
    res.status(404).json({ error: 'Pet not found' });
    return;
  }

  const newHabit: Habit = {
    id: habitIdCounter.value++,
    petId: identifier,
    name: result.data.name,
    category: result.data.category,
    targetFrequency: result.data.targetFrequency,
    statBoost: result.data.statBoost,
  };

  habits.push(newHabit);
  res.status(201).json(newHabit);
}

export function getHabit(req: Request, res: Response) {
  const identifier = Number(req.params.petId);
  // for determing if the pet we are looking for exists
  const pet = pets.find((p) => p.id === identifier);
  if (!pet) {
    res.status(404).json({ error: 'Pet not found' });
    return;
  }
  const petHabits = habits.filter((h) => h.petId === identifier);
  res.status(200).json(petHabits);
}
