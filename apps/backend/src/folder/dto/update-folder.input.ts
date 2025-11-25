import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateFolderInput } from './create-folder.input';

@InputType()
export class UpdateFolderInput extends PartialType(CreateFolderInput) {
  @Field(() => ID)
  @IsNotEmpty()
  @IsString()
  id: string;
}