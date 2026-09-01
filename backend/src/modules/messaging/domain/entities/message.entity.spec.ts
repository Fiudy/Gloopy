import { Message } from './message.entity';

describe('Message', () => {
  it('permite editar texto próprio dentro de 15 minutos', () => {
    const message = Message.createText({ conversationId: 'conversation', senderId: 'sender', content: 'Oi' }, 'message');
    message.edit('sender', 'Olá');
    expect(message.content).toBe('Olá');
    expect(message.editedAt).toBeInstanceOf(Date);
  });

  it('rejeita edição por outra pessoa ou fora da janela', () => {
    const recent = Message.createText({ conversationId: 'conversation', senderId: 'sender', content: 'Oi' }, 'recent');
    expect(() => recent.edit('other', 'Não')).toThrow('Apenas quem enviou');
    const old = Message.restore({ ...recent.toPersistence(), createdAt: new Date(Date.now() - 16 * 60 * 1000), deletedForUserIds: new Set() }, 'old');
    expect(() => old.edit('sender', 'Tarde')).toThrow('expirou');
  });

  it('aplica exclusão por usuário e para todos', () => {
    const message = Message.createText({ conversationId: 'conversation', senderId: 'sender', content: 'Oi' }, 'message');
    message.deleteForMe('viewer');
    expect(message.isDeletedFor('viewer')).toBe(true);
    message.deleteForEveryone('sender');
    expect(message.isDeletedFor('sender')).toBe(true);
  });
});
