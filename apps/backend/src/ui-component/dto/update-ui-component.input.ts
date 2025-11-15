import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateUIComponentInput } from './create-ui-component.input';

@InputType()
export class UpdateUIComponentInput extends PartialType(CreateUIComponentInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;
}