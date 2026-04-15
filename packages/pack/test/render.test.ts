import type { Skill } from '@android-skills/core';
import { describe, expect, it } from 'vitest';
import { flattenWithReferences, singleLine } from '../src/render.js';

describe('singleLine', () => {
  it('collapses internal whitespace', () => {
    expect(singleLine('foo   bar\nbaz')).toBe('foo bar baz');
  });

  it('trims edges', () => {
    expect(singleLine('  foo  ')).toBe('foo');
  });
});

describe('flattenWithReferences', () => {
  it('returns body unchanged when there are no references', () => {
    const skill = makeSkill({ body: 'hello\n', references: [] });
    expect(flattenWithReferences(skill)).toBe('hello');
  });

  it('appends each reference under a "## relPath" heading', () => {
    const skill = makeSkill({
      body: 'main',
      references: [
        { relPath: 'references/a.md', absPath: '/x/references/a.md', content: 'A' },
        { relPath: 'references/b.md', absPath: '/x/references/b.md', content: 'B' },
      ],
    });
    const out = flattenWithReferences(skill);
    expect(out).toContain('# Inlined references');
    expect(out).toContain('## references/a.md');
    expect(out).toContain('A');
    expect(out).toContain('## references/b.md');
    expect(out).toContain('B');
  });
});

function makeSkill(overrides: Partial<Skill>): Skill {
  return {
    name: 't',
    description: '',
    category: '',
    path: '',
    dir: '',
    body: '',
    headings: [],
    keywords: [],
    frontmatter: {
      name: 't',
      description: '',
      metadata: { keywords: [] },
    },
    references: [],
    ...overrides,
  } as Skill;
}
