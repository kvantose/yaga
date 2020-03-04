import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum CatalogCategory {
  CLOTHES = 'Одежда',
  HOODIES = 'Худи',
  TSHIRTS = 'Футболки',
  PANTS = 'Брюки',
  CARDIGANS = 'Кардиганы',
  ACCESSORIES = 'Аксессуары',
  JEWELRY = 'Украшения',
  HEADWEAR = 'Головные уборы',
  SCARVES = 'Шарфы',
  MITTENS = 'Варежки',
  BAGS = 'Сумки',
}

@Entity()
export class CatalogItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: CatalogCategory,
  })
  category: CatalogCategory;

  @Column('decimal')
  price: number;

  @Column()
  image: string;
}
