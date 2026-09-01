export declare abstract class Entity<Props> {
    protected readonly _id: string;
    protected props: Props;
    protected constructor(props: Props, id: string);
    get id(): string;
    equals(entity?: Entity<Props>): boolean;
}
