import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class FeedbackDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  question: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  telegram: string;
}
