import test from 'tape';
import RoleId from '@gdbots/schemas/gdbots/iam/RoleId';
import Role from '@triniti/acme-schemas/acme/iam/node/RoleV1';
import Policy from './Policy';

test('Policy isGranted tests', (t) => {
  const samples = [
    {
      name: 'simple exact match allow',
      action: 'acme:blog:command:create-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:command:create-article', 'acme:blog:command:edit-article']),
      ],
      expected: true,
    },

    {
      name: 'simple exact match deny',
      action: 'acme:blog:command:create-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:command:create-article', 'acme:blog:command:edit-article'])
          .addToSet('denied', ['acme:blog:command:create-article']),
      ],
      expected: false,
    },

    {
      name: 'message level wildcard',
      action: 'acme:blog:command:create-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:command:*']),
      ],
      expected: true,
    },

    {
      name: 'category level wildcard',
      action: 'acme:blog:command:create-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:*']),
      ],
      expected: true,
    },

    {
      name: 'category level wildcard with deny on commands',
      action: 'acme:blog:command:create-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:*'])
          .addToSet('denied', ['acme:blog:command:*']),
      ],
      expected: false,
    },

    {
      name: 'category level wildcard with a set of deny on commands',
      action: 'acme:blog:command:delete-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:*'])
          .addToSet('denied', ['acme:blog:command:create-article', 'acme:blog:command:edit-article']),
      ],
      expected: true,
    },

    {
      name: 'top level wildcard allowed',
      action: 'acme:blog:create-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['*'])
          .addToSet('denied', ['']),
      ],
      expected: true,
    },

    {
      name: 'top level wildcard allowed with deny on package level',
      action: 'acme:blog:request:get-userid',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['*'])
          .addToSet('denied', ['acme:blog:*']),
      ],
      expected: false,
    },

    {
      name: 'action allowed with deny on command level',
      action: 'acme:blog:command:create-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:command:create-article'])
          .addToSet('denied', ['acme:blog:command:*']),
      ],
      expected: false,
    },

    {
      name: 'multiple roles',
      action: 'acme:blog:command:delete-article',
      roles: [
        Role.create()
          .set('_id', RoleId.fromString('a-new-role'))
          .addToSet('allowed', ['acme:blog:command:create-article'])
          .addToSet('denied', ['acme:blog:command:*']),
        Role.create()
          .set('_id', RoleId.fromString('a-super-user'))
          .addToSet('allowed', ['*']),
      ],
      expected: false,
    },
  ];

  const len = samples.length;

  for (let i = 0; i < len; i += 1) {
    const policy = new Policy(samples[i].roles);
    t.same(policy.isGranted(samples[i].action), samples[i].expected, samples[i].message);
  }

  t.end();
});

test('Policy hasRole Tests', (t) => {
  const samples = [
    {
      name: 'simple role exists',
      roles: [
        Role.fromObject({ _id: 'administrator' }),
      ],
      role: 'administrator',
      expected: true,
    },

    {
      name: 'simple role don\'t exist',
      roles: [
        Role.fromObject({ _id: 'designer' }),
      ],
      role: 'editor',
      expected: false,
    },

    {
      name: 'multiple roles sample',
      roles: [
        Role.fromObject({ _id: 'administrator' }),
        Role.fromObject({ _id: 'editor' }),
      ],
      role: 'editor',
      expected: true,
    },
  ];

  const len = samples.length;

  for (let i = 0; i < len; i += 1) {
    const policy = new Policy(samples[i].roles);
    t.same(policy.hasRole(samples[i].role), samples[i].expected, samples[i].message);
  }

  t.end();
});
