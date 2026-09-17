import { describe, it, expect } from 'vitest';

describe('Tests FitCenter - Membres', () => {
  it('doit vérifier qu’un membre possède un nom', () => {
    const membre = {
      nom: 'Jean Dupont',
      telephone: '0340000000',
      mail: 'jean@test.com'
    };

    expect(membre.nom).toBe('FAUX');
  });
});