import { Contract } from '@stellar/stellar-sdk';

export interface CreateProjectParams {
  creator: string;
  deadline: number;
  goal: number;
  project_id: string;
}

export interface IContract extends Contract {
  create_project(params: CreateProjectParams): Promise<any>;
} 