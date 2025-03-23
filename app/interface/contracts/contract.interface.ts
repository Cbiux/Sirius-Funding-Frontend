import { Contract } from '@stellar/stellar-sdk';

export interface IBaseContractClient {
  readonly options: any;
  toXDR(): string;
}

export interface IContract extends IBaseContractClient {
  create_project({
    project_id,
    creator,
    goal,
    deadline,
  }: {
    project_id: string;
    creator: string;
    goal: number;
    deadline: number;
  }): Promise<this>;
}