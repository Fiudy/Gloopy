/**
 * Classe base para entidades de domínio.
 * Toda entidade tem identidade própria (id) - duas entidades são iguais
 * se tiverem o mesmo id, independente dos demais atributos.
 */
export abstract class Entity<Props> {
  protected readonly _id: string;
  protected props: Props;

  protected constructor(props: Props, id: string) {
    this._id = id;
    this.props = props;
  }

  get id(): string {
    return this._id;
  }

  equals(entity?: Entity<Props>): boolean {
    if (!entity) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
