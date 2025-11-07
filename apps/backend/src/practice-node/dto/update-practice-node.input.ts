import { InputType, Field, Int, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { CreatePracticeNodeInput } from './create-practice-node.input';

@InputType()
export class UpdatePracticeNodeInput extends PartialType(CreatePracticeNodeInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;
}