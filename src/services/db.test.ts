import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { db } from './db';
import Dexie from 'dexie';

// Since we are in Node.js env, we need to mock indexedDB
import 'fake-indexeddb/auto';

describe('HabitTrackerDB', () => {

  beforeEach(async () => {
    // Manually reset the database between tests
    await db.delete();
    await db.open();
  });

  afterEach(async () => {
    await db.close();
  });

  it('should create default settings on population', async () => {
    // The populate event should be triggered by db.open()
    const settings = await db.settings.get(0);
    expect(settings).toBeDefined();
    expect(settings?.theme).toBe('system');
    expect(settings?.language).toBe('en');
  });

  it('should allow adding a new habit', async () => {
    const newHabit = {
      name: 'Test Habit',
      color: '#ff0000',
      icon: '🧪',
      frequency: { type: 'daily' as const },
      reminder: { enabled: false },
      createdAt: new Date(),
      archived: false,
    };
    const id = await db.habits.add(newHabit);
    const habit = await db.habits.get(id);

    expect(habit).toBeDefined();
    expect(habit?.name).toBe('Test Habit');
  });

  it('should allow updating a habit', async () => {
    const newHabit = {
      name: 'Update Me',
      color: '#ff0000',
      icon: '🧪',
      frequency: { type: 'daily' as const },
      reminder: { enabled: false },
      createdAt: new Date(),
      archived: false,
    };
    const id = await db.habits.add(newHabit);

    await db.habits.update(id, { name: 'Updated Name' });
    const updatedHabit = await db.habits.get(id);

    expect(updatedHabit?.name).toBe('Updated Name');
  });

  it('should allow deleting a habit', async () => {
    const newHabit = {
      name: 'Delete Me',
      color: '#ff0000',
      icon: '🧪',
      frequency: { type: 'daily' as const },
      reminder: { enabled: false },
      createdAt: new Date(),
      archived: false,
    };
    const id = await db.habits.add(newHabit);

    await db.habits.delete(id);
    const habit = await db.habits.get(id);

    expect(habit).toBeUndefined();
  });
});
